/**
 * UmamiAnalytics - Loads Umami analytics script
 * Privacy-friendly, GDPR-compliant analytics
 */

import { useEffect } from 'react';

export function UmamiAnalytics() {
  useEffect(() => {
    const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;

    // Skip if no website ID configured
    if (!websiteId) {
      console.warn('Umami Analytics: VITE_UMAMI_WEBSITE_ID not configured');
      return;
    }

    // Check if script already exists
    if (document.querySelector('script[data-website-id]')) {
      return;
    }

    // Create and inject Umami script
    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://cloud.umami.is/script.js';
    script.setAttribute('data-website-id', websiteId);

    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const existingScript = document.querySelector('script[data-website-id]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null; // This component doesn't render anything
}
