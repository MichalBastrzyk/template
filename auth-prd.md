# Authentication System PRD

## Overview

This document specifies the implementation of a complete email/password authentication system for a TanStack Start application using Better Auth. The system provides secure user registration, login, email verification, and password recovery flows with proper route protection and UX patterns.

---

## Scope

### In Scope (Phase 1)
| Feature | Description |
|---------|-------------|
| Email/Password Sign-up | User registration with name, email, password |
| Email/Password Sign-in | User login with credentials |
| Email Verification | Required verification before app access |
| Password Reset | Forgot password + reset via email token |
| Sign-out | Session termination |
| Protected Routes | Auth guards with redirect preservation |
| Auth Layout | Shared UI wrapper for auth pages |

### Out of Scope (Future Phases)
| Feature | Rationale |
|---------|-----------|
| OAuth Providers (Google, Apple, Facebook) | Deferred per user preference |
| Two-Factor Authentication (TOTP) | Deferred per user preference |
| Account Linking | Requires OAuth first |
| Username-based Auth | Email is sufficient |

---

## Technical Context

### Current State
```
src/
├── routes/
│   ├── __root.tsx          # Session fetching in beforeLoad (exists)
│   └── auth/
│       ├── route.tsx       # Layout wrapper (stub)
│       ├── sign-in.tsx     # Stub
│       ├── sign-up.tsx     # Stub
│       ├── sign-out.tsx    # Stub
│       └── verify-email.tsx # Stub
├── server/
│   ├── auth.ts             # Better Auth config (minimal)
│   ├── email.ts            # React Email + Nodemailer (ready)
│   └── db/schema/auth.ts   # Users, sessions, accounts, verifications (ready)
└── components/ui/          # Shadcn components (ready)
```

### Stack Constraints
- **Framework**: TanStack Start (file-based routing)
- **Auth Library**: Better Auth (`better-auth/minimal`)
- **Database**: Drizzle ORM + PostgreSQL
- **Email**: React Email + Nodemailer (via `src/server/email.ts`)
- **UI**: Shadcn UI + TanStack Form + Zod
- **Package Manager**: Bun only

---

## Route Architecture

### Final Route Map

| Route | Purpose | Auth State |
|-------|---------|------------|
| `/auth/route.tsx` | Layout wrapper (logo, card container) | Public |
| `/auth/sign-in.tsx` | Email/password login form | Public (redirects if authenticated) |
| `/auth/sign-up.tsx` | Registration form | Public (redirects if authenticated) |
| `/auth/verify-email.tsx` | Verification pending + token handler | Public |
| `/auth/forgot-password.tsx` | Request password reset | Public |
| `/auth/reset-password.tsx` | Set new password (token in URL) | Public |
| `/auth/sign-out.tsx` | Sign-out handler (action) | Authenticated |
| `/auth/error.tsx` | Error display (expired tokens, etc.) | Public |
| `/_authenticated/` | Protected layout (new) | Authenticated |
| `/_authenticated/dashboard.tsx` | Post-login landing (new) | Authenticated |

### Search Param Contract

All auth routes accept these search params:

| Param | Type | Purpose |
|-------|------|---------|
| `redirect` | `string` | Full URL or path to return to after auth success |
| `token` | `string` | Verification/reset token (verify-email, reset-password only) |
| `error` | `string` | Error code from Better Auth (`invalid_token`, etc.) |

---

## Flow Specifications

### Flow A: Email/Password Sign-in

```
User → GET /auth/sign-in?redirect=/dashboard
     ↓
     Submit credentials
     ↓
     [Valid + Email Verified] → Create session → Redirect to `redirect` param
     [Valid + Email NOT Verified] → 403 error → Show message + resend button
     [Invalid credentials] → Stay on page with error
```

**Implementation Notes:**
- Use `authClient.signIn.email()` from Better Auth client
- Handle 403 status for unverified email separately from auth errors
- Display form-level errors below submit button

### Flow B: Email/Password Sign-up

```
User → GET /auth/sign-up?redirect=/dashboard
     ↓
     Submit name + email + password
     ↓
     Create user (unverified) → Send verification email
     ↓
     Navigate to /auth/verify-email?email={email}&redirect=/dashboard
```

**Implementation Notes:**
- Use `authClient.signUp.email()` with `callbackURL` set to `/auth/verify-email`
- Encode email in URL for display purposes (not for security)
- Better Auth triggers `sendVerificationEmail` automatically

### Flow C: Email Verification

```
User → GET /auth/verify-email?email=...&redirect=/dashboard
     ↓
     [No token] → Show "Check your inbox" + resend button
     ↓
User clicks email link → GET /auth/verify-email?token=...&redirect=/dashboard
     ↓
     [Token valid] → Mark verified → Auto sign-in → Redirect
     [Token invalid/expired] → Navigate to /auth/error?error=invalid_token
```

**Implementation Notes:**
- Better Auth handles token verification at `/api/auth/verify-email?token=...`
- Configure `emailVerification.callbackURL` to redirect back to our route
- Use `authClient.sendVerificationEmail()` for resend functionality

### Flow D: Password Reset

```
User → GET /auth/forgot-password
     ↓
     Submit email
     ↓
     Always show success (prevents email enumeration)
     ↓
User clicks email link → GET /auth/reset-password?token=...
     ↓
     Submit new password
     ↓
     [Token valid] → Update password → Sign in → Redirect to /dashboard
     [Token invalid] → Navigate to /auth/error?error=invalid_token
```

**Implementation Notes:**
- Use `authClient.requestPasswordReset({ email, redirectTo: '/auth/reset-password' })`
- Use `authClient.resetPassword({ newPassword, token })`
- Token comes from URL search param

