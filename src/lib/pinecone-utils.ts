import type { RecordMetadata } from "@pinecone-database/pinecone"
import { pineconeIndex } from "./pinecone"

export interface PineconeVector {
  id: string
  values?: number[]
  text?: string
  metadata?: RecordMetadata
}

export interface QueryResponse {
  matches: Array<{
    id: string
    score: number
    values?: number[]
    metadata?: RecordMetadata
  }>
}

export async function upsertVectors(vectors: PineconeVector[]): Promise<void> {
  try {
    await pineconeIndex.upsert({
      records: vectors,
    })
  } catch (error) {
    console.error("Error upserting vectors to Pinecone:", error)
    throw error
  }
}

export async function queryVectors(
  vectorOrText: number[] | string,
  topK: number = 10,
  filter?: RecordMetadata
): Promise<QueryResponse> {
  try {
    const queryRequest: any = {
      topK,
      includeMetadata: true,
      includeValues: false,
      ...(filter && { filter }),
    }

    if (typeof vectorOrText === "string") {
      queryRequest.text = vectorOrText
    } else {
      queryRequest.vector = vectorOrText
    }

    const result = await pineconeIndex.query(queryRequest)

    return {
      matches: result.matches.map((match) => ({
        id: match.id,
        score: match.score || 0,
        values: match.values,
        metadata: match.metadata,
      })),
    }
  } catch (error) {
    console.error("Error querying vectors from Pinecone:", error)
    throw error
  }
}

export async function deleteVectors(ids: string[]): Promise<void> {
  try {
    await pineconeIndex.deleteMany(ids)
  } catch (error) {
    console.error("Error deleting vectors from Pinecone:", error)
    throw error
  }
}

export async function getIndexStats() {
  try {
    return await pineconeIndex.describeIndexStats()
  } catch (error) {
    console.error("Error getting index stats from Pinecone:", error)
    throw error
  }
}

export function createEmbeddingVector(
  id: string,
  embedding: number[],
  metadata: RecordMetadata = {}
): PineconeVector {
  return {
    id,
    values: embedding,
    metadata,
  }
}

export function createTextVector(
  id: string,
  text: string,
  metadata: RecordMetadata = {}
): PineconeVector {
  return {
    id,
    text,
    metadata,
  }
}
