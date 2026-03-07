import { queryVectors } from "@/src/lib/pinecone-utils"
import { createClient } from "@supabase/supabase-js"
import { createGateway, embed, streamText } from "ai"
import { NextRequest, NextResponse } from "next/server"

// Create AI Gateway client
const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY!,
})

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { messages, documentId } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      )
    }

    // Get the latest user message
    const latestMessage = messages[messages.length - 1]

    // Log the received message for debugging
    console.log(
      "Latest message received:",
      JSON.stringify(latestMessage, null, 2)
    )

    // Handle all message body formats from various AI SDK versions
    let userQuestion = ""

    if (typeof latestMessage.content === "string") {
      userQuestion = latestMessage.content
    } else if (typeof latestMessage.text === "string") {
      userQuestion = latestMessage.text
    } else if (Array.isArray(latestMessage.parts)) {
      // Handle the new "parts" format seen in logs
      userQuestion = latestMessage.parts
        .filter((part: any) => part.type === "text")
        .map((part: any) => part.text)
        .join("")
    } else if (Array.isArray(latestMessage.content)) {
      // Handle array of content parts
      userQuestion = latestMessage.content
        .filter((part: any) => part.type === "text")
        .map((part: any) => part.text || part.content)
        .join("")
    }

    if (!userQuestion || typeof userQuestion !== "string") {
      console.error("Invalid user question extracted:", {
        userQuestion,
        message: latestMessage,
      })
      return NextResponse.json(
        { error: "User question must be a non-empty string" },
        { status: 400 }
      )
    }

    // Step 1: Generate embedding for the user's question
    const embedModel = gateway.embeddingModel("openai/text-embedding-3-large")
    const { embedding } = await embed({
      model: embedModel,
      value: userQuestion,
      providerOptions: {
        openai: {
          dimensions: 1024,
        },
      },
    })

    // Debug: Log embedding info
    console.log(`Generated embedding for question: "${userQuestion}"`)
    console.log(`Embedding dimensions: ${embedding.length}`)

    // Step 2: Search Pinecone for relevant document chunks
    const filter = documentId ? { documentId } : undefined
    const searchResults = await queryVectors(embedding, 5, filter) // Get top 5 most relevant chunks

    // Step 3: Fetch full chunk content from Supabase for better context
    const chunkIds = searchResults.matches
      .filter((match) => match.score && match.score > 0.1)
      .map((match) => {
        const parts = match.id.split("_")
        return parts.length > 1 ? parts[1] : match.id
      })

    let context = ""
    let contextChunks = []

    if (chunkIds.length > 0) {
      const { data: chunks, error: dbError } = await supabase
        .from("document_chunks")
        .select("id, content, chunk_index, document_id")
        .in("id", chunkIds)

      if (dbError) {
        console.error("Error fetching full chunks from Supabase:", dbError)
        // Fallback to Pinecone metadata if Supabase fails
        contextChunks = searchResults.matches
          .filter((match) => match.score && match.score > 0.1)
          .map((match) => ({
            text: match.metadata?.text || "",
            score: match.score || 0,
            documentId: match.metadata?.documentId || "",
            chunkId: match.metadata?.chunkId || "",
          }))
      } else {
        // Sort chunks by Pinecone score order
        contextChunks = chunkIds
          .map((id) => {
            const chunk = chunks.find((c: any) => c.id === id)
            const match = searchResults.matches.find((m) => m.id.includes(id))
            return {
              text: chunk?.content || "",
              score: match?.score || 0,
              documentId: chunk?.document_id || "",
              chunkId: id,
            }
          })
          .filter((c) => c.text !== "")
      }

      context = contextChunks.map((chunk) => chunk.text).join("\n\n")
    }

    // Step 4: Create system prompt with context
    const systemPrompt = `You are a helpful AI assistant that answers questions based on the provided context from uploaded documents.

Instructions:
- Answer the user's question using ONLY the information provided in the context below
- If the context doesn't contain relevant information to answer the question, say "I don't have enough information in the provided documents to answer that question."
- Be concise and accurate
- If you reference specific information, you can mention it comes from the uploaded documents
- Do not make up information that isn't in the context

Context from relevant documents:
${context}`

    // Debug: Log system prompt info
    console.log(`Context length: ${context.length} characters`)
    console.log(`System prompt preview: ${systemPrompt.substring(0, 200)}...`)

    // Step 5: Clean and normalize messages for the AI SDK CoreMessage schema
    const coreMessages = messages.map((m: any) => {
      let content = m.content

      // If content is missing but parts or text exists, normalize it
      if (!content) {
        if (typeof m.text === "string") {
          content = m.text
        } else if (Array.isArray(m.parts)) {
          content = m.parts
            .filter((p: any) => p.type === "text")
            .map((p: any) => p.text)
            .join("")
        }
      }

      return {
        role:
          m.role === "user" ||
          m.role === "assistant" ||
          m.role === "system" ||
          m.role === "tool"
            ? m.role
            : "user",
        content: content || "",
      }
    })

    // Step 6: Stream response using Claude via Vercel AI Gateway
    const result = await streamText({
      model: gateway.languageModel("anthropic/claude-haiku-4.5"),
      system: systemPrompt,
      messages: coreMessages,
      temperature: 0.1, // Low temperature for factual responses
    })

    // Return streaming response - using UIMessageStream for compatibility with this version's useChat
    return result.toUIMessageStreamResponse({
      headers: {
        "X-Context-Chunks": contextChunks.length.toString(),
        "X-Document-Filter": documentId || "all",
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
