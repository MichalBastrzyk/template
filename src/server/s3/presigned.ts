import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { s3Client } from "../s3";
import { env } from "@/env";

export interface PresignedPostResult {
  url: string;
  fields: Record<string, string>;
  filePath: string;
}

export async function generatePresignedUploadUrl(params: {
  filename: string;
  contentType: string;
  fileSize: number;
}): Promise<PresignedPostResult> {
  const date = new Date().toISOString().split("T")[0];
  const uuid = crypto.randomUUID().split("-")[0];
  const extension = filename.split(".").pop();
  const key = `upload/${date}/${uuid}.${extension}`;

  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
    Conditions: [
      ["eq", "$Content-Type", params.contentType],
      ["content-length-range", 0, params.fileSize],
    ],
    Fields: {
      "Content-Type": params.contentType,
    },
    Expires: 900, // 15 minutes
  });

  return { url, fields, filePath: key };
}
