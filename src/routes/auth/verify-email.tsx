import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { MailIcon } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth/verify-email")({
  validateSearch: z.object({
    email: z.string().optional(),
    token: z.string().optional(),
    redirect: z.string().optional(),
  }),
  component: VerifyEmail,
});

function VerifyEmail() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (search.token) {
      verifyToken();
    }
  }, [search.token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(
        `/api/auth/verify-email?token=${search.token}`,
      );
      if (response.ok) {
        navigate({
          to: search.redirect || "/dashboard",
        });
      } else {
        navigate({
          to: "/auth/error",
          search: { error: "invalid_token" },
        });
      }
    } catch (error) {
      console.error("Verification failed:", error);
      navigate({
        to: "/auth/error",
        search: { error: "invalid_token" },
      });
    }
  };

  const handleResend = async () => {
    if (!search.email) return;

    setIsResending(true);
    try {
      const result = await authClient.sendVerificationEmail({
        email: search.email,
      });

      if (result.error) {
        console.error("Failed to resend:", result.error);
      } else {
        setResent(true);
        setTimeout(() => setResent(false), 5000);
      }
    } catch (error) {
      console.error("Failed to resend:", error);
    } finally {
      setIsResending(false);
    }
  };

  if (search.token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/50">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground">Verifying your email...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <MailIcon size={32} className="text-primary" />
        </div>
        <CardTitle className="text-2xl">Check your email</CardTitle>
        <CardDescription>
          {search.email
            ? `We sent a verification link to ${search.email}`
            : "Please check your email for a verification link"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Click the link in the email to verify your account. The link will
          expire in 24 hours.
        </p>

        {search.email && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleResend}
            disabled={isResending || resent}
          >
            {isResending
              ? "Resending..."
              : resent
                ? "Sent! Check your inbox"
                : "Resend verification email"}
          </Button>
        )}

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => navigate({ to: "/auth/sign-in" })}
        >
          Back to sign in
        </Button>
      </CardContent>
    </Card>
  );
}
