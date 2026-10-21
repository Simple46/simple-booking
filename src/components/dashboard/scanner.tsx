// src/components/dashboard/scanner.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { checkInAttendee } from "@/lib/actions/checkin";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Camera } from "lucide-react";

interface ScannerProps {
  activitySlug: string;
}

export function Scanner({ activitySlug }: ScannerProps) {
  const [status, setStatus] = useState<
    "idle" | "scanning" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = "qr-reader-container";

  useEffect(() => {
    const scanner = new Html5Qrcode(containerId);
    scannerRef.current = scanner;
    let cancelled = false;
    let startPromise: Promise<void> | null = null;

    const start = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          async (decodedText) => {
            await scanner.pause(true);
            setStatus("scanning");

            const result = await checkInAttendee(decodedText);
            setMessage(result.message);
            setStatus(result.success ? "success" : "error");

            if (result.success) {
              toast.success(result.message);
            } else {
              toast.error(result.message);
            }

            setTimeout(async () => {
              setStatus("idle");
              setMessage("");
              try {
                await scanner.resume();
              } catch {
                // ignore
              }
            }, 1800);
          },
          () => {},
        );
      } catch (err) {
        if (!cancelled) {
          console.error("Camera error:", err);
          toast.error("Camera access denied or unavailable.");
        }
      }
    };

    startPromise = start();

    return () => {
      cancelled = true;
      startPromise?.then(() => {
        if (scannerRef.current?.isScanning) {
          scannerRef.current
            .stop()
            .then(() => scannerRef.current?.clear())
            .catch(() => {});
        }
      });
    };
  }, [activitySlug]);

  return (
    <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
      <div className="relative w-full aspect-square overflow-hidden rounded-3xl border-4 border-amber-500/20 bg-black shadow-2xl">
        <div
          id={containerId}
          className="w-full h-full [&_video]:object-cover"
        />

        {status === "idle" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-amber-400 rounded-2xl opacity-60 animate-pulse" />
          </div>
        )}

        {(status === "success" || status === "error") && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="flex flex-col items-center gap-3 p-8 text-center">
              {status === "success" ? (
                <CheckCircle2 className="size-16 text-emerald-500" />
              ) : (
                <XCircle className="size-16 text-red-500" />
              )}
              <p className="text-lg font-bold">{message}</p>
            </div>
          </div>
        )}
      </div>

      <p className="flex items-center gap-2 text-sm text-foreground/60">
        <Camera className="size-4" /> Point camera at the attendees QR code
      </p>
    </div>
  );
}
