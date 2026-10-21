// src/lib/actions/checkin.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function checkInAttendee(qrToken: string) {
  try {
    const registration = await prisma.registration.findUnique({
      where: { qrToken },
      include: { activity: { select: { slug: true } } },
    });

    if (!registration) return { success: false, message: "Invalid ticket" };
    if (registration.checkedInAt)
      return { success: false, message: "Already checked in" };

    await prisma.registration.update({
      where: { id: registration.id },
      data: { checkedInAt: new Date() },
    });

    revalidatePath(`/dashboard/activities/${registration.activity.slug}`);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/registrations");

    return {
      success: true,
      message: `${registration.participantName} checked in`,
    };
  } catch {
    return { success: false, message: "System error" };
  }
}
