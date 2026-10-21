// src/app/(dashboard)/dashboard/activities/[slug]/scanner/page.tsx
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Scanner } from "@/components/dashboard/scanner";

export default async function ScannerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { userId } = await auth();
  if (!userId) return null;

  return (
    <Suspense
      fallback={
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-1/3 rounded bg-surface-muted" />
          <div className="h-96 rounded-2xl bg-surface-muted" />
        </div>
      }
    >
      <ScannerContent slug={slug} userId={userId} />
    </Suspense>
  );
}

async function ScannerContent({
  slug,
  userId,
}: {
  slug: string;
  userId: string;
}) {
  const activity = await prisma.activity.findUnique({
    where: { slug },
    select: { id: true, slug: true, title: true, organizerId: true },
  });

  if (!activity || activity.organizerId !== userId) notFound();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <Link
          href={`/dashboard/activities/${activity.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/60 hover:text-foreground mb-4 transition"
        >
          <ChevronLeft className="size-4" /> Back to Activity
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Check-in Scanner</h1>
        <p className="text-sm text-foreground/60 mt-1">{activity.title}</p>
      </div>

      <Scanner activitySlug={activity.slug} />
    </div>
  );
}
