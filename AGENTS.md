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
- **UI Styling:** Tailwind CSS v4 + [Shadcn UI](https://ui.shadcn.com/). (Check https://ui.shadcn.com/llms.txt for latest docs).
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
    - **Dev Server Check**: Always verify the dev server is running before adding/modifying routes. Use `lsof -i :5173` (or appropriate port) to check.
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
- **Do NOT** build custom UI components when Shadcn UI components are available.

#### Component Usage Priority
**ALWAYS** use components from `src/components/ui/` before building custom solutions. Available components include:
- `accordion`, `alert-dialog`, `alert`, `aspect-ratio`, `avatar`
- `badge`, `breadcrumb`, `button-group`, `button`, `calendar`, `card`
- `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`
- `dialog`, `drawer`, `dropdown-menu`, `empty`, `field`, `hover-card`
- `input-group`, `input-otp`, `input`, `item`, `kbd`, `label`, `menubar`
- `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`
- `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`
- `skeleton`, `slider`, `sonner`, `spinner`, `switch`, `table`, `tabs`
- `textarea`, `toggle-group`, `toggle`, `tooltip`

**Rule**: If a UI component exists in this list, you MUST use it instead of building a custom version. Custom components should only be created when:
1. The required functionality doesn't exist in Shadcn UI
2. You need to compose multiple Shadcn components together for a complex feature

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

---

### 5. Form Handling (TanStack Form)

Build forms in React using TanStack Form and Zod. This guide explains how to create forms with the `<Field />` component, implement schema validation with Zod, handle errors, and ensure accessibility.

#### Approach

- Use TanStack Form's `useForm` hook for form state management.
- Use `form.Field` component with render prop pattern for controlled inputs.
- Use `<Field />` components for building accessible forms.
- Client-side validation using Zod.
- Real-time validation feedback.

#### Anatomy

Here's a basic example of a form using TanStack Form with the `<Field />` component.

```tsx
<form
  onSubmit={(e) => {
    e.preventDefault()
    form.handleSubmit()
  }}
>
  <FieldGroup>
    <form.Field
      name="title"
      children={(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid
        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>Bug Title</FieldLabel>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-invalid={isInvalid}
              placeholder="Login button not working on mobile"
              autoComplete="off"
            />
            <FieldDescription>
              Provide a concise title for your bug report.
            </FieldDescription>
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
          </Field>
        )
      }}
    />
  </FieldGroup>
  <Button type="submit">Submit</Button>
</form>
```

#### Setup the form

1.  **Create a schema**: Define the shape of your form using a Zod schema.

    ```tsx
    import * as z from "zod"

    const formSchema = z.object({
      title: z
        .string()
        .min(5, "Bug title must be at least 5 characters.")
        .max(32, "Bug title must be at most 32 characters."),
      description: z
        .string()
        .min(20, "Description must be at least 20 characters.")
        .max(100, "Description must be at most 100 characters."),
    })
    ```

2.  **Setup the form**: Use the `useForm` hook from TanStack Form.

    ```tsx
    import { useForm } from "@tanstack/react-form"
    import { toast } from "sonner"
    import * as z from "zod"

    const formSchema = z.object({
      // ...
    })

    export function BugReportForm() {
      const form = useForm({
        defaultValues: {
          title: "",
          description: "",
        },
        validators: {
          onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
          toast.success("Form submitted successfully")
        },
      })

      return (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          {/* ... */}
        </form>
      )
    }
    ```

#### Validation Modes

TanStack Form supports different validation strategies through the `validators` option:

- `"onChange"`: Validation triggers on every change.
- `"onBlur"`: Validation triggers on blur.
- `"onSubmit"`: Validation triggers on submit.

```tsx
const form = useForm({
  defaultValues: {
    title: "",
    description: "",
  },
  validators: {
    onSubmit: formSchema,
    onChange: formSchema,
    onBlur: formSchema,
  },
})
```

#### Displaying Errors

Display errors next to the field using `<FieldError />`. For styling and accessibility:

- Add the `data-invalid` prop to the `<Field />` component.
- Add the `aria-invalid` prop to the form control such as `<Input />`, `<SelectTrigger />`, `<Checkbox />`, etc.

```tsx
<form.Field
  name="email"
  children={(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

    return (
      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
        <Input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          type="email"
          aria-invalid={isInvalid}
        />
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </Field>
    )
  }}
/>
```

#### Working with Different Field Types

**Input**

- For input fields, use `field.state.value` and `field.handleChange` on the `<Input />` component.
- To show errors, add the `aria-invalid` prop to the `<Input />` component and the `data-invalid` prop to the `<Field />` component.

```tsx
<form.Field
  name="username"
  children={(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
    return (
      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor="form-tanstack-input-username">Username</FieldLabel>
        <Input
          id="form-tanstack-input-username"
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          placeholder="shadcn"
          autoComplete="username"
        />
        <FieldDescription>
          This is your public display name. Must be between 3 and 10 characters.
          Must only contain letters, numbers, and underscores.
        </FieldDescription>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </Field>
    )
  }}
/>
```

**Textarea**

- For textarea fields, use `field.state.value` and `field.handleChange` on the `<Textarea />` component.
- To show errors, add the `aria-invalid` prop to the `<Textarea />` component and the `data-invalid` prop to the `<Field />` component.

```tsx
<form.Field
  name="about"
  children={(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
    return (
      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor="form-tanstack-textarea-about">
          More about you
        </FieldLabel>
        <Textarea
          id="form-tanstack-textarea-about"
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          placeholder="I'm a software engineer..."
          className="min-h-[120px]"
        />
        <FieldDescription>
          Tell us more about yourself. This will be used to help us personalize
          your experience.
        </FieldDescription>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </Field>
    )
  }}
/>
```

**Select**

- For select components, use `field.state.value` and `field.handleChange` on the `<Select />` component.
- To show errors, add the `aria-invalid` prop to the `<SelectTrigger />` component and the `data-invalid` prop to the `<Field />` component.

```tsx
<form.Field
  name="language"
  children={(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
    return (
      <Field orientation="responsive" data-invalid={isInvalid}>
        <FieldContent>
          <FieldLabel htmlFor="form-tanstack-select-language">
            Spoken Language
          </FieldLabel>
          <FieldDescription>
            For best results, select the language you speak.
          </FieldDescription>
          {isInvalid && <FieldError errors={field.state.meta.errors} />}
        </FieldContent>
        <Select
          name={field.name}
          value={field.state.value}
          onValueChange={field.handleChange}
        >
          <SelectTrigger
            id="form-tanstack-select-language"
            aria-invalid={isInvalid}
            className="min-w-[120px]"
          >
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="item-aligned">
            <SelectItem value="auto">Auto</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    )
  }}
/>
```

**Checkbox**

- For checkbox, use `field.state.value` and `field.handleChange` on the `<Checkbox />` component.
- To show errors, add the `aria-invalid` prop to the `<Checkbox />` component and the `data-invalid` prop to the `<Field />` component.
- For checkbox arrays, use `mode="array"` on the `<form.Field />` component and TanStack Form's array helpers.
- Remember to add `data-slot="checkbox-group"` to the `<FieldGroup />` component for proper styling and spacing.

```tsx
<form.Field
  name="tasks"
  mode="array"
  children={(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
    return (
      <FieldSet>
        <FieldLegend variant="label">Tasks</FieldLegend>
        <FieldDescription>
          Get notified when tasks you've created have updates.
        </FieldDescription>
        <FieldGroup data-slot="checkbox-group">
          {tasks.map((task) => (
            <Field
              key={task.id}
              orientation="horizontal"
              data-invalid={isInvalid}
            >
              <Checkbox
                id={`form-tanstack-checkbox-${task.id}`}
                name={field.name}
                aria-invalid={isInvalid}
                checked={field.state.value.includes(task.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    field.pushValue(task.id)
                  } else {
                    const index = field.state.value.indexOf(task.id)
                    if (index > -1) {
                      field.removeValue(index)
                    }
                  }
                }}
              />
              <FieldLabel
                htmlFor={`form-tanstack-checkbox-${task.id}`}
                className="font-normal"
              >
                {task.label}
              </FieldLabel>
            </Field>
          ))}
        </FieldGroup>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </FieldSet>
    )
  }}
/>
```

**Radio Group**

- For radio groups, use `field.state.value` and `field.handleChange` on the `<RadioGroup />` component.
- To show errors, add the `aria-invalid` prop to the `<RadioGroupItem />` component and the `data-invalid` prop to the `<Field />` component.

```tsx
<form.Field
  name="plan"
  children={(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
    return (
      <FieldSet>
        <FieldLegend>Plan</FieldLegend>
        <FieldDescription>
          You can upgrade or downgrade your plan at any time.
        </FieldDescription>
        <RadioGroup
          name={field.name}
          value={field.state.value}
          onValueChange={field.handleChange}
        >
          {plans.map((plan) => (
            <FieldLabel
              key={plan.id}
              htmlFor={`form-tanstack-radiogroup-${plan.id}`}
            >
              <Field orientation="horizontal" data-invalid={isInvalid}>
                <FieldContent>
                  <FieldTitle>{plan.title}</FieldTitle>
                  <FieldDescription>{plan.description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value={plan.id}
                  id={`form-tanstack-radiogroup-${plan.id}`}
                  aria-invalid={isInvalid}
                />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </FieldSet>
    )
  }}
/>
```

**Switch**

- For switches, use `field.state.value` and `field.handleChange` on the `<Switch />` component.
- To show errors, add the `aria-invalid` prop to the `<Switch />` component and the `data-invalid` prop to the `<Field />` component.

```tsx
<form.Field
  name="twoFactor"
  children={(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
    return (
      <Field orientation="horizontal" data-invalid={isInvalid}>
        <FieldContent>
          <FieldLabel htmlFor="form-tanstack-switch-twoFactor">
            Multi-factor authentication
          </FieldLabel>
          <FieldDescription>
            Enable multi-factor authentication to secure your account.
          </FieldDescription>
          {isInvalid && <FieldError errors={field.state.meta.errors} />}
        </FieldContent>
        <Switch
          id="form-tanstack-switch-twoFactor"
          name={field.name}
          checked={field.state.value}
          onCheckedChange={field.handleChange}
          aria-invalid={isInvalid}
        />
      </Field>
    )
  }}
/>
```

#### Resetting the Form

Use `form.reset()` to reset the form to its default values.

```tsx
<Button type="button" variant="outline" onClick={() => form.reset()}>
  Reset
</Button>
```

#### Array Fields

TanStack Form provides powerful array field management with `mode="array"`. This allows you to dynamically add, remove, and update array items with full validation support.

**Array Field Structure**

Use `mode="array"` on the parent field to enable array field management.

```tsx
<form.Field
  name="emails"
  mode="array"
  children={(field) => {
    return (
      <FieldSet>
        <FieldLegend variant="label">Email Addresses</FieldLegend>
        <FieldDescription>
          Add up to 5 email addresses where we can contact you.
        </FieldDescription>
        <FieldGroup>
          {field.state.value.map((_, index) => (
            // Nested field for each array item
          ))}
        </FieldGroup>
      </FieldSet>
    )
  }}
/>
```

**Nested Fields**

Access individual array items using bracket notation: `fieldName[index].propertyName`.

```tsx
<form.Field
  name={`emails[${index}].address`}
  children={(subField) => {
    const isSubFieldInvalid =
      subField.state.meta.isTouched && !subField.state.meta.isValid
    return (
      <Field orientation="horizontal" data-invalid={isSubFieldInvalid}>
        <FieldContent>
          <InputGroup>
            <InputGroupInput
              id={`form-tanstack-array-email-${index}`}
              name={subField.name}
              value={subField.state.value}
              onBlur={subField.handleBlur}
              onChange={(e) => subField.handleChange(e.target.value)}
              aria-invalid={isSubFieldInvalid}
              placeholder="name@example.com"
              type="email"
            />
            {field.state.value.length > 1 && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => field.removeValue(index)}
                  aria-label={`Remove email ${index + 1}`}
                >
                  <XIcon />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>
          {isSubFieldInvalid && (
            <FieldError errors={subField.state.meta.errors} />
          )}
        </FieldContent>
      </Field>
    )
  }}
/>
```

**Adding Items**

Use `field.pushValue(item)` to add items to an array field.

```tsx
<Button
  type="button"
  variant="outline"
  size="sm"
  onClick={() => field.pushValue({ address: "" })}
  disabled={field.state.value.length >= 5}
>
  Add Email Address
</Button>
```

**Removing Items**

Use `field.removeValue(index)` to remove items from an array field.

```tsx
{
  field.state.value.length > 1 && (
    <InputGroupButton
      onClick={() => field.removeValue(index)}
      aria-label={`Remove email ${index + 1}`}
    >
      <XIcon />
    </InputGroupButton>
  )
}
```

**Array Validation**

Validate array fields using Zod's array methods.

```tsx
const formSchema = z.object({
  emails: z
    .array(
      z.object({
        address: z.string().email("Enter a valid email address."),
      })
    )
    .min(1, "Add at least one email address.")
    .max(5, "You can add up to 5 email addresses."),
})
```