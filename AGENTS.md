# AGENTS.md

## Directives for AI Agents
**Goal:** Maintain architectural integrity, code quality, and consistency across the "TanStack Start" codebase.

### 1. Tech Stack & Core Libraries
You are working in a modern, high-performance TypeScript stack. **Do not introduce new libraries** without explicit user permission. Stick to these defaults:

- **Runtime/Manager:** **ALWAYS use Bun**. Never use npm, yarn, or pnpm.
- **Framework:** [TanStack Start](https://tanstack.com/start/latest) (Vite-based SSR/CSR).
- **Language:** TypeScript (Strict mode).
- **Database:** Postgres + [Drizzle ORM](https://orm.drizzle.team/).
- **API:** [tRPC](https://trpc.io/) (Backend-for-Frontend).
- **State Management:** TanStack Query (via tRPC).
- **Auth:** [Better Auth](https://www.better-auth.com/).
- **UI Styling:** Tailwind CSS v4 + [Shadcn UI](https://ui.shadcn.com/).
- **Routing:** [TanStack Router](https://tanstack.com/router/latest) (File-based in `src/routes`).
- **Emails:** React Email + Nodemailer.
- **Linting:** `oxlint` & `oxfmt` (Biome-like speed).

---

### 2. Architectural Rules

#### A. File Structure
- **Routes (`src/routes/`)**:
    - File-based routing. Use `__root.tsx` for layouts.
    - Use `$` for params (e.g., `users.$userId.tsx`).
    - Keep route files thin; delegate logic to components or hooks.
- **Server (`src/server/`)**:
    - `db/schema/`: Split schema files. **Always** define schema here.
    - `routers/`: tRPC routers.
    - `auth.ts`: Better Auth configuration.
- **Components (`src/components/`)**:
    - `ui/`: Shadcn primitives (do not modify manually unless necessary).
    - `common/`: Reusable app components.
- **Environment (`src/env.ts`)**:
    - **Never** use `process.env` directly. Import `env` from `@/env`.

#### B. Database Operations (Drizzle)
- **Schema Changes**:
    1. Modify files in `src/server/db/schema/`.
    2. Run `bun run db:push` to sync with DB.
    3. **Do not** write raw SQL migrations unless edge cases require it.
- **Queries**: Use the query builder pattern (`db.query.users.findMany(...)`) over raw SQL.

#### C. API & Data Fetching (tRPC)
- **No `fetch` in Components**: Always use tRPC hooks (`trpc.post.byId.useQuery(...)`).
- **Server Actions**: Define mutations in tRPC routers, not separate API routes.
- **Validation**: Use `zod` for all input validation in tRPC procedures.

#### D. Styling (Tailwind + Shadcn)
- **Utility First**: Use Tailwind classes. Avoid `.css` files.
- **Consistency**: Use `cn()` (clsx + tailwind-merge) for conditional classes.
- **Theming**: Rely on CSS variables defined in `src/styles/app.css` (or similar) for colors (e.g., `bg-background`, `text-foreground`).

---

### 3. Coding Standards & Anti-Patterns

- **Naming**:
    - Files: `kebab-case.ts` (except React components: `PascalCase.tsx` or `kebab-case.tsx` if routing requires it).
    - Variables: `camelCase`.
    - DB Tables: `snake_case` (defined in `drizzle.config.ts`).
- **Imports**: Use absolute imports `@/` configured in `tsconfig.json`.
- **Type Safety**: Avoid `any`. Use `unknown` or explicit types.
- **Async/Await**: Prefer `async/await` over `.then()`.

#### Forbidden Actions
- **Do NOT** create `pages` directory (this is not Next.js).
- **Do NOT** use `prisma` (we use Drizzle).
- **Do NOT** use `axios` (use tRPC or standard `fetch` if strictly needed outside tRPC).
- **Do NOT** inline SVG icons (use `lucide-react`).

---

### 4. Operational Workflows

#### New Feature Checklist
1. **Schema**: Does it need a DB change? Update `schema/*` -> `db:push`.
2. **Backend**: Create/Update tRPC router in `src/server/routers/`.
3. **Frontend**: Create route in `src/routes/` or component in `src/components/`.
4. **Verify**: Run `bun run typecheck` (if script exists) or `bun run build` to ensure type safety.

#### Error Handling
- Use `TRPCError` on the server.
- Use `<ErrorBoundary>` from `react-error-boundary` or TanStack Router's `errorComponent` on the client.
