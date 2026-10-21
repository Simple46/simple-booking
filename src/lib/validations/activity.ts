// lib/validations/activity.ts
import { z } from "zod";

export const createActivitySchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100),
    description: z.string().optional(),
    location: z.string().optional(),
    // 1. Just check that it's a string, the Server Action handles the new Date() conversion
    startsAt: z.string().min(1, "Start date is required"),
    bookingMode: z.enum(["CAPACITY", "SLOTS"]),
    // 2. Safely coerce the string from the HTML input to a number
    capacity: z.preprocess(
      (val) =>
        val === "" || val === undefined || val === null
          ? undefined
          : Number(val),
      z.number().min(1, "Capacity must be at least 1").optional(),
    ),
  })
  .refine(
    (data) => {
      // 3. Ensure capacity is provided if the mode is CAPACITY
      if (data.bookingMode === "CAPACITY" && !data.capacity) return false;
      return true;
    },
    {
      message: "Capacity is required for Capacity mode",
      path: ["capacity"],
    },
  );

export type CreateActivityInput = z.infer<typeof createActivitySchema>;
