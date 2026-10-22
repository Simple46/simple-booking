// src/lib/actions/activity.ts
"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import {
  createActivitySchema,
  CreateActivityInput,
} from "@/lib/validations/activity";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createActivity(data: CreateActivityInput) {
  try {
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) return { success: false, error: "Unauthorized" };

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email)
      return { success: false, error: "User must have an email address" };

    // 1. Validate the data
    const validated = createActivitySchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: "Invalid data submitted." };
    }

    const {
      title,
      description,
      location,
      startsAt,
      bookingMode,
      capacity,
      slots,
    } = validated.data;

    // 2. Sync User to Database (Ensure Clerk ID is used as primary key)
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
      await prisma.user.create({
        data: { id: userId, name: clerkUser.fullName || "Organizer", email },
      });
    } else if (existingUser.id !== userId) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { id: userId },
      });
    }

    // 3. Generate a unique slug
    const baseSlug = slugify(title);
    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    // 4. Prepare slot data (Combine the main event date with the slot times)
    const eventDate = new Date(startsAt).toISOString().split("T")[0]; // Gets YYYY-MM-DD

    const slotsData =
      bookingMode === "SLOTS" && slots
        ? slots.map((slot) => ({
            title: slot.title || "Session",
            // Combine the event date with the slot's specific start/end time
            startsAt: new Date(`${eventDate}T${slot.startsAt}:00`),
            endsAt: new Date(`${eventDate}T${slot.endsAt}:00`),
            capacity: slot.capacity,
          }))
        : undefined;

    // 5. Create the Activity
    await prisma.activity.create({
      data: {
        title,
        slug: uniqueSlug,
        description,
        location,
        startsAt: new Date(startsAt),
        bookingMode,
        capacity: bookingMode === "CAPACITY" ? capacity : null,
        organizerId: userId,
        status: "PUBLISHED",
        slots: slotsData ? { create: slotsData } : undefined,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, slug: uniqueSlug };
  } catch (error) {
    console.error("Failed to create activity:", error);
    return { success: false, error: "An internal server error occurred." };
  }
}

export async function deleteActivity(activityId: string) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    // Ensure the user deleting the activity is the owner
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      select: { organizerId: true },
    });

    if (!activity || activity.organizerId !== userId) {
      return {
        success: false,
        error: "Not authorized to delete this activity",
      };
    }

    await prisma.activity.delete({ where: { id: activityId } });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete activity:", error);
    return { success: false, error: "Failed to delete activity" };
  }
}
