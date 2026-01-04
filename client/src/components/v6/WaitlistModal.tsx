/**
 * WaitlistModal - Collects waitlist signups for pre-launch mode
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { V6_COLORS as C } from "./colors";
import { Loader2, Check, Users } from "lucide-react";
import { addToWaitlist, getWaitlistCount } from "@/lib/supabase-db";
import { toast } from "sonner";

// Age options matching existing product age ranges
const AGE_OPTIONS = [
  { value: "expecting", label: "Expecting" },
  { value: "0-3 months", label: "0-3 months" },
  { value: "3-6 months", label: "3-6 months" },
  { value: "6-12 months", label: "6-12 months" },
  { value: "12-18 months", label: "12-18 months" },
  { value: "18-24 months", label: "18-24 months" },
  { value: "2-3 years", label: "2-3 years" },
  { value: "4-5 years", label: "4-5 years" },
];

export type WaitlistSource = "header" | "hero" | "add_to_cart" | "exit_intent" | "login";

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: WaitlistSource;
}

export function WaitlistModal({ open, onOpenChange, source = "header" }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [success, setSuccess] = useState(false);

  const queryClient = useQueryClient();

  // Get waitlist count for social proof
  const { data: waitlistCount } = useQuery({
    queryKey: ["waitlistCount"],
    queryFn: getWaitlistCount,
  });

  const submitMutation = useMutation({
    mutationFn: () => addToWaitlist(email, childAge, name || undefined, source),
    onSuccess: (result) => {
      if (result.success) {
        setSuccess(true);
        queryClient.invalidateQueries({ queryKey: ["waitlistCount"] });
      } else {
        toast.error(result.error || "Failed to join waitlist");
      }
    },
    onError: () => {
      toast.error("Failed to join waitlist");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !childAge) {
      toast.error("Please fill in all required fields");
      return;
    }
    submitMutation.mutate();
  };

  const handleClose = () => {
    // Reset form state when closing
    if (success) {
      setEmail("");
      setName("");
      setChildAge("");
      setSuccess(false);
    }
    onOpenChange(false);
  };

  // Format the waitlist count for display
  const displayCount = waitlistCount ? Math.max(waitlistCount, 100) : 100; // Minimum display of 100 for social proof

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md"
        style={{ backgroundColor: C.white }}
        showCloseButton={true}
      >
        {success ? (
          // Success State
          <div className="text-center py-6">
            <div
              className="w-16 h-16 mx-auto mb-6 flex items-center justify-center"
              style={{ backgroundColor: C.lavender }}
            >
              <Check className="w-8 h-8" style={{ color: C.darkBrown }} />
            </div>
            <DialogHeader className="text-center">
              <DialogTitle
                className="text-2xl mb-2"
                style={{ color: C.darkBrown }}
              >
                You're on the list!
              </DialogTitle>
              <DialogDescription style={{ color: C.textBrown }}>
                We'll let you know when Seasons launches. Get ready to dress your little one in premium style.
              </DialogDescription>
            </DialogHeader>
            <button
              onClick={handleClose}
              className="mt-8 px-8 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: C.red }}
            >
              Continue Browsing
            </button>
          </div>
        ) : (
          // Form State
          <>
            <DialogHeader>
              <DialogTitle
                className="text-2xl text-center"
                style={{ color: C.darkBrown }}
              >
                Join the Waitlist
              </DialogTitle>
              <DialogDescription
                className="text-center"
                style={{ color: C.textBrown }}
              >
                Be first to access premium baby clothing rental
              </DialogDescription>
            </DialogHeader>

            {/* Social Proof */}
            <div
              className="flex items-center justify-center gap-2 py-3 -mx-6 px-6"
              style={{ backgroundColor: C.beige }}
            >
              <Users className="w-4 h-4" style={{ color: C.textBrown }} />
              <span className="text-sm" style={{ color: C.textBrown }}>
                Join <strong style={{ color: C.darkBrown }}>{displayCount}+</strong> parents on the waitlist
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {/* Name (Optional) */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: C.darkBrown }}
                >
                  Name <span style={{ color: C.textBrown }}>(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border-2 text-sm focus:outline-none transition-colors"
                  style={{ borderColor: C.lavender, color: C.darkBrown }}
                />
              </div>

              {/* Email (Required) */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: C.darkBrown }}
                >
                  Email <span style={{ color: C.red }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 text-sm focus:outline-none transition-colors"
                  style={{ borderColor: C.lavender, color: C.darkBrown }}
                />
              </div>

              {/* Child's Age (Required) */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: C.darkBrown }}
                >
                  Child's Age <span style={{ color: C.red }}>*</span>
                </label>
                <select
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 text-sm focus:outline-none transition-colors appearance-none bg-white"
                  style={{
                    borderColor: C.lavender,
                    color: childAge ? C.darkBrown : C.textBrown,
                  }}
                >
                  <option value="">Select age range</option>
                  {AGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ backgroundColor: C.red }}
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join the Waitlist"
                )}
              </button>
            </form>

            {/* Value Props */}
            <div className="mt-6 pt-6 border-t" style={{ borderColor: C.lavender }}>
              <ul className="space-y-2 text-sm" style={{ color: C.textBrown }}>
                <li className="flex items-start">
                  <span className="mr-2" style={{ color: C.red }}>
                    &#10003;
                  </span>
                  5 premium pieces for EUR 70/quarter
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ color: C.red }}>
                    &#10003;
                  </span>
                  Designer brands, professionally cleaned
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ color: C.red }}>
                    &#10003;
                  </span>
                  Free shipping &amp; easy returns
                </li>
              </ul>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
