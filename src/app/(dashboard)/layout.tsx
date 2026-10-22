// src/app/(dashboard)/layout.tsx
import { Suspense } from "react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="sticky top-0 hidden h-screen w-64 border-r border-border bg-surface md:block">
        <Suspense fallback={null}>
          <DashboardSidebar />
        </Suspense>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader />

        <main className="flex-1 overflow-auto p-4 sm:p-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
