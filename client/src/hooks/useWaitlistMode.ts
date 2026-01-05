/**
 * useWaitlistMode - Feature flag hook for waitlist/pre-launch mode
 *
 * When VITE_WAITLIST_MODE=true:
 * - Login/signup/cart actions are gated behind waitlist modal
 * - Site operates in pre-launch mode
 *
 * When VITE_WAITLIST_MODE=false (or unset):
 * - Normal site behavior
 */

export function useWaitlistMode() {
  const isWaitlistMode = import.meta.env.VITE_WAITLIST_MODE === "true";

  return {
    isWaitlistMode,
  };
}
// force rebuild Mon Jan  5 20:51:25 EET 2026
