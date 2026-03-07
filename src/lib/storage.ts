import { S3Client } from '@aws-sdk/client-s3';

// Supabase Storage S3-compatible configuration
export const s3Client = new S3Client({
  endpoint: 'https://xkgnsouomskjbdzwjpab.storage.supabase.co/storage/v1/s3',
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.SUPABASE_PROJECT_ID || 'xkgnsouomskjbdzwjpab',
    secretAccessKey: process.env.SUPABASE_SECRET_KEY || '',
  },
  forcePathStyle: true, // Required for Supabase Storage
});

// Default bucket name for documents
export const DOCUMENTS_BUCKET = 'pakfactory';