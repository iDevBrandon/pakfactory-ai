import { Pinecone } from "@pinecone-database/pinecone"

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
})

export const getIndex = () => {
  return pinecone.index(process.env.PINECONE_INDEX_NAME!)
}

// Sample packaging knowledge documents for demo
export const sampleDocuments = [
  {
    id: "eco-materials-1",
    text: "FSC-certified uncoated 350gsm paper reduces carbon footprint by 42% compared to standard packaging. Use water-based tactile coating for premium feel.",
    metadata: {
      category: "eco-friendly",
      material: "paper",
      sustainability: "high",
    },
  },
  {
    id: "glass-solutions-1",
    text: "100% Post-Consumer Recycled (PCR) glass with thin-wall mold reduces weight by 15% while maintaining premium heft for luxury products.",
    metadata: { category: "luxury", material: "glass", sustainability: "high" },
  },
  {
    id: "corrugated-strength-1",
    text: "Corrugated fiberboard structural integrity optimized through edge crush test (ECT) ratings. 32 ECT minimum for shipping containers.",
    metadata: {
      category: "shipping",
      material: "corrugated",
      strength: "high",
    },
  },
]
