// src/app/(dashboard)/dashboard/page.tsx
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { ActivityCard } from "@/components/dashboard/activity-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Calendar, Users, CheckCircle2, ScanLine } from "lucide-react";

async function DashboardContent({ userId }: { userId: string }) {
  const [activities, totalRegistrations, totalCheckedIn] = await Promise.all([
    prisma.activity.findMany({
      where: { organizerId: userId },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { registrations: true } } },
    }),
    prisma.registration.count({ where: { activity: { organizerId: userId } } }),
    prisma.registration.count({
      where: { activity: { organizerId: userId }, checkedInAt: { not: null } },
    }),
  ]);

  const stats = [
    { label: "Activities", value: activities.length, icon: Calendar },
    { label: "Registrations", value: totalRegistrations, icon: Users },
    { label: "Checked in", value: totalCheckedIn, icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-surface p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                {stat.label}
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <stat.icon className="size-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {activities.length === 0 ? (
        <EmptyState
          icon={<Calendar className="size-8" />}
          title="No activities yet"
          description="Get started by creating your first activity. Share the link and track attendance effortlessly."
          action={
            <Button>
              <Link href="/activities/new">Create your first activity</Link>
            </Button>
          }
        />
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold tracking-tight">
              Your activities
            </h2>
            <Button variant="ghost" className="gap-2 text-xs">
              <Link href="/activities/new">
                <Plus className="size-3.5" /> New
              </Link>
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                registrationCount={activity._count.registrations}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl border border-border bg-surface-muted"
          />
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-2xl border border-border bg-surface-muted"
          />
        ))}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-foreground/60">
            Manage your activities and track registrations.
          </p>
        </div>
        <Button className="gap-2">
          <Link href="/activities/new">
            <Plus className="size-4" /> Create Activity
          </Link>
        </Button>
      </div>
      <Suspense fallback={<Skeleton />}>
        <DashboardContent userId={userId} />
      </Suspense>
    </div>
  );
}
