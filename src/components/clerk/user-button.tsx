import { useCallback, useMemo, useState } from "react";
import { LogOut, Settings } from "lucide-react";
import { useMatches, useNavigate } from "@tanstack/react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export function UserButton() {
  const session = authClient.useSession.get();
  const navigate = useNavigate();

  const isPrivateRoute = useMatches({
    select: (matches) =>
      matches.some((m) => m.staticData.authRequired === true),
  });

  if (session.isPending || session.isRefetching)
    return <Skeleton className="size-10 rounded-full" />;

  const [isSigningOut, setIsSigningOut] = useState(false);

  const initials = useMemo(
    () =>
      session.data?.user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase(),
    [session.data?.user.name],
  );

  const signOut = useCallback(async () => {
    setIsSigningOut(true);
    const res = await authClient.signOut();

    if (res.error != null) {
      toast.error("Failed to sign out", { description: res.error.message });
      return;
    }

    if (isPrivateRoute) {
      await navigate({ to: "/auth/sign-in" });
    }

    toast.success("You have been signed out");

    setIsSigningOut(false);
  }, [navigate, isPrivateRoute]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="relative size-10 overflow-hidden rounded-full p-0 ring-offset-background transition-all hover:ring-2 hover:ring-ring hover:ring-offset-2"
          >
            <Avatar className="size-10">
              <AvatarImage
                src={session.data?.user.image ?? undefined}
                alt={session.data?.user.name}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent className="w-80 p-0" align="end">
        {/* Header Section */}
        <div className="flex items-center gap-3 p-4">
          <Avatar className="size-10">
            <AvatarImage
              src={session.data?.user.image ?? undefined}
              alt={session.data?.user.name}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm leading-none font-medium">
              {session.data?.user.name}
            </p>
            <p className="h-4 w-48 truncate text-xs leading-none text-muted-foreground">
              {session.data?.user.email}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full gap-2 px-2 pb-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 flex-1 items-center justify-center text-xs font-normal"
          >
            <Settings className="mr-1 size-4 text-muted-foreground" />
            Manage account
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 flex-1 items-center justify-center text-xs font-normal"
            onClick={signOut}
          >
            {isSigningOut ? (
              <>
                <Spinner data-icon="inline-start" />
                Signing out...
              </>
            ) : (
              <>
                <LogOut className="mr-1 size-4 text-muted-foreground" />
                Sign out
              </>
            )}
          </Button>
        </div>

        <div className="flex justify-center border-t bg-muted/30 p-2 py-2">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            Secured by{" "}
            <span className="font-semibold text-foreground/80">
              better-auth
            </span>
          </span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
