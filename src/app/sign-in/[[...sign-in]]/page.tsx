import { Suspense } from "react";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

function AuthWidgetFallback() {
  return (
    <div
      aria-hidden="true"
      className="h-[28rem] w-full animate-pulse rounded-2xl bg-surface-muted"
    />
  );
}

export default function SignInPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-amber-500/10 blur-3xl dark:bg-amber-400/5"
      />
      <div className="relative flex w-full max-w-md flex-col items-center gap-8">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-foreground"
        >
          simple<span className="text-amber-600">.</span>booking
        </Link>
        <div className="w-full rounded-3xl border border-border bg-surface p-2 shadow-2xl shadow-black/10 dark:shadow-black/30">
          <Suspense fallback={<AuthWidgetFallback />}>
            <SignIn />
          </Suspense>
        </div>
        <p className="text-center text-sm text-foreground/55">
          New to Simple Booking?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-foreground underline decoration-amber-500/50 underline-offset-4 hover:decoration-amber-500"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
