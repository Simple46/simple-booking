// src/components/dashboard/delete-activity-btn.tsx
"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { deleteActivity } from "@/lib/actions/activity";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DeleteActivityBtn({ activityId }: { activityId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteActivity(activityId);
      if (res.success) {
        toast.success("Activity deleted successfully");
        setIsModalOpen(false);
        router.push("/dashboard");
      } else {
        toast.error(res.error || "Failed to delete activity");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant="danger"
        className="gap-2"
      >
        <Trash2 className="size-4" /> Delete
      </Button>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Activity"
        description="Are you sure you want to delete this activity? This will permanently remove all registrations and QR codes associated with it. This action cannot be undone."
        confirmText="Delete Activity"
        isLoading={isDeleting}
        variant="danger"
      />
    </>
  );
}
