// src/components/booking/booking-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerAttendee } from "@/lib/actions/registration";
import { Button } from "@/components/ui/button";
import { QrTicket } from "./qr-ticket";
import { toast } from "sonner";
import { UserX } from "lucide-react";

const formSchema = z.object({
  participantName: z.string().min(2, "Please enter your full name"),
  participantEmail: z.string().email("Please enter a valid email"),
  participantPhone: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function BookingForm({
  activityId,
  isFull,
}: {
  activityId: string;
  isFull: boolean;
}) {
  const [ticketToken, setTicketToken] = useState<string | null>(null);
  const [registeredName, setRegisteredName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await registerAttendee({ ...data, activityId });

      if (res.success && res.qrToken) {
        toast.success("Registration successful!");
        setRegisteredName(data.participantName);
        setTicketToken(res.qrToken);
      } else {
        toast.error(res.error || "Registration failed");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Success State: Show the QR Ticket
  if (ticketToken) {
    return <QrTicket token={ticketToken} name={registeredName} />;
  }

  // 2. Full State: Show a friendly message
  if (isFull) {
    return (
      <div className="flex flex-col items-center text-center py-8 animate-in fade-in">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 mb-4">
          <UserX className="size-8" />
        </div>
        <h3 className="text-lg font-bold tracking-tight">Fully Booked</h3>
        <p className="text-sm text-foreground/60 mt-2 max-w-xs">
          We are sorry, but we have reached the maximum capacity for this event.
        </p>
      </div>
    );
  }

  // 3. Default State: Show the Form
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 animate-in fade-in"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Full Name</label>
        <input
          {...register("participantName")}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 transition-all placeholder:text-foreground/30"
          placeholder="Jane Doe"
        />
        {errors.participantName && (
          <p className="text-xs text-red-500 font-medium">
            {errors.participantName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Email Address
        </label>
        <input
          type="email"
          {...register("participantEmail")}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 transition-all placeholder:text-foreground/30"
          placeholder="jane@example.com"
        />
        {errors.participantEmail && (
          <p className="text-xs text-red-500 font-medium">
            {errors.participantEmail.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Phone Number (Optional)
        </label>
        <input
          type="tel"
          {...register("participantPhone")}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 transition-all placeholder:text-foreground/30"
          placeholder="+1 (555) 000-0000"
        />
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        className="w-full py-3 mt-2"
      >
        Confirm Registration
      </Button>

      <p className="text-xs text-center text-foreground/50 pt-2 font-medium">
        No account required. You will receive a QR code instantly.
      </p>
    </form>
  );
}
