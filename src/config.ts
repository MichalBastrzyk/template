export const UPLOAD_CONFIG = {
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_MIME_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ] as const,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME!,
} as const;

export type AllowedMimeType = (typeof UPLOAD_CONFIG.ALLOWED_MIME_TYPES)[number];
