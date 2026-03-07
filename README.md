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

- [x] Extract text from various document formats (PDF → text, Word → text, etc.)
- [x] Split documents into manageable chunks and store in `document_chunks` table
- [x] Each chunk includes:
  - `content`: Chunk text content
  - `chunk_index`: Position within the document
  - `token_count`: For LLM context calculation

### 3️⃣ Embedding Generation

- [x] Convert chunk text to embeddings using OpenAI text-embedding-3-large (1024 dimensions)
- [x] Use Vercel AI Gateway for embedding API calls
- [x] Process chunks in batches of 10 to avoid rate limits
- [x] Use chunk ID pattern: `${documentId}_${chunkId}` as Pinecone vector ID

### 4️⃣ Vector Database Upload

- [x] Upload embeddings to Pinecone vector database
- [x] Include comprehensive metadata:
  - `documentId`: Source document reference
  - `chunkId`: Database chunk ID
  - `chunkIndex`: Position ordering
  - `text`: Truncated text preview (500 chars)
  - `tokenCount`: Token count for context management
  - `userId`: For multi-tenancy support
- [x] Error handling with graceful degradation (documents still process if embeddings fail)

### 5️⃣ RAG Query Implementation

- [x] Generate embeddings for user questions using same OpenAI model
- [x] Search Pinecone for similar vectors with optional document filter
- [x] Send context and question to Claude via Vercel AI Gateway
- [x] Stream response back to user with real-time updates with @ai-sdk/react
- [x] Include source attribution and context chunk count in headers

## ✅ Implementation Status

### **🔧 Configuration**

- ✅ **Environment Setup**: All necessary environment variables documented
- ✅ **Vercel AI Gateway**: Configured for both embeddings and chat completion
- ✅ **Pinecone Integration**: Vector database properly configured
- ✅ **Supabase Integration**: Database and storage properly configured

## 🚀 How to Use

1. **Upload Documents**: Upload PDF, Word, or Markdown files via the interface
2. **Wait for Processing**: Documents are automatically processed and embedded
3. **Start Chatting**: Click the chat button and ask questions about your documents
4. **Get AI Responses**: Receive contextually-aware responses based on your document content

## 🔍 API Endpoints

- `POST /api/upload-document` - Upload and process documents
- `GET /api/get-chunks` - Retrieve document chunks with optional semantic search
- `POST /api/chat` - RAG-powered chat with streaming responses
- `GET /api/pinecone-stats` - Vector database statistics
- `POST /api/process-document` - Manually trigger document processing

## Models we're using:

1. For embeddings: openai/text-embedding-3-large (1024
   dimensions)
2. For chat/RAG responses:
   anthropic/claude-haiku-4.5

## Conceptual Flow

```bash
PDF upload
↓
Extract text
↓
Chunk text
↓
Create embeddings
↓
Store in Pinecone
↓
User asks question
↓
Embed question
↓
Search Pinecone
↓
Retrieve chunks
↓
Send chunks to LLM
↓
Generate answer
```
