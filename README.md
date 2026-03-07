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

## Tasks

### 1️⃣ Document Storage

- [x] Upload original documents to Supabase Storage
- [x] Link with `documents` table via `file_url` column
- [x] Support PDF, Word, Markdown, and text files
- [x] Example: `supabase.storage.from('documents').upload(filePath, file)`

### 2️⃣ Document Text Extraction & Chunking

- [ ] Extract text from various document formats (PDF → text, Word → text, etc.)
- [ ] Split documents into manageable chunks and store in `document_chunks` table
- [ ] Each chunk includes:
  - `content`: Chunk text content
  - `chunk_index`: Position within the document
  - `token_count`: For LLM context calculation

### 3️⃣ Embedding Generation

- [ ] Convert chunk text to embeddings using OpenAI
- [ ] Use `text-embedding-3-small` model or Google Vertex AI
- [ ] Use chunk ID as Pinecone vector ID

### 4️⃣ Vector Database Upload

- [ ] Upload embeddings to Pinecone
- [ ] Include metadata:
  - `user_id`: For multi-tenancy
  - `document_id`: Source document reference
  - `chunk_index`: Position ordering

### 5️⃣ RAG Query Implementation

- [ ] Generate embeddings for user questions
- [ ] Search Pinecone for similar vectors with user filter: `{ user_id: ... }`
- [ ] Retrieve text content from Supabase using returned chunk IDs
- [ ] Send context and question to LLM for streaming response
