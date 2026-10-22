/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/dashboard/create-activity-form.tsx
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import {
  createActivitySchema,
  CreateActivityInput,
} from "@/lib/validations/activity";
import { createActivity } from "@/lib/actions/activity";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  CalendarDays,
  Clock,
  MapPin,
  AlignLeft,
  Type,
} from "lucide-react";

export function CreateActivityForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<z.input<typeof createActivitySchema>, any, CreateActivityInput>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: {
      bookingMode: "CAPACITY",
      slots: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "slots",
  });

  const bookingMode = watch("bookingMode");

  const onSubmit = async (data: CreateActivityInput) => {
    setIsSubmitting(true);
    try {
      const res = await createActivity(data);
      if (res.success) {
        toast.success("Activity created successfully!");
        router.push("/dashboard");
      } else {
        toast.error(res.error || "Something went wrong.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
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
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Type className="size-4 text-amber-600" /> Activity Title
        </label>
        <input
          {...register("title")}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 transition-all placeholder:text-foreground/30"
          placeholder="e.g. Saturday Pottery Class"
        />
        {errors.title && (
          <p className="text-xs text-red-500 font-medium">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <AlignLeft className="size-4 text-amber-600" /> Description (Optional)
        </label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 transition-all resize-none placeholder:text-foreground/30"
          placeholder="What is this activity about?"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MapPin className="size-4 text-amber-600" /> Location
          </label>
          <input
            {...register("location")}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 transition-all placeholder:text-foreground/30"
            placeholder="The Clay Studio"
          />
        </div>

        {/* Date (Main Event Date) */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CalendarDays className="size-4 text-amber-600" /> Date
          </label>
          <input
            type="date"
            {...register("startsAt")}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 transition-all"
          />
          {errors.startsAt && (
            <p className="text-xs text-red-500 font-medium">
              {errors.startsAt.message}
            </p>
          )}
        </div>
      </div>

      {/* Booking Mode */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">
          Booking Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label
            className={`cursor-pointer rounded-xl border p-4 transition-all ${bookingMode === "CAPACITY" ? "border-amber-600 bg-amber-500/10 ring-1 ring-amber-600" : "border-border bg-surface hover:bg-surface-muted"}`}
          >
            <input
              type="radio"
              value="CAPACITY"
              {...register("bookingMode")}
              className="sr-only"
            />
            <span className="block text-sm font-bold">General Event</span>
            <span className="mt-1 block text-xs text-foreground/60">
              One overall capacity for everyone.
            </span>
          </label>
          <label
            className={`cursor-pointer rounded-xl border p-4 transition-all ${bookingMode === "SLOTS" ? "border-amber-600 bg-amber-500/10 ring-1 ring-amber-600" : "border-border bg-surface hover:bg-surface-muted"}`}
          >
            <input
              type="radio"
              value="SLOTS"
              {...register("bookingMode")}
              className="sr-only"
            />
            <span className="block text-sm font-bold">Time Slots</span>
            <span className="mt-1 block text-xs text-foreground/60">
              Multiple sessions with specific times.
            </span>
          </label>
        </div>
      </div>

      {/* CAPACITY MODE: Capacity Input */}
      {bookingMode === "CAPACITY" && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
          <label className="text-sm font-semibold text-foreground">
            Maximum Attendees
          </label>
          <input
            type="number"
            {...register("capacity")}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 transition-all placeholder:text-foreground/30"
            placeholder="e.g. 20"
          />
          {errors.capacity && (
            <p className="text-xs text-red-500 font-medium">
              {errors.capacity.message}
            </p>
          )}
        </div>
      )}

      {/* SLOTS MODE: Dynamic Time Slots */}
      {bookingMode === "SLOTS" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 p-5 rounded-2xl border border-border bg-surface-muted/30">
          <div className="flex items-center justify-between mb-2">
            <div>
              <label className="text-sm font-semibold text-foreground">
                Time Slots
              </label>
              <p className="text-xs text-foreground/50 mt-0.5">
                Add the specific sessions for this date.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                append({
                  title: "",
                  startsAt: "10:00",
                  endsAt: "11:00",
                  capacity: 1,
                })
              }
              className="gap-1.5 text-xs shadow-sm"
            >
              <Plus className="size-3.5" /> Add Slot
            </Button>
          </div>

          {fields.length === 0 && (
            <div className="text-center py-6 border border-dashed border-border rounded-xl">
              <p className="text-sm text-foreground/50">
                No slots added yet. Click Add Slot to begin.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="relative flex flex-col sm:flex-row gap-3 items-start bg-background p-4 rounded-xl border border-border shadow-sm"
              >
                {/* Slot Title */}
                <div className="w-full sm:w-[30%] space-y-1.5">
                  <label className="text-[10px] font-semibold text-foreground/50 uppercase tracking-wider">
                    Session Name
                  </label>
                  <input
                    {...register(`slots.${index}.title`)}
                    placeholder="Morning Session"
                    className="w-full text-sm p-2.5 rounded-lg border border-border bg-surface focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 transition-all"
                  />
                </div>

                {/* Start Time */}
                <div className="w-full sm:w-[20%] space-y-1.5">
                  <label className="text-[10px] font-semibold text-foreground/50 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="size-3" /> Start
                  </label>
                  <input
                    type="time"
                    {...register(`slots.${index}.startsAt`)}
                    className="w-full text-sm p-2.5 rounded-lg border border-border bg-surface focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 transition-all"
                  />
                </div>

                {/* End Time */}
                <div className="w-full sm:w-[20%] space-y-1.5">
                  <label className="text-[10px] font-semibold text-foreground/50 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="size-3" /> End
                  </label>
                  <input
                    type="time"
                    {...register(`slots.${index}.endsAt`)}
                    className="w-full text-sm p-2.5 rounded-lg border border-border bg-surface focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 transition-all"
                  />
                </div>

                {/* Capacity */}
                <div className="w-full sm:w-[15%] space-y-1.5">
                  <label className="text-[10px] font-semibold text-foreground/50 uppercase tracking-wider">
                    Spots
                  </label>
                  <input
                    type="number"
                    {...register(`slots.${index}.capacity`)}
                    className="w-full text-sm p-2.5 rounded-lg border border-border bg-surface focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 transition-all"
                  />
                </div>

                {/* Remove Button */}
                <div className="absolute top-2 right-2 sm:static sm:mt-6">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="flex size-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Remove slot"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="pt-4 border-t border-border">
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full py-3.5 text-base shadow-lg shadow-amber-500/10"
        >
          Publish Activity
        </Button>
      </div>
    </form>
  );
}
