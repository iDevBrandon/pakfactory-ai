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
  const command = new GetObjectCommand({
    Bucket: DOCUMENTS_BUCKET,
    Key: key
  });

  const response = await s3Client.send(command);
  
  if (!response.Body) {
    throw new Error('File not found');
  }

  // Convert stream to buffer
  const chunks: Uint8Array[] = [];
  const stream = response.Body as any;
  
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  
  return Buffer.concat(chunks);
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: DOCUMENTS_BUCKET,
    Key: key
  });

  await s3Client.send(command);
}

/**
 * List files for a specific user
 */
export async function listUserFiles(userId: string): Promise<FileMetadata[]> {
  const command = new ListObjectsV2Command({
    Bucket: DOCUMENTS_BUCKET,
    Prefix: `${userId}/`
  });

  const response = await s3Client.send(command);
  
  return (response.Contents || []).map(object => ({
    key: object.Key!,
    size: object.Size || 0,
    lastModified: object.LastModified || new Date(),
    contentType: undefined // Would need separate HeadObject call to get this
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