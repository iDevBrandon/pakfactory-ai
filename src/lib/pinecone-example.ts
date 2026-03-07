import {
  createEmbeddingVector,
  getIndexStats,
  queryVectors,
  upsertVectors,
} from "./pinecone-utils"

export async function examplePineconeUsage() {
  try {
    // Get index statistics
    const stats = await getIndexStats()
    console.log("Index stats:", stats)

    // Example: Create and upsert a vector
    const exampleEmbedding = new Array(1536).fill(0).map(() => Math.random())
    const vector = createEmbeddingVector("example-doc-1", exampleEmbedding, {
      text: "This is an example document",
      source: "example.txt",
      timestamp: new Date().toISOString(),
    })

    await upsertVectors([vector])
    console.log("Vector upserted successfully")

    // Example: Query similar vectors
    const queryEmbedding = new Array(1536).fill(0).map(() => Math.random())
    const results = await queryVectors(queryEmbedding, 5)
    console.log("Query results:", results)

    return results
  } catch (error) {
    console.error("Pinecone example error:", error)
    throw error
  }
}

// Example for document processing pipeline
export async function storeDocumentEmbedding(
  documentId: string,
  chunkId: string,
  embedding: number[],
  text: string,
  metadata: Record<string, string | number | boolean> = {}
) {
  const vector = createEmbeddingVector(`${documentId}_${chunkId}`, embedding, {
    documentId,
    chunkId,
    text,
    ...metadata,
  })

  await upsertVectors([vector])
}

// Example for semantic search
export async function semanticSearch(
  queryEmbedding: number[],
  documentId?: string,
  limit: number = 10
) {
  const filter = documentId ? { documentId } : undefined
  return await queryVectors(queryEmbedding, limit, filter)
}
