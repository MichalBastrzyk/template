import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
  },

  clientPrefix: "VITE_",
  client: {
    VITE_APP_TITLE: z.string().min(1).optional(),
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
