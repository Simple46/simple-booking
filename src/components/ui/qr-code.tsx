// src/components/ui/qr-code.tsx
"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QrCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export function QrCode({ value, size = 200, className }: QrCodeProps) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(value, {
      width: size,
      margin: 2,
      color: { dark: "#1c211e", light: "#ffffff" },
    })
      .then(setDataUrl)
      .catch(console.error);
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div
        className="animate-pulse rounded-xl bg-foreground/5"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div className="relative group">
      <img
        src={dataUrl}
        alt="QR Code"
        width={size}
        height={size}
        className={className}
      />
      {/* Hidden download link triggered by parent */}
      <a
        id="qr-download-link"
        href={dataUrl}
        download="simple-booking-ticket.png"
        className="hidden"
      />
    </div>
  );
}
