import { UserButton } from "@/components/clerk/user-button";
import { UserProfile } from "@/components/clerk/user-profile";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/clerkdemo")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-8">
        <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground text-xs font-bold text-background">
            A
          </div>
          Acme Inc.
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex gap-4 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-foreground">
              Dashboard
            </a>
            <a href="#" className="hover:text-foreground">
              Team
            </a>
            <a href="#" className="hover:text-foreground">
              Projects
            </a>
          </nav>
          <div className="mx-2 h-4 w-px bg-border"></div>
          <UserButton
            onManageAccount={() => setIsProfileOpen(true)}
            onSignOut={() => console.log("Sign out clicked")}
            onAddAccount={() => console.log("Add account clicked")}
          />
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center gap-10 p-10">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Clerk-like Components</h1>
          <p className="mx-auto max-w-md text-muted-foreground">
            A reproduction of Clerk's User Button and User Profile components
            using shadcn/ui primitives.
          </p>
        </div>

        <div className="grid w-full max-w-6xl grid-cols-1 items-start gap-10 lg:grid-cols-2">
          {/* Component 1: User Button Sandbox */}
          <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">User Button</h2>
            <p className="text-sm text-muted-foreground">
              Click the avatar in the navbar or below to see the dropdown menu.
            </p>
            <div className="flex items-center justify-center rounded-lg border border-dashed bg-gray-100 p-10">
              <UserButton onManageAccount={() => setIsProfileOpen(true)} />
            </div>
          </div>

          {/* Component 2: User Profile Modal Trigger */}
          <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">User Profile Modal</h2>
            <p className="text-sm text-muted-foreground">
              Click the button below to open the settings modal. This is wired
              up to the "Manage account" button in the UserButton as well.
            </p>
            <div className="flex items-center justify-center rounded-lg border border-dashed bg-gray-100 p-10">
              <Button onClick={() => setIsProfileOpen(true)}>
                Open User Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Embedded User Profile */}
        <div className="w-full max-w-5xl space-y-4">
          <h2 className="ml-1 text-lg font-bold">Embedded User Profile</h2>
          <UserProfile />
        </div>
      </main>

      {/* Dialog Implementation */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-[1050px] overflow-hidden border-none bg-transparent p-0 shadow-none sm:rounded-xl">
          <UserProfile className="h-[600px] w-full border shadow-2xl" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
