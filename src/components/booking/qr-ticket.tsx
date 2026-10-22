// src/components/booking/qr-ticket.tsx
"use client";

import { useEffect, useState } from "react";
import { QrCode } from "@/components/ui/qr-code";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle2, Clock } from "lucide-react";
import { getTicketStatus } from "@/lib/actions/registration"; // We will create this

export function QrTicket({ token, name }: { token: string; name: string }) {
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // Poll the server every 5 seconds to check if the organizer scanned it
  useEffect(() => {
    if (isCheckedIn) return;

    const interval = setInterval(async () => {
      const status = await getTicketStatus(token);
      if (status.checkedIn) {
        setIsCheckedIn(true);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [token, isCheckedIn]);

  const handleDownload = () => {
    const link = document.getElementById(
      "qr-download-link",
    ) as HTMLAnchorElement;
    if (link) link.click();
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 sm:p-8 bg-surface border-2 rounded-3xl shadow-2xl w-full max-w-sm mx-auto animate-in zoom-in-95 duration-500 transition-colors ${isCheckedIn ? "border-emerald-500/50" : "border-border"}`}
    >
      <div
        className={`flex size-12 items-center justify-center rounded-full mb-4 ${isCheckedIn ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}
      >
        {isCheckedIn ? (
          <CheckCircle2 className="size-6" />
        ) : (
          <Clock className="size-6" />
        )}
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {isCheckedIn
            ? "You're Checked In!"
            : `You're in, ${name.split(" ")[0] || "Guest"}!`}
        </h2>
        <p className="text-sm text-foreground/60 mt-1">
          {isCheckedIn
            ? "Have a great time at the event."
            : "Show this QR code at the entrance."}
        </p>
      </div>

      <div className="p-4 bg-white rounded-2xl shadow-inner border border-border/50">
        <QrCode value={token} size={220} />
      </div>

      <div className="flex gap-2 mt-8 w-full">
        <Button
          onClick={handleDownload}
          variant="secondary"
          className="flex-1 gap-2"
        >
          <Download className="size-4" /> Download
        </Button>
      </div>

      <p className="text-[10px] text-center text-foreground/40 mt-4 font-mono">
        ID: {token.slice(0, 8)}...{token.slice(-8)}
      </p>
    </div>
  );
}
