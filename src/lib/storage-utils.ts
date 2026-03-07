import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export const DOCUMENTS_BUCKET = 'pakfactory';

export interface UploadFileParams {
  key: string;
  file: Buffer | Uint8Array;
  contentType: string;
  userId: string;
}

export interface FileMetadata {
  key: string;
  size: number;
  lastModified: Date;
  contentType?: string;
}

/**
 * Ensure the documents bucket exists (bucket should be created in Supabase dashboard)
 */
export async function ensureBucketExists(bucketName: string = DOCUMENTS_BUCKET): Promise<void> {
  // Bucket should be created manually in Supabase dashboard
  // This function is kept for compatibility but does nothing
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile({
  key,
  file,
  contentType,
  userId
}: UploadFileParams): Promise<string> {
  // Prefix key with user ID for organization
  const prefixedKey = `${userId}/${key}`;
  
  const { data, error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(prefixedKey, file, {
      contentType,
      metadata: {
        userId,
        uploadedAt: new Date().toISOString()
      }
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
  
  // Return the public URL
  const { data: { publicUrl } } = supabase.storage
    .from(DOCUMENTS_BUCKET)
    .getPublicUrl(prefixedKey);
    
  return publicUrl;
}

/**
 * Download a file from Supabase Storage
 */
export async function downloadFile(key: string): Promise<Buffer> {
  const { data, error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .download(key);

  if (error) {
    throw new Error(`Download failed: ${error.message}`);
  }

  if (!data) {
    throw new Error('File not found');
  }

  return Buffer.from(await data.arrayBuffer());
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(key: string): Promise<void> {
  const { error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .remove([key]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * List files for a specific user
 */
export async function listUserFiles(userId: string): Promise<FileMetadata[]> {
  const { data, error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .list(`${userId}/`);

  if (error) {
    throw new Error(`List failed: ${error.message}`);
  }

  return (data || []).map(object => ({
    key: `${userId}/${object.name}`,
    size: object.metadata?.size || 0,
    lastModified: new Date(object.updated_at || object.created_at),
    contentType: object.metadata?.mimetype
  }));
}

/**
 * Generate a unique file key
 */
export function generateFileKey(originalFilename: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  const extension = originalFilename.split('.').pop();
  return `${timestamp}-${random}.${extension}`;
}