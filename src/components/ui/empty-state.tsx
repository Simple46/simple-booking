import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-8 text-center animate-in fade-in-50">
      <div className="mb-4 rounded-full bg-amber-500/10 p-4 text-amber-600 dark:text-amber-400">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-foreground/60">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
