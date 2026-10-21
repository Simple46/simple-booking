// src/app/(dashboard)/dashboard/activities/[slug]/page.tsx
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  ChevronLeft,
  CalendarDays,
  MapPin,
  Users,
  ScanLine,
  CheckCircle2,
} from "lucide-react";
import { SharePanel } from "@/components/dashboard/share-panel";
import { RegistrationsTable } from "@/components/dashboard/registrations-table";
import { Button } from "@/components/ui/button";

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-1/3 rounded bg-surface-muted" />
          <div className="h-40 rounded-2xl bg-surface-muted" />
          <div className="h-64 rounded-2xl bg-surface-muted" />
        </div>
      }
    >
      <AuthenticatedActivityDetailPage params={params} />
    </Suspense>
  );
}

async function AuthenticatedActivityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { userId } = await auth();
  if (!userId) return null;

  return <ActivityDetailContent slug={slug} userId={userId} />;
}

async function ActivityDetailContent({
  slug,
  userId,
}: {
  slug: string;
  userId: string;
}) {
  const activity = await prisma.activity.findUnique({
    where: { slug },
    include: {
      registrations: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!activity || activity.organizerId !== userId) notFound();

  const totalRegistered = activity.registrations.length;
  const totalCheckedIn = activity.registrations.filter(
    (r) => r.checkedInAt,
  ).length;
  const capacityLeft =
    activity.bookingMode === "CAPACITY" && activity.capacity
      ? activity.capacity - totalRegistered
      : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/60 hover:text-foreground mb-4 transition"
        >
          <ChevronLeft className="size-4" /> Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                {activity.bookingMode === "CAPACITY" ? "Event" : "Slots"}
              </span>
              <span
                className={`text-xs font-semibold ${
                  activity.status === "PUBLISHED"
                    ? "text-emerald-600"
                    : "text-foreground/50"
                }`}
              >
                {activity.status}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              {activity.title}
            </h1>
            {activity.description && (
              <p className="mt-2 text-sm text-foreground/60 max-w-2xl">
                {activity.description}
              </p>
            )}
          </div>

          <Button asChild className="gap-2 shrink-0">
            <Link href={`/dashboard/activities/${activity.slug}/scanner`}>
              <ScanLine className="size-4" /> Open Scanner
            </Link>
          </Button>
        </div>
      </div>

      {/* Info row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <CalendarDays className="size-5" />
          </div>
          <div>
            <p className="text-xs text-foreground/50 uppercase tracking-wider">
              Date
            </p>
            <p className="text-sm font-semibold">
              {format(new Date(activity.startsAt), "MMM d, yyyy")}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <MapPin className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-foreground/50 uppercase tracking-wider">
              Location
            </p>
            <p className="text-sm font-semibold truncate">
              {activity.location || "Not set"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Users className="size-5" />
          </div>
          <div>
            <p className="text-xs text-foreground/50 uppercase tracking-wider">
              Attendees
            </p>
            <p className="text-sm font-semibold">
              {totalRegistered}
              {capacityLeft !== null && ` / ${activity.capacity}`}
              {capacityLeft !== null && capacityLeft <= 0 && (
                <span className="ml-1 text-xs text-red-500">Full</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Two-column: Share + Stats */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left: registrations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              Registrations
            </h2>
            <span className="text-sm text-foreground/50">
              {totalCheckedIn} of {totalRegistered} checked in
            </span>
          </div>
          <RegistrationsTable registrations={activity.registrations} />
        </div>

        {/* Right: share + check-in summary */}
        <div className="space-y-4">
          <SharePanel slug={activity.slug} title={activity.title} />

          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <h3 className="text-sm font-semibold">Check-in progress</h3>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-foreground/10">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{
                  width: `${
                    totalRegistered === 0
                      ? 0
                      : (totalCheckedIn / totalRegistered) * 100
                  }%`,
                }}
              />
            </div>
            <p className="mt-2 text-xs text-foreground/50">
              {totalRegistered === 0
                ? "No registrations yet"
                : `${Math.round((totalCheckedIn / totalRegistered) * 100)}% arrived`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
