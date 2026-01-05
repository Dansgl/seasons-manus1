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
  // TEMP: Hardcode waitlist mode until env var issue is resolved
  const isWaitlistMode = true;
  // const isWaitlistMode = import.meta.env.VITE_WAITLIST_MODE === "true";

  return {
    isWaitlistMode,
  };
}
