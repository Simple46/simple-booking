"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { z } from "zod";
import {
  createActivitySchema,
  CreateActivityInput,
} from "@/lib/validations/activity";
import { createActivity } from "@/lib/actions/activity";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CreateActivityForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.input<typeof createActivitySchema>, unknown, CreateActivityInput>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: { bookingMode: "CAPACITY" },
  });

  const bookingMode = watch("bookingMode");

  const onSubmit = async (data: CreateActivityInput) => {
    setIsSubmitting(true);
    try {
      const res = await createActivity(data);
      if (res.success) {
        toast.success("Activity created successfully!");
        router.push(`/dashboard`);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 max-w-2xl mx-auto"
    >
      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">
          Activity Title
        </label>
        <input
          {...register("title")}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 transition-all"
          placeholder="e.g. Saturday Pottery Class"
        />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">
          Description (Optional)
        </label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 transition-all resize-none"
          placeholder="What is this activity about?"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Location
          </label>
          <input
            {...register("location")}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
            placeholder="The Clay Studio"
          />
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Start Date & Time
          </label>
          <input
            type="datetime-local"
            {...register("startsAt")}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
          />
          {errors.startsAt && (
            <p className="text-xs text-red-500">{errors.startsAt.message}</p>
          )}
        </div>
      </div>

      {/* Booking Mode */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">
          Booking Mode
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label
            className={`cursor-pointer rounded-xl border p-4 transition-all ${bookingMode === "CAPACITY" ? "border-amber-600 bg-amber-500/10" : "border-border bg-surface hover:bg-surface-muted"}`}
          >
            <input
              type="radio"
              value="CAPACITY"
              {...register("bookingMode")}
              className="sr-only"
            />
            <span className="block text-sm font-bold">Total Capacity</span>
            <span className="mt-1 block text-xs text-foreground/60">
              One event, many attendees.
            </span>
          </label>
          <label
            className={`cursor-pointer rounded-xl border p-4 transition-all ${bookingMode === "SLOTS" ? "border-amber-600 bg-amber-500/10" : "border-border bg-surface hover:bg-surface-muted"}`}
          >
            <input
              type="radio"
              value="SLOTS"
              {...register("bookingMode")}
              className="sr-only"
            />
            <span className="block text-sm font-bold">Time Slots</span>
            <span className="mt-1 block text-xs text-foreground/60">
              Multiple sessions.
            </span>
          </label>
        </div>
      </div>

      {/* Capacity Input (Conditional) */}
      {bookingMode === "CAPACITY" && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
          <label className="text-sm font-semibold text-foreground">
            Maximum Attendees
          </label>
          <input
            type="number"
            {...register("capacity")}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
            placeholder="e.g. 20"
          />
          {errors.capacity && (
            <p className="text-xs text-red-500">{errors.capacity.message}</p>
          )}
        </div>
      )}

      <Button type="submit" isLoading={isSubmitting} className="w-full py-3">
        Publish Activity
      </Button>
    </form>
  );
}
