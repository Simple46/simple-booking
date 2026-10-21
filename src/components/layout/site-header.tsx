"use client";

import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight"
          aria-label="Simple Booking home"
        >
          simple<span className="text-amber-600">.</span>booking
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href="#how-it-works"
            className="hidden text-sm font-medium text-foreground/60 transition hover:text-foreground sm:block"
          >
            How it works
          </Link>

          <ThemeToggle />

          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="rounded-lg px-2 py-2 text-sm font-medium text-foreground/75 transition hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition hover:-translate-y-0.5 hover:opacity-90"
            >
              Get started
            </Link>
          </Show>

          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="rounded-lg px-2 py-2 text-sm font-medium text-foreground/75 transition hover:text-foreground"
            >
              Dashboard
            </Link>
            <UserButton />
          </Show>
        </div>
      </nav>
    </header>
  );
}
