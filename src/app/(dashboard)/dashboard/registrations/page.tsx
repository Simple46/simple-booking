// src/app/(dashboard)/dashboard/registrations/page.tsx
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { RegistrationsTable } from "@/components/dashboard/registrations-table";

export default async function AllRegistrationsPage() {
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
