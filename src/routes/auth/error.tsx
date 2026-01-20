import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  error: z.string().optional(),
});

export const Route = createFileRoute("/auth/error")({
  validateSearch: searchSchema,
  component: ErrorPage,
});

function ErrorPage() {
  const navigate = useNavigate();
  const search = Route.useSearch() as z.infer<typeof searchSchema>;

  const errorMessages: Record<string, { title: string; message: string; action: string; actionTo: string }> = {
    invalid_token: {
      title: "Invalid or Expired Link",
      message: "This link has expired or is invalid. Please request a new one.",
      action: "Go to Sign In",
      actionTo: "/auth/sign-in",
    },
    default: {
      title: "An Error Occurred",
      message: "Something went wrong. Please try again.",
      action: "Go to Sign In",
      actionTo: "/auth/sign-in",
    },
  };

  const errorConfig =
    search.error && errorMessages[search.error]
      ? errorMessages[search.error]
      : errorMessages.default;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-destructive"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold">{errorConfig.title}</h1>
          <p className="mt-2 text-muted-foreground">
            {errorConfig.message}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate({ to: errorConfig.actionTo as any })}
          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {errorConfig.action}
        </button>
      </div>
    </div>
  );
}
