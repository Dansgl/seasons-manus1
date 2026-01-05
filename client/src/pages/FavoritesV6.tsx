/**
 * FavoritesV6 - Wishlist/favorites page with V6 design system
 */

import { useMemo, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/_core/hooks/useAuth";
import { getFavorites, removeFromFavorites, addToCart, getCartCount } from "@/lib/supabase-db";
import { fetchProducts, getProductImageUrl, type SanityProduct } from "@/lib/sanity";
import { Link } from "wouter";
import { Heart, ShoppingBag, Plus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Header, Footer, V6_COLORS as C } from "@/components/v6";
import { useWaitlistMode } from "@/hooks/useWaitlistMode";

const WAITLIST_FAVORITES_KEY = "seasons_waitlist_favorites";

export default function FavoritesV6() {
  const { isAuthenticated } = useAuth();
  const { isWaitlistMode } = useWaitlistMode();
  const queryClient = useQueryClient();
  const [localFavorites, setLocalFavorites] = useState<string[]>([]);

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

  // Get favorites from database (authenticated users)
  const { data: dbFavorites, isLoading: favoritesLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: isAuthenticated && !isWaitlistMode,
  });

  const { data: cartCount } = useQuery({
    queryKey: ["cartCount"],
    queryFn: getCartCount,
    enabled: isAuthenticated && !isWaitlistMode,
  });

  // Fetch all products from Sanity
  const { data: allProducts } = useQuery<SanityProduct[]>({
    queryKey: ["sanity", "products"],
    queryFn: fetchProducts,
  });

  // Get favorite product details
  const favoriteSlugs = isWaitlistMode || !isAuthenticated ? localFavorites : (dbFavorites || []);
  const favoriteProducts = useMemo(() => {
    if (!favoriteSlugs || !allProducts) return [];
    return favoriteSlugs
      .map(slug => allProducts.find(p => p.slug === slug))
      .filter((p): p is SanityProduct => p !== undefined);
  }, [favoriteSlugs, allProducts]);

  const removeFromFavoritesMutation = useMutation({
    mutationFn: (slug: string) => removeFromFavorites(slug),
    onSuccess: () => {
      toast.success("Removed from favorites");
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["favoritesCount"] });
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: (slug: string) => addToCart(slug),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Added to your box!");
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        queryClient.invalidateQueries({ queryKey: ["cartCount"] });
      } else {
        toast.error(result.error || "Failed to add item");
      }
    },
  });

  const handleRemoveFromFavorites = (slug: string) => {
    if (isWaitlistMode || !isAuthenticated) {
      const newFavorites = localFavorites.filter(s => s !== slug);
      setLocalFavorites(newFavorites);
      localStorage.setItem(WAITLIST_FAVORITES_KEY, JSON.stringify(newFavorites));
      toast.success("Removed from favorites");
    } else {
      removeFromFavoritesMutation.mutate(slug);
    }
  };

  const handleAddToCart = (slug: string) => {
    if (isWaitlistMode) {
      toast.info("Sign up to start renting!");
      return;
    }
    if (!isAuthenticated) {
      toast.error("Please sign in to add items to your box");
      return;
    }
    addToCartMutation.mutate(slug);
  };

  const canAddMore = (cartCount || 0) < 5;
  const favoriteCount = favoriteSlugs?.length || 0;

  if (!isAuthenticated && !isWaitlistMode) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
        <Header />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="p-8 text-center max-w-md" style={{ backgroundColor: C.white }}>
            <Heart className="w-16 h-16 mx-auto mb-4" style={{ color: C.lavender }} />
            <h2 className="text-2xl mb-4" style={{ color: C.darkBrown }}>Sign In Required</h2>
            <p className="mb-6" style={{ color: C.textBrown }}>
              Please sign in to view your favorites
            </p>
            <Link href="/login">
              <button
                className="px-8 py-3 text-base font-medium text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: C.red }}
              >
                Sign In
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (favoritesLoading && !isWaitlistMode) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: C.beige }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.textBrown }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
      <Header />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl mb-2" style={{ color: C.darkBrown }}>
              My Favorites
            </h1>
            <p className="text-base" style={{ color: C.textBrown }}>
              {favoriteCount} {favoriteCount === 1 ? 'item' : 'items'} saved
            </p>
          </div>

          {favoriteCount === 0 ? (
            <div className="text-center py-16">
              <div className="p-8 inline-block" style={{ backgroundColor: C.white }}>
                <Heart className="w-20 h-20 mx-auto mb-4" style={{ color: C.lavender }} />
                <h2 className="text-2xl mb-4" style={{ color: C.darkBrown }}>
                  No favorites yet
                </h2>
                <p className="mb-6 max-w-md" style={{ color: C.textBrown }}>
                  Browse our collection and tap the heart icon to save your favorite items
                </p>
                <Link href="/catalog">
                  <button
                    className="px-8 py-3 text-base font-medium text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: C.red }}
                  >
                    Browse Collection
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {favoriteProducts.map((product) => {
                const imageUrl = getProductImageUrl(product, { width: 400, height: 400 });

                return (
                <div key={product._id} className="group">
                  <Link href={`/product/${product.slug}`}>
                    <div
                      className="aspect-square relative overflow-hidden mb-3"
                      style={{ backgroundColor: C.white }}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-12 h-12" style={{ color: C.lavender }} />
                        </div>
                      )}

                      {/* Remove from Favorites */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveFromFavorites(product.slug);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all hover:scale-110"
                        style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                      >
                        <X className="w-4 h-4" style={{ color: C.red }} />
                      </button>
                    </div>
                  </Link>

                  <div className="flex flex-col">
                    <p className="text-xs font-medium mb-1" style={{ color: C.red }}>
                      {product.brand?.name}
                    </p>
                    <Link
                      href={`/product/${product.slug}`}
                      className="text-sm font-medium hover:underline line-clamp-2 mb-1 min-h-[2.5rem]"
                      style={{ color: C.darkBrown }}
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs mb-3" style={{ color: C.textBrown }}>
                      RRP €{product.rrpPrice}
                    </p>

                    {!isWaitlistMode && isAuthenticated ? (
                      <button
                        onClick={() => handleAddToCart(product.slug)}
                        disabled={!canAddMore || addToCartMutation.isPending}
                        className="w-full flex items-center justify-center gap-1 px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
                        style={{ backgroundColor: C.darkBrown }}
                      >
                        {addToCartMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Add to Box
                          </>
                        )}
                      </button>
                    ) : (
                      <Link href="/login">
                        <button
                          className="w-full flex items-center justify-center gap-1 px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
                          style={{ backgroundColor: C.red }}
                        >
                          Sign up to Rent
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
