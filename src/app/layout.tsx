// app/layout.tsx
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "sonner"; // Added for notifications
import "./globals.css";

import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Simple Booking",
  description:
    "Create activities, manage registrations, and simplify attendance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} bg-background text-foreground antialiased min-h-screen`}
        suppressHydrationWarning
      >
        <ClerkProvider>
          <Provider>
            {children}
            <Toaster richColors position="top-center" />
          </Provider>
        </ClerkProvider>
      </body>
    </html>
  );
}
