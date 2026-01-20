import { db } from "@/server/db/client";
import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { user, session, account, verification } from "@/server/db/schema/auth";
import { emailClient } from "./email";
import { VerifyEmailTemplate } from "../../emails/verify-email";
import { ResetPasswordTemplate } from "../../emails/reset-password";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: user,
      session: session,
      account: account,
      verification: verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,

    sendResetPassword: async ({ user, url }) => {
      void emailClient.sendEmail({
        to: user.email,
        subject: "Reset your password",
        reactEmailTemplate: ResetPasswordTemplate({
          resetUrl: url,
          userName: user.name,
        }),
      });
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      void emailClient.sendEmail({
        to: user.email,
        subject: "Verify your email address",
        reactEmailTemplate: VerifyEmailTemplate({
          verificationUrl: url,
          userName: user.name,
        }),
      });
    },
    callbackURL: "/auth/verify-email",
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  plugins: [tanstackStartCookies()],
  experimental: {
    joins: true,
  },
});
