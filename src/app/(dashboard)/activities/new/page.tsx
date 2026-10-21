// app/activities/new/page.tsx
import { CreateActivityForm } from "@/components/dashboard/create-activity-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewActivityPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Form Container */}
        <div className="rounded-3xl border border-border bg-surface p-6 sm:p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-8 border-b border-border pb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Create a new activity
            </h1>
            <p className="mt-1 text-sm text-foreground/60">
              Fill in the details below to publish your event and start
              accepting registrations.
            </p>
          </div>

          <CreateActivityForm />
        </div>
      </div>
    </div>
  );
}
