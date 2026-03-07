import { createClient } from "@supabase/supabase-js"
import { createGateway, embed } from "ai"
import { createEmbeddingVector, upsertVectors } from "./pinecone-utils"
import { downloadFile } from "./storage-utils"
import { chunkText, getChunkingStats } from "./text-chunking"
import { extractText } from "./text-extraction"

// Create AI Gateway client
const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY!,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function processDocument(documentId: string) {
  // Get document from database
  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .single()

  if (docError || !document) {
    throw new Error("Document not found")
  }

  // Update document status to processing
  await supabase
    .from("documents")
    .update({ processing_status: "processing" })
    .eq("id", documentId)

  try {
    // Extract file key from URL
    const urlParts = document.file_url.split("/")
    const fileKey = urlParts.slice(-2).join("/") // userId/filename

    // Download file from storage
    const fileBuffer = await downloadFile(fileKey)

    // Extract text from document
    console.log(`Extracting text from document: ${document.title}`)
    const extractedText = await extractText(fileBuffer, document.file_type)

    // Chunk the text
    console.log(`Chunking text: ${extractedText.content.length} characters`)
    const chunks = chunkText(extractedText.content, {
      maxChunkSize: 1500,
      overlap: 200,
      preserveSentences: true,
    })

    const stats = getChunkingStats(chunks)
    console.log(
      `Created ${chunks.length} chunks with ${stats.totalTokens} total tokens`
    )

    // Delete existing chunks first to handle reprocessing
    const { error: deleteError } = await supabase
      .from("document_chunks")
      .delete()
      .eq("document_id", documentId)

    if (deleteError) {
      console.warn(
        `Warning: Failed to delete existing chunks: ${deleteError.message}`
      )
    }

    // Save chunks to database
    const chunkInserts = chunks.map((chunk) => ({
      document_id: documentId,
      user_id: document.user_id,
      content: chunk.content,
      chunk_index: chunk.chunkIndex,
      token_count: chunk.tokenCount,
    }))

    const { data: savedChunks, error: chunksError } = await supabase
      .from("document_chunks")
      .insert(chunkInserts)
      .select()

    if (chunksError) {
      throw new Error(`Failed to save chunks: ${chunksError.message}`)
    }

    // Generate embeddings and store in Pinecone
    console.log(
      `Generating embeddings for ${chunks.length} chunks using AI Gateway...`
    )
    try {
      // Process chunks in batches to avoid rate limits
      const batchSize = 10
      let totalStored = 0

      for (let i = 0; i < chunks.length; i += batchSize) {
        const batchChunks = chunks.slice(i, i + batchSize)
        const batchTexts = batchChunks.map((chunk) => chunk.content)

        console.log(
          `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chunks.length / batchSize)}...`
        )

        // Generate embeddings for the batch using AI Gateway
        const embedModel = gateway.embeddingModel(
          "openai/text-embedding-3-large"
        )
        const embeddingPromises = batchTexts.map((text) =>
          embed({
            model: embedModel,
            value: text,
            providerOptions: {
              openai: { dimensions: 1024 },
            },
          })
        )

        const embeddings = await Promise.all(embeddingPromises)

        // Create Pinecone vectors with matched IDs from Supabase
        const vectors = batchChunks.map((chunk, index) => {
          // Find the matching saved chunk from Supabase by index to get its real ID
          const savedChunk = savedChunks?.find(
            (sc) => sc.chunk_index === chunk.chunkIndex
          )
          const chunkId = savedChunk?.id

          if (!chunkId) {
            console.error(
              `Warning: Could not find Supabase ID for chunk index ${chunk.chunkIndex}`
            )
          }

          let embedding = embeddings[index].embedding

          // Ensure dimension is exactly 1024
          if (embedding.length !== 1024) {
            console.log(
              `Normalizing embedding from ${embedding.length} to 1024 dimensions...`
            )
            if (embedding.length > 1024) {
              embedding = embedding.slice(0, 1024)
            } else {
              embedding = [
                ...embedding,
                ...new Array(1024 - embedding.length).fill(0),
              ]
            }
          }

          return createEmbeddingVector(
            `${documentId}_${chunkId || "missing_" + chunk.chunkIndex}`,
            embedding,
            {
              documentId,
              chunkId: chunkId || "",
              chunkIndex: chunk.chunkIndex,
              text: chunk.content.substring(0, 500),
              tokenCount: chunk.tokenCount,
              userId: document.user_id,
            }
          )
        })

        await upsertVectors(vectors)
        totalStored += vectors.length
        console.log(
          `Uploaded batch to Pinecone (${totalStored}/${chunks.length} chunks)`
        )
      }

      console.log(
        `Successfully completed Pinecone sync for document ${documentId}`
      )
    } catch (embeddingError) {
      console.error(
        "Critical failure in embedding/Pinecone pipeline:",
        embeddingError
      )
      // Throwing error here will mark document as failed in the outer catch block
      throw embeddingError
    }

    // Update document with processing results
    await supabase
      .from("documents")
      .update({
        processing_status: "completed",
        total_chunks: chunks.length,
        total_tokens: stats.totalTokens,
        word_count: extractedText.metadata.wordCount,
        character_count: extractedText.metadata.characterCount,
        page_count: extractedText.metadata.pageCount || null,
      })
      .eq("id", documentId)

    return {
      success: true,
      documentId,
      stats: {
        ...stats,
        extractedMetadata: extractedText.metadata,
      },
    }
  } catch (processingError) {
    console.error("Processing error:", processingError)

    // Update document status to failed
    await supabase
      .from("documents")
      .update({
        processing_status: "failed",
        error_message:
          processingError instanceof Error
            ? processingError.message
            : "Unknown processing error",
      })
      .eq("id", documentId)

    throw processingError
  }
}
