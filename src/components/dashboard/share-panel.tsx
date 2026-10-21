// src/components/dashboard/share-panel.tsx
"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, QrCode as QrIcon } from "lucide-react";
import { QrCode } from "@/components/ui/qr-code";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SharePanel({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const publicUrl = `${origin}/book/${slug}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            Share booking link
          </h3>
          <p className="text-xs text-foreground/50 mt-0.5">
            Anyone with this link can register
          </p>
        </div>
        <button
          onClick={() => setShowQr((v) => !v)}
          className="flex size-9 items-center justify-center rounded-lg border border-border bg-background hover:bg-surface-muted transition"
          aria-label="Toggle QR code"
        >
          <QrIcon className="size-4 text-foreground/60" />
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
        <span className="flex-1 truncate text-sm font-mono text-foreground/70">
          {publicUrl || `/book/${slug}`}
        </span>
        <button
          onClick={copyLink}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background transition hover:opacity-90"
          aria-label="Copy link"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      </div>

      {showQr && (
        <div className="mt-4 flex flex-col items-center animate-in fade-in slide-in-from-top-2">
          <div className="p-3 bg-white rounded-2xl border border-border shadow-sm">
            <QrCode value={publicUrl || `/book/${slug}`} size={180} />
          </div>
          <p className="mt-3 text-xs text-foreground/50 text-center max-w-[200px]">
            Guests can scan this at the door or on printed posters.
          </p>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Button variant="secondary" className="flex-1 gap-2 text-xs">
          <a href={`/book/${slug}`} target="_blank" rel="noreferrer">
            <ExternalLink className="size-3.5" /> Preview page
          </a>
        </Button>
      </div>
    </div>
  );
}
