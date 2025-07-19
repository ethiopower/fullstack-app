import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error('AWS credentials not found');
}

if (!process.env.AWS_S3_BUCKET) {
  throw new Error('AWS S3 bucket not specified');
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET;

export async function uploadFile(file: Buffer, originalName: string): Promise<string> {
  const ext = originalName.split('.').pop();
  const key = `uploads/${uuidv4()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: `image/${ext}`
  });

  await s3Client.send(command);

  // Generate a signed URL that expires in 1 week
  const getCommand = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key
  });

  const signedUrl = await getSignedUrl(s3Client, getCommand, {
    expiresIn: 604800 // 7 days
  });

  return signedUrl;
}

export async function deleteFile(url: string): Promise<void> {
  // Extract the key from the URL
  const key = url.split('/').pop();

  if (!key) {
    throw new Error('Invalid file URL');
  }

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: `uploads/${key}`
  });

  await s3Client.send(command);
}

export async function getSignedFileUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key
  });

  return getSignedUrl(s3Client, command, {
    expiresIn: 604800 // 7 days
  });
} 