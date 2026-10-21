// lib/actions/activity.ts
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

    const validated = createActivitySchema.safeParse(data);
    if (!validated.success)
      return { success: false, error: "Invalid data submitted." };

    const { title, description, location, startsAt, bookingMode, capacity } =
      validated.data;

    // 1. Check if user exists by email first to avoid unique constraint errors
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // 2. Sync User to Database
    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: userId, // Use Clerk ID
          name: clerkUser.fullName || "Organizer",
          email: email,
        },
      });
    } else if (existingUser.id !== userId) {
      // If they exist but have the old random ID, we need to update it
      // Note: This might fail if they already have activities tied to the old ID
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { id: userId },
      });
    }

    // 3. Create the Activity
    const baseSlug = slugify(title);
    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    await prisma.activity.create({
      data: {
        title,
        slug: uniqueSlug,
        description,
        location,
        startsAt: new Date(startsAt),
        bookingMode,
        capacity: bookingMode === "CAPACITY" ? capacity : null,
        organizerId: userId, // Matches the Clerk ID now
        status: "PUBLISHED",
      },
    });

    revalidatePath("/dashboard");
    return { success: true, slug: uniqueSlug };
  } catch (error) {
    // This will log the exact error to your terminal so you can see it
    console.error("Failed to create activity:", error);
    return {
      success: false,
      error: "An internal server error occurred. Please check the server logs.",
    };
  }
}
