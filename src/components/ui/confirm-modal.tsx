// src/components/ui/confirm-modal.tsx
"use client";

import { ReactNode } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "primary";
  icon?: ReactNode;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = "danger",
  icon,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={isLoading ? undefined : onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md animate-in zoom-in-95 duration-200 rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 rounded-md p-1 text-foreground/50 transition hover:bg-surface-muted hover:text-foreground disabled:opacity-50"
        >
          <X className="size-4" />
        </button>

        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4">
          {/* Icon */}
          <div
            className={`flex size-12 shrink-0 items-center justify-center rounded-full ${
              variant === "danger"
                ? "bg-red-500/10 text-red-600 dark:text-red-400"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            }`}
          >
            {icon || <AlertTriangle className="size-6" />}
          </div>

          {/* Text Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h3>
            <p className="mt-2 text-sm text-foreground/60 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
            isLoading={isLoading}
            className="w-full sm:w-auto"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