### Flow E: Sign-out

```
User → Trigger sign-out (button, link, or GET /auth/sign-out)
     ↓
     authClient.signOut()
     ↓
     Clear session → Redirect to /auth/sign-in
```

### Flow F: Protected Route Access

```
Unauthenticated user → GET /dashboard
     ↓
     beforeLoad: throw redirect({
       to: '/auth/sign-in',
       search: { redirect: location.href }
     })
     ↓
     User lands on /auth/sign-in?redirect=/dashboard
```

---

## Backend Configuration

### Better Auth Updates (`src/server/auth.ts`)

```typescript
import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { emailClient } from "@/server/email";
import { VerifyEmailTemplate, ResetPasswordTemplate } from "@/emails";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { /* existing */ },
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // NEW: Block login until verified

    sendResetPassword: async ({ user, url, token }, request) => {
      // Fire-and-forget to prevent timing attacks
      void emailClient.sendEmail({
        to: user.email,
        subject: "Reset your password",
        reactEmailTemplate: ResetPasswordTemplate({ url, name: user.name }),
      });
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      void emailClient.sendEmail({
        to: user.email,
        subject: "Verify your email address",
        reactEmailTemplate: VerifyEmailTemplate({ url, name: user.name }),
      });
    },
    callbackURL: "/auth/verify-email", // Where to redirect after verification
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  plugins: [tanstackStartCookies()],
});
```

### Auth Client (`src/lib/auth-client.ts`) - NEW FILE

```typescript
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_APP_URL || "http://localhost:3000",
});
```

---

## Frontend Implementation

### Protected Route Layout (`src/routes/_authenticated/route.tsx`)

```typescript
import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: "/auth/sign-in",
        search: { redirect: location.href },
      });
    }

    // Optional: Require verified email
    if (!context.user?.emailVerified) {
      throw redirect({
        to: "/auth/verify-email",
        search: { redirect: location.href },
      });
    }
  },
  component: () => <Outlet />,
});
```

### Auth Layout (`src/routes/auth/route.tsx`)

- Centered card container
- Logo/branding
- Redirect authenticated users away (inverse guard)

```typescript
beforeLoad: ({ context }) => {
  if (context.isAuthenticated && context.user?.emailVerified) {
    throw redirect({ to: "/dashboard" });
  }
}
```

### Form Components

Each auth form should use:
- **TanStack Form** with Zod validators
- **Field components** from `src/components/ui/field.tsx`
- **Shadcn primitives**: Button, Input, Card
- Loading states via `form.state.isSubmitting`
- Error handling via `onError` callbacks

---

## Email Templates (NEW)

Create React Email templates in `src/emails/`:

| Template | Purpose | Variables |
|----------|---------|-----------|
| `verify-email.tsx` | Email verification link | `url`, `name` |
| `reset-password.tsx` | Password reset link | `url`, `name` |

---

## Environment Variables

### Required (already defined)
```
BETTER_AUTH_SECRET=...
SMTP_HOST=...
SMTP_PORT=...
SMTP_FROM_EMAIL=...
SMTP_FROM_NAME=...
```

### Optional Addition
```
VITE_APP_URL=http://localhost:3000  # For auth client baseURL
```

---

## Validation Rules

| Field | Rules |
|-------|-------|
| Email | Valid email format, required |
| Password | Min 8 chars, max 128 chars, required |
| Name | Min 2 chars, max 100 chars, required |
| Confirm Password | Must match password (reset flow only) |

---

## Error Handling

### Error Codes (from Better Auth)

| Code | Display Message | Action |
|------|-----------------|--------|
| `invalid_token` | "This link has expired or is invalid" | Link to request new |
| `user_not_found` | (Never show - security) | Generic success |
| `invalid_credentials` | "Invalid email or password" | Stay on form |
| `email_not_verified` | "Please verify your email" | Show resend button |

### Error Page (`/auth/error.tsx`)

Display user-friendly error with:
- Clear explanation
- Action button (go to sign-in, request new link, etc.)
- No sensitive information exposure

---

## Implementation Checklist

### Phase 1: Backend Setup
- [x] Update `src/server/auth.ts` with email verification + password reset config
- [x] Create `src/lib/auth-client.ts` with Better Auth client
- [x] Create email templates in `src/emails/`
- [ ] Add `VITE_APP_URL` to env if needed

### Phase 2: Route Structure
- [x] Create `src/routes/_authenticated/route.tsx` (protected layout)
- [x] Create `src/routes/_authenticated/dashboard.tsx` (landing page)
- [x] Create `src/routes/auth/forgot-password.tsx`
- [x] Create `src/routes/auth/reset-password.tsx`
- [x] Create `src/routes/auth/error.tsx`
- [x] Update existing auth route stubs

### Phase 3: Forms & UI
- [x] Implement sign-in form with TanStack Form
- [x] Implement sign-up form
- [x] Implement verify-email page (pending + token handler)
- [x] Implement forgot-password form
- [x] Implement reset-password form
- [x] Implement sign-out action
- [x] Style auth layout with branding

### Phase 4: Integration & Testing
- [ ] Test full sign-up → verify → sign-in flow
- [ ] Test password reset flow
- [ ] Test protected route redirects
- [ ] Test redirect preservation across flows
- [ ] Test error states (expired tokens, invalid credentials)

---

## Open Questions

1. **Dashboard content**: What should appear on `/dashboard` after login? Placeholder for now?
2. **Session duration**: Current cookie cache is 5 minutes. Should full session be longer (e.g., 7 days)?
3. **Rate limiting**: Should we add rate limiting to sign-in/reset attempts?
4. **Remember me**: Should sign-in have a "remember me" checkbox for extended sessions?
