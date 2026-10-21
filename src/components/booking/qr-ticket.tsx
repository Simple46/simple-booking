// src/components/booking/qr-ticket.tsx
"use client";

import { QrCode } from "@/components/ui/qr-code";
import { Button } from "@/components/ui/button";
import { Printer, CheckCircle2 } from "lucide-react";

export function QrTicket({ token, name }: { token: string; name: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-surface border border-border rounded-3xl shadow-2xl w-full max-w-sm mx-auto animate-in zoom-in-95 duration-500">
      <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-4">
        <CheckCircle2 className="size-6" />
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          You&apos;re in, {name.split(" ")[0] || "Guest"}!
        </h2>
        <p className="text-sm text-foreground/60 mt-1">
          Show this QR code at the entrance.
        </p>
      </div>

      <div className="p-4 bg-white rounded-2xl shadow-inner border border-border/50">
        <QrCode value={token} size={220} />
      </div>

      <div className="flex gap-2 mt-8 w-full">
        <Button
          onClick={() => window.print()}
          variant="secondary"
          className="flex-1 gap-2"
        >
          <Printer className="size-4" /> Save Ticket
        </Button>
      </div>

      <p className="text-[10px] text-center text-foreground/40 mt-4 font-mono">
        ID: {token.slice(0, 8)}...{token.slice(-8)}
      </p>
    </div>
  );
}
