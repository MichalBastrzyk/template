import { createFileRoute } from "@tanstack/react-router";
import { env } from "@/env";

export const Route = createFileRoute("/api_images__path__")({
  loader: async ({ params }) => {
    const path = params._;

    // Construct S3 public URL if configured
    if (env.S3_PUBLIC_URL) {
      return new URL(path, env.S3_PUBLIC_URL).toString();
    }

    // Otherwise, redirect to S3 endpoint with path-style access
    return new URL(
      path,
      `${env.S3_ENDPOINT}/${env.S3_BUCKET_NAME}`
    ).toString();
  },
});
