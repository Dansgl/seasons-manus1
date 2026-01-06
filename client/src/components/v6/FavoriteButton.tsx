/**
 * FavoriteButton - Heart icon for favoriting products
 * Works for authenticated users and waitlist mode (localStorage)
 */

import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleFavorite, getFavorites } from "@/lib/supabase-db";
import { useAuth } from "@/_core/hooks/useAuth";
import { useWaitlistMode } from "@/hooks/useWaitlistMode";
import { V6_COLORS as C } from "./colors";

interface FavoriteButtonProps {
  productSlug: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// localStorage key for waitlist mode favorites
const WAITLIST_FAVORITES_KEY = "seasons_waitlist_favorites";

export function FavoriteButton({ productSlug, className = "", size = "md" }: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const { isWaitlistMode } = useWaitlistMode();
  const queryClient = useQueryClient();
  const [localFavorites, setLocalFavorites] = useState<string[]>([]);

  // Icon sizes
  const iconSize = size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6";
  // Use custom className if provided, otherwise use default button size
  const buttonSize = className ? "" : (size === "sm" ? "w-8 h-8" : size === "md" ? "w-9 h-9" : "w-10 h-10");

  // Load localStorage favorites for waitlist mode
  useEffect(() => {
    if (isWaitlistMode || !isAuthenticated) {
      const stored = localStorage.getItem(WAITLIST_FAVORITES_KEY);
      if (stored) {
        try {
          setLocalFavorites(JSON.parse(stored));
        } catch {
          setLocalFavorites([]);
        }
      }
    }
  }, [isWaitlistMode, isAuthenticated]);

  // Get favorites from database (authenticated users only)
  const { data: dbFavorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: isAuthenticated && !isWaitlistMode,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: (slug: string) => toggleFavorite(slug),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
        queryClient.invalidateQueries({ queryKey: ["favoritesCount"] });
        toast.success(result.isFavorited ? "Added to favorites" : "Removed from favorites");
      } else {
        toast.error(result.error || "Failed to update favorites");
      }
    },
  });

  // Handle favorite toggle for waitlist mode (localStorage)
  const handleWaitlistToggle = () => {
    const current = localFavorites || [];
    const isFavorited = current.includes(productSlug);

    let newFavorites: string[];
    if (isFavorited) {
      newFavorites = current.filter(slug => slug !== productSlug);
      toast.success("Removed from favorites");
    } else {
      newFavorites = [...current, productSlug];
      toast.success("Added to favorites - join waitlist to save them!");
    }

    setLocalFavorites(newFavorites);
    localStorage.setItem(WAITLIST_FAVORITES_KEY, JSON.stringify(newFavorites));
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWaitlistMode || !isAuthenticated) {
      handleWaitlistToggle();
    } else {
      toggleFavoriteMutation.mutate(productSlug);
    }
  };

  // Determine if product is favorited
  const isFavorited = isWaitlistMode || !isAuthenticated
    ? localFavorites.includes(productSlug)
    : dbFavorites?.includes(productSlug) ?? false;

  return (
    <button
      onClick={handleClick}
      disabled={toggleFavoriteMutation.isPending}
      className={`${buttonSize} flex items-center justify-center transition-all hover:scale-110 ${className}`}
      style={{
        backgroundColor: isFavorited ? C.red : "rgba(255, 255, 255, 0.9)",
      }}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`${iconSize} transition-colors`}
        fill={isFavorited ? "white" : "none"}
        style={{ color: isFavorited ? "white" : C.red }}
        strokeWidth={2}
      />
    </button>
  );
}

/**
 * Helper function to migrate localStorage favorites to database on signup
 * Call this after user signs in
 */
export async function migrateWaitlistFavorites() {
  const stored = localStorage.getItem(WAITLIST_FAVORITES_KEY);
  if (!stored) return;

  try {
    const favorites: string[] = JSON.parse(stored);
    if (favorites.length === 0) return;

    // Add all favorites to database
    for (const slug of favorites) {
      await toggleFavorite(slug);
    }

    // Clear localStorage after migration
    localStorage.removeItem(WAITLIST_FAVORITES_KEY);
    toast.success(`${favorites.length} favorites synced to your account!`);
  } catch (error) {
    console.error("Failed to migrate favorites:", error);
  }
}
