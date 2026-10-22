// src/components/layout/dashboard-header.tsx
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { DashboardSidebar } from "./dashboard-sidebar";

export function DashboardHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-10 flex h-18 items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur-xl sm:px-8">
        {/* Mobile Menu Toggle & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex size-10 items-center justify-center rounded-lg border border-border transition hover:bg-surface-muted md:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <Link href="/" className="text-lg font-bold tracking-tight md:hidden">
            simple<span className="text-amber-600">.</span>booking
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          <ThemeToggle />
          <div className="hidden h-6 w-px bg-border sm:block" />
          <UserButton />
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="relative h-full w-64 animate-in slide-in-from-left bg-surface shadow-2xl">
            <button
              className="absolute right-4 top-4 z-10 rounded-md p-1 text-foreground/50 transition hover:bg-surface-muted hover:text-foreground"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
            {/* Close menu when a link is clicked */}
            <div className="h-full" onClick={() => setMobileOpen(false)}>
              <DashboardSidebar />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
