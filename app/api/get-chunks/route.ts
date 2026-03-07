import { queryVectors } from "@/src/lib/pinecone-utils"
import { createClient } from "@supabase/supabase-js"
import { createGateway, embed } from "ai"
import { NextRequest, NextResponse } from "next/server"

// Create AI Gateway client
const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY!,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get("documentId")
    const query = searchParams.get("query")
    const limit = parseInt(searchParams.get("limit") || "10")
    const useSemanticSearch = searchParams.get("semantic") === "true"

    // Semantic search with Pinecone
    if (useSemanticSearch && query) {
      try {
        // Generate embedding for the search query using AI Gateway
        // Use OpenAI text-embedding-3-large and ensure 1024 dimensions to match Pinecone index
        const embedModel = gateway.embeddingModel(
          "openai/text-embedding-3-large"
        )
        const { embedding } = await embed({
          model: embedModel,
          value: query,
          // Explicitly request 1024 dimensions to match Pinecone index
          providerOptions: {
            openai: {
              dimensions: 1024,
            },
          },
        })

        const queryVector = embedding

        // Search Pinecone for similar vectors
        const filter = documentId ? { documentId } : undefined
        const pineconeResults = await queryVectors(queryVector, limit, filter)

        // Get chunk details from database using Pinecone IDs
        const chunkIds = pineconeResults.matches.map((match) => {
          // Extract chunk ID from Pinecone vector ID (format: documentId_chunkId)
          const parts = match.id.split("_")
          return parts.length > 1 ? parts[1] : match.id
        })

        if (chunkIds.length === 0) {
          return NextResponse.json({
            chunks: [],
            count: 0,
            searchType: "semantic",
          })
        }

        let dbQuery = supabase
          .from("document_chunks")
          .select("*")
          .in("id", chunkIds)

        if (documentId) {
          dbQuery = dbQuery.eq("document_id", documentId)
        }

        const { data: chunks, error } = await dbQuery

        if (error) {
          console.error("Database error:", error)
          return NextResponse.json(
            { error: "Failed to fetch semantic search results" },
            { status: 500 }
          )
        }

        // Sort chunks by Pinecone similarity score
        const sortedChunks = chunks?.sort((a, b) => {
          const aScore =
            pineconeResults.matches.find((m) => m.id.includes(a.id))?.score || 0
          const bScore =
            pineconeResults.matches.find((m) => m.id.includes(b.id))?.score || 0
          return bScore - aScore // Higher score first
        })

        // Add similarity scores to chunks
        const enrichedChunks = sortedChunks?.map((chunk) => {
          const match = pineconeResults.matches.find((m) =>
            m.id.includes(chunk.id)
          )
          return {
            ...chunk,
            similarity_score: match?.score || 0,
          }
        })

        return NextResponse.json({
          chunks: enrichedChunks,
          count: enrichedChunks?.length || 0,
          searchType: "semantic",
          query,
        })
      } catch (semanticError) {
        console.error("Semantic search error:", semanticError)
        // Fall back to regular search
      }
    }

    // Regular database search
    let dbQuery = supabase
      .from("document_chunks")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (documentId) {
      dbQuery = dbQuery.eq("document_id", documentId)
    }

    // Text search within content
    if (query && !useSemanticSearch) {
      dbQuery = dbQuery.ilike("content", `%${query}%`)
    }

    const { data: chunks, error } = await dbQuery

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        { error: "Failed to fetch chunks" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      chunks,
      count: chunks?.length || 0,
      searchType: query ? "text" : "recent",
      query,
    })
  } catch (error) {
    console.error("Fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch chunks" },
      { status: 500 }
    )
  }
}
