-- Create document_chunks table
-- This table stores text chunks that will be used for embeddings and vector search

CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- For direct filtering without joins
    content TEXT NOT NULL,
    chunk_index INTEGER NOT NULL, -- Order of chunks for context reconstruction
    token_count INTEGER, -- Useful for LLM context management
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_user_id ON document_chunks(user_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_chunk_index ON document_chunks(document_id, chunk_index);

-- Ensure chunk_index is unique per document
CREATE UNIQUE INDEX IF NOT EXISTS idx_document_chunks_unique_index ON document_chunks(document_id, chunk_index);

-- Add RLS (Row Level Security) - optional for future auth
-- ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;