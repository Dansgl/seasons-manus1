// App constants
export const APP_NAME = "Seasons";
export const APP_DESCRIPTION = "Premium luxury baby clothing subscription rental service";

// Get login URL - redirects to login page
export function getLoginUrl(returnTo?: string): string {
  const base = "/login";
  if (returnTo) {
    return `${base}?returnTo=${encodeURIComponent(returnTo)}`;
  }
  return base;
}
