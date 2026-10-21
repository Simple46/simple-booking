// src/app/(dashboard)/dashboard/registrations/page.tsx
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { RegistrationsTable } from "@/components/dashboard/registrations-table";

async function RegistrationsContent() {
  const { userId } = await auth();
  if (!userId) return null;

  const registrations = await prisma.registration.findMany({
    where: { activity: { organizerId: userId } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold tracking-tight">Registrations</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Every attendee across all your activities ({registrations.length}{" "}
          total).
        </p>
      </div>
      <RegistrationsTable registrations={registrations} />
    </div>
  );
}

function RegistrationsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="space-y-2 border-b border-border pb-6">
        <div className="h-8 w-1/3 rounded bg-surface-muted" />
        <div className="h-4 w-1/2 rounded bg-surface-muted" />
      </div>
      <div className="h-64 rounded-2xl bg-surface-muted" />
    </div>
  );
}

export default function AllRegistrationsPage() {
  return (
    <Suspense fallback={<RegistrationsSkeleton />}>
      <RegistrationsContent />
    </Suspense>
  );
}
