# Pakfactory RAG chatbot

I have implemented a chatbot using Nextjs and Chat SDK that utilizes a Retrieval-Augmented Generation (RAG) pipeline. The goal of this project is to build a conversational interface that helps users design packaging soluctions as an AI powered packing consultant.

## Demo flow

```bash
Next.js Chat UI
      ↓
API route
      ↓
Generate embedding
      ↓
Pinecone vector search
      ↓
Get document chunks
      ↓
Send to LLM
      ↓
Stream response
```

## RAG pipeline workflow

1. Document Collection (User query)
2. Preprocessing / Chunking
3. Embedding
4. Vector Database (Pinecone)
5. Similarity Search
6. LLM (ChatGPT) for response generation

## Tech Stack

- Nextjs
- Shadcn UI
- AI SDK
- Pinecone (Vector Database)
- Supabase

## Supabase Types

```bash
npx supabase gen types typescript --project-id "xkgnsouomskjbdzwjpab" --schema public > database.types.ts
```
