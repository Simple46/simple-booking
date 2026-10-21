// src/components/dashboard/activity-card.tsx
import Link from "next/link";
import { Activity } from "@prisma/client";
import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";

interface ActivityCardProps {
  activity: Activity;
  registrationCount?: number;
}

export function ActivityCard({
  activity,
  registrationCount,
}: ActivityCardProps) {
  return (
    <Link
      href={`/dashboard/activities/${activity.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-amber-500/30"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
            {activity.bookingMode === "CAPACITY" ? "Event" : "Slots"}
          </span>
          <span
            className={`text-xs font-semibold ${activity.status === "PUBLISHED" ? "text-emerald-600" : "text-foreground/50"}`}
          >
            {activity.status}
          </span>
        </div>
        <h3 className="text-lg font-semibold leading-tight text-foreground group-hover:text-amber-600 transition-colors">
          {activity.title}
        </h3>
        <p className="mt-2 text-sm text-foreground/60 line-clamp-2">
          {activity.description || "No description provided."}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-xs font-medium text-foreground/50">
          {format(new Date(activity.startsAt), "MMM d, yyyy")}
        </span>
        <div className="flex items-center gap-2 text-xs font-medium text-foreground/70">
          {typeof registrationCount === "number" && (
            <span>{registrationCount} registered</span>
          )}
          <ArrowUpRight className="size-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </div>
      </div>
    </Link>
  );
}
