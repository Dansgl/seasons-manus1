/**
 * OptimizedImage - Image component with loading placeholder
 * Shows a solid color placeholder while image loads
 */

import { useState } from "react";
import { V6_COLORS as C } from "./colors";

interface OptimizedImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
}

export function OptimizedImage({ src, alt, className = "", fallbackIcon }: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ backgroundColor: C.beige }}
      >
        {fallbackIcon}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder shown while loading */}
      {!isLoaded && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{ backgroundColor: C.lavender }}
        />
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
