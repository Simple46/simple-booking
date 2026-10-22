// src/components/layout/dashboard-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarPlus, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Create Activity", href: "/activities/new", icon: CalendarPlus },
  { name: "Registrations", href: "/dashboard/registrations", icon: Ticket },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-18 items-center border-b border-border px-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          simple<span className="text-amber-600">.</span>booking
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                  : "text-foreground/60 hover:bg-surface-muted hover:text-foreground",
              )}
            >
              <item.icon className="size-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
