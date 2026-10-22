// src/lib/validations/activity.ts
import { z } from "zod";

// Regex to validate time strings in HH:MM format (e.g., "10:00", "14:30")
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const createActivitySchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title is too long"),
    description: z.string().optional(),
    location: z.string().optional(),

    // Main event date (YYYY-MM-DD from the date input)
    startsAt: z.string().min(1, "Date is required"),

    bookingMode: z.enum(["CAPACITY", "SLOTS"]),

    // Preprocess converts the string from the HTML input into a real number
    capacity: z.preprocess(
      (val) =>
        val === "" || val === undefined || val === null
          ? undefined
          : Number(val),
      z.number().min(1, "Capacity must be at least 1").optional(),
    ),

    // Array of time slots (only used if bookingMode === "SLOTS")
    slots: z
      .array(
        z.object({
          title: z.string().optional(),
          startsAt: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
          endsAt: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
          capacity: z.preprocess(
            (val) =>
              val === "" || val === undefined || val === null ? 1 : Number(val),
            z.number().min(1, "Slot capacity must be at least 1"),
          ),
        }),
      )
      .optional(),
  })
  // superRefine allows us to validate multiple conditions based on other fields
  .superRefine((data, ctx) => {
    // 1. If mode is CAPACITY, ensure capacity is provided
    if (data.bookingMode === "CAPACITY" && !data.capacity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Capacity is required for General Events",
        path: ["capacity"],
      });
    }

    // 2. If mode is SLOTS, ensure at least one slot is added
    if (data.bookingMode === "SLOTS") {
      if (!data.slots || data.slots.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please add at least one time slot",
          path: ["slots"],
        });
      } else {
        // 3. Validate that End Time is always after Start Time for each slot
        data.slots.forEach((slot, index) => {
          if (slot.startsAt && slot.endsAt && slot.startsAt >= slot.endsAt) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "End time must be after start time",
              path: [`slots.${index}.endsAt`], // Points the error exactly to the end time input
            });
          }
        });
      }
    }
  });

export type CreateActivityInput = z.infer<typeof createActivitySchema>;
