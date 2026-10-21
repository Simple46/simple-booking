// app/(dashboard)/layout.tsx
import { Suspense } from "react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Suspense
        fallback={
          <aside className="hidden md:flex w-64 shrink-0 border-r border-border bg-surface" />
        }
      >
        <DashboardSidebar />
      </Suspense>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-18 flex items-center justify-between border-b border-border bg-surface/80 backdrop-blur-xl px-4 sm:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {/* Mobile Menu (Visible on small screens) */}
            <div className="md:hidden">
              <Link href="/" className="text-lg font-bold tracking-tight">
                simple<span className="text-amber-600">.</span>booking
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <ThemeToggle />
            <div className="h-6 w-px bg-border hidden sm:block" />
            <UserButton />
          </div>
        </header>

        {/* Page Content (Notice the padding here p-4 sm:p-8) */}
        <main className="flex-1 p-4 sm:p-8 overflow-auto">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
