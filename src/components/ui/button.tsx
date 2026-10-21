import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils"; // Utility to merge Tailwind classes

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  isLoading?: boolean;
  asChild?: boolean; // New prop to determine if the button should render as a child
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", isLoading, children, disabled, ...props },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      primary:
        "bg-foreground text-background hover:-translate-y-0.5 hover:shadow-lg",
      secondary:
        "border border-border bg-surface text-foreground hover:bg-surface-muted",
      ghost: "text-foreground/75 hover:bg-surface-muted hover:text-foreground",
      danger: "bg-red-500 text-white hover:bg-red-600",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="mr-2 size-4 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
