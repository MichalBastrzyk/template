import { db } from "@/server/db/client";
// Minimal version doesn't include kysely which reduces bundle size
import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import * as authSchema from "@/server/db/schema/auth";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: authSchema.usersTable,
      session: authSchema.sessionsTable,
      account: authSchema.accountsTable,
      verification: authSchema.verificationsTable,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  plugins: [tanstackStartCookies()],
  experimental: {
    joins: true,
  },
});
