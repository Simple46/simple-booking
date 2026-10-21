// src/components/dashboard/registrations-table.tsx
"use client";

import { Registration } from "@prisma/client";
import { CheckCircle2, Clock, Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import { EmptyState } from "@/components/ui/empty-state";
import { Users } from "lucide-react";

interface RegistrationsTableProps {
  registrations: Registration[];
  showActivity?: boolean;
}

export function RegistrationsTable({ registrations }: RegistrationsTableProps) {
  if (registrations.length === 0) {
    return (
      <EmptyState
        icon={<Users className="size-8" />}
        title="No registrations yet"
        description="When people register, they'll show up here in real time."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <table className="w-full">
        <thead className="bg-surface-muted/50 border-b border-border">
          <tr className="text-left text-xs font-semibold uppercase tracking-wider text-foreground/50">
            <th className="px-4 py-3">Attendee</th>
            <th className="px-4 py-3 hidden sm:table-cell">Contact</th>
            <th className="px-4 py-3">Registered</th>
            <th className="px-4 py-3 text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((reg) => (
            <tr
              key={reg.id}
              className="border-b border-border last:border-0 hover:bg-surface-muted/30 transition"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm font-semibold">
                    {reg.participantName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">
                    {reg.participantName}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 hidden sm:table-cell">
                <div className="flex flex-col gap-0.5 text-xs text-foreground/60">
                  <span className="flex items-center gap-1.5">
                    <Mail className="size-3" /> {reg.participantEmail}
                  </span>
                  {reg.participantPhone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="size-3" /> {reg.participantPhone}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-xs text-foreground/60">
                {format(new Date(reg.createdAt), "MMM d, h:mm a")}
              </td>
              <td className="px-4 py-3 text-right">
                {reg.checkedInAt ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="size-3" /> Checked in
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-2.5 py-1 text-xs font-semibold text-foreground/50">
                    <Clock className="size-3" /> Pending
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
