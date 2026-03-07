-- Create documents table
-- This table stores metadata about uploaded documents

CREATE TABLE IF NOT EXISTS documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_url TEXT, -- URL to file in Supabase Storage
    file_size BIGINT, -- File size in bytes
    file_type TEXT, -- MIME type (e.g., 'application/pdf', 'text/markdown')
    processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_processing_status ON documents(processing_status);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);

-- Add RLS (Row Level Security) - optional for future auth
-- ALTER TABLE documents ENABLE ROW LEVEL SECURITY;