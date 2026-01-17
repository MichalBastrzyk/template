import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    DATABASE_URL: z.url(),

    BETTER_AUTH_SECRET: z.string().min(1),

    // S3-compatible storage configuration
    S3_ENDPOINT: z.url(),
    S3_REGION: z.string().default("auto"),
    S3_ACCESS_KEY_ID: z.string().min(1),
    S3_SECRET_ACCESS_KEY: z.string().min(1),
    S3_BUCKET_NAME: z.string().min(1),
    S3_PUBLIC_URL: z.url().optional(),

    // SMTP Configuration for email sending
    // Optional fields allow for flexible configuration across environments
    SMTP_HOST: z.string().default("localhost"),
    SMTP_PORT: z.coerce.number().default(1025),
    SMTP_SECURE: z
      .string()
      .default("false")
      .transform((val) => val === "true" || val === "1"),
    SMTP_USER: z.string().optional(),
    SMTP_PASSWORD: z.string().optional(),
    SMTP_FROM_EMAIL: z.string().email().default("noreply@example.com"),
    SMTP_FROM_NAME: z.string().default("Hackathon Template"),
  },

  clientPrefix: "VITE_",
  client: {
    VITE_APP_TITLE: z.string().min(1).optional(),
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
