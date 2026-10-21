// src/app/book/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { BookingForm } from "@/components/booking/booking-form";
import { CalendarDays, MapPin, Users } from "lucide-react";

export default async function PublicBookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // 1. Get the slug from the URL
  const { slug } = await params;

  // 2. Fetch the activity
  const activity = await prisma.activity.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { registrations: true },
      },
    },
  });

  // 3. Handle 404 if it doesn't exist or isn't published
  if (!activity || activity.status !== "PUBLISHED") {
    notFound();
  }

  // 4. Calculate spots left
  const spotsLeft =
    activity.bookingMode === "CAPACITY" && activity.capacity
      ? activity.capacity - activity._count.registrations
      : null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl grid md:grid-cols-[1.2fr_0.8fr] gap-0 bg-surface rounded-3xl border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        {/* Left Side: Activity Details */}
        <div className="p-8 sm:p-12 bg-surface-muted/50 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-6">
              <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
              Registration Open
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
              {activity.title}
            </h1>

            <p className="mt-4 text-foreground/70 leading-relaxed">
              {activity.description || "Join us for this wonderful activity!"}
            </p>

            <div className="mt-8 space-y-5">
              {/* Date */}
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-background border border-border text-foreground/70 shadow-sm">
                  <CalendarDays className="size-5" />
                </div>
                <div>
                  <p className="text-foreground/50 text-xs uppercase tracking-wider mb-0.5">
                    Date & Time
                  </p>
                  <p>
                    {format(
                      new Date(activity.startsAt),
                      "EEEE, MMMM d, yyyy · h:mm a",
                    )}
                  </p>
                </div>
              </div>

              {/* Location */}
              {activity.location && (
                <div className="flex items-center gap-4 text-sm font-medium">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-background border border-border text-foreground/70 shadow-sm">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <p className="text-foreground/50 text-xs uppercase tracking-wider mb-0.5">
                      Location
                    </p>
                    <p>{activity.location}</p>
                  </div>
                </div>
              )}

              {/* Capacity */}
              {spotsLeft !== null && (
                <div className="flex items-center gap-4 text-sm font-medium">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-background border border-border text-foreground/70 shadow-sm">
                    <Users className="size-5" />
                  </div>
                  <div>
                    <p className="text-foreground/50 text-xs uppercase tracking-wider mb-0.5">
                      Availability
                    </p>
                    <p
                      className={spotsLeft <= 3 ? "text-red-500 font-bold" : ""}
                    >
                      {spotsLeft > 0
                        ? `${spotsLeft} spots left`
                        : "Fully Booked"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-border">
            <p className="text-xs text-foreground/40 font-medium">
              Organized by Simple Booking
            </p>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="p-8 sm:p-12 border-t md:border-t-0 md:border-l border-border flex flex-col justify-center bg-surface">
          <h2 className="text-xl font-semibold mb-6 tracking-tight">
            Reserve your spot
          </h2>
          <BookingForm
            activityId={activity.id}
            isFull={spotsLeft !== null && spotsLeft <= 0}
          />
        </div>
      </div>
    </div>
  );
}
