import { 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand,
  ListObjectsV2Command,
  CreateBucketCommand,
  HeadBucketCommand 
} from '@aws-sdk/client-s3';
import { s3Client, DOCUMENTS_BUCKET } from './storage';

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
 * Ensure the documents bucket exists
 */
export async function ensureBucketExists(bucketName: string = DOCUMENTS_BUCKET): Promise<void> {
  try {
    // Check if bucket exists
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
  } catch (error: any) {
    if (error.name === 'NotFound') {
      // Create bucket if it doesn't exist
      await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
    } else {
      throw error;
    }
  }
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
  
  await ensureBucketExists();
  
  const command = new PutObjectCommand({
    Bucket: DOCUMENTS_BUCKET,
    Key: prefixedKey,
    Body: file,
    ContentType: contentType,
    Metadata: {
      userId,
      uploadedAt: new Date().toISOString()
    }
  });

  await s3Client.send(command);
  
  // Return the file URL
  return `https://xkgnsouomskjbdzwjpab.storage.supabase.co/storage/v1/object/public/${DOCUMENTS_BUCKET}/${prefixedKey}`;
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