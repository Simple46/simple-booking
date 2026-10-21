// src/lib/actions/registration.ts
"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const registerSchema = z.object({
  activityId: z.string(),
  participantName: z.string().min(2, "Name is too short"),
  participantEmail: z.string().email("Invalid email address"),
  participantPhone: z.string().optional(),
});

export async function registerAttendee(data: z.infer<typeof registerSchema>) {
  const validated = registerSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  try {
    // 1. Fetch the activity to check capacity
    const activity = await prisma.activity.findUnique({
      where: { id: validated.data.activityId },
      include: { _count: { select: { registrations: true } } },
    });

    if (!activity || activity.status !== "PUBLISHED") {
      return { success: false, error: "This activity is not available." };
    }

    // 2. Check if it's full (only if it's CAPACITY mode)
    if (activity.bookingMode === "CAPACITY" && activity.capacity) {
      if (activity._count.registrations >= activity.capacity) {
        return { success: false, error: "Sorry, this event is fully booked." };
      }
    }

    // 3. Check if this email is already registered for this event
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        activityId: activity.id,
        participantEmail: validated.data.participantEmail,
      },
    });

    if (existingRegistration) {
      return { success: false, error: "This email is already registered." };
    }

    // 4. Create the registration (Prisma auto-generates the qrToken based on your schema)
    const registration = await prisma.registration.create({
      data: {
        activityId: activity.id,
        participantName: validated.data.participantName,
        participantEmail: validated.data.participantEmail,
        participantPhone: validated.data.participantPhone,
      },
    });

    // 5. Refresh the dashboard so the organizer sees the new registration instantly
    revalidatePath(`/dashboard/activities/${activity.slug}`);
    revalidatePath("/dashboard");

    return { success: true, qrToken: registration.qrToken };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
