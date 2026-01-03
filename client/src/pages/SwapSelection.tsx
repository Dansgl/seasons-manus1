import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSubscription, getSwapItems, getSwapCount, addToSwap, removeFromSwap, confirmSwap, getAvailability } from "@/lib/supabase-db";
import { fetchProducts, getProductImageUrl, urlFor, type SanityProduct } from "@/lib/sanity";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { Plus, Minus, Loader2, ShoppingBag, Check, ArrowLeft, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Navigation from "@/components/Navigation";

export default function SwapSelection() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Get subscription to check swap window
  const { data: subscription, isLoading: subLoading } = useQuery({
    queryKey: ["subscription"],
    queryFn: getSubscription,
    enabled: isAuthenticated,
  });

  // Get current swap selections
  const { data: swapSlugs } = useQuery({
    queryKey: ["swapItems"],
    queryFn: getSwapItems,
    enabled: isAuthenticated && !!subscription,
  });
  const { data: swapCount } = useQuery({
    queryKey: ["swapCount"],
    queryFn: getSwapCount,
    enabled: isAuthenticated && !!subscription,
  });

  // Fetch products from Sanity
  const { data: allProducts, isLoading: productsLoading } = useQuery<SanityProduct[]>({
    queryKey: ["sanity", "products"],
    queryFn: fetchProducts,
  });

  // Get product slugs for availability check
  const productSlugs = useMemo(() =>
    allProducts?.map(p => p.slug).filter(Boolean) || [],
    [allProducts]
  );

  // Fetch real-time availability from PostgreSQL
  const { data: availability } = useQuery({
    queryKey: ["availability", productSlugs],
    queryFn: () => getAvailability(productSlugs),
    enabled: productSlugs.length > 0,
  });

  const addToSwapMutation = useMutation({
    mutationFn: (slug: string) => addToSwap(slug),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Added to next box!");
        queryClient.invalidateQueries({ queryKey: ["swapItems"] });
        queryClient.invalidateQueries({ queryKey: ["swapCount"] });
      } else {
        toast.error(result.error || "Failed to add item");
      }
    },
    onError: () => {
      toast.error("Failed to add item");
    },
  });

  const removeFromSwapMutation = useMutation({
    mutationFn: (slug: string) => removeFromSwap(slug),
    onSuccess: () => {
      toast.success("Removed from next box");
      queryClient.invalidateQueries({ queryKey: ["swapItems"] });
      queryClient.invalidateQueries({ queryKey: ["swapCount"] });
    },
  });

  const confirmSwapMutation = useMutation({
    mutationFn: confirmSwap,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Next box confirmed! Your items will be shipped soon.");
        setLocation("/dashboard");
      } else {
        toast.error(result.error || "Failed to confirm swap");
      }
    },
    onError: () => {
      toast.error("Failed to confirm swap");
    },
  });

  // Calculate if swap window is open
  const isSwapWindowOpen = useMemo(() => {
    if (!subscription) return false;
    const today = new Date();
    const cycleEnd = new Date(subscription.cycle_end_date);
    const daysRemaining = Math.ceil((cycleEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysRemaining <= 10;
  }, [subscription]);

  const getAvailabilityCount = (slug: string) => availability?.[slug] ?? 0;
  const isInSwap = (slug: string) => swapSlugs?.includes(slug) ?? false;
  const canAddMore = (swapCount ?? 0) < 5;

  const handleAddToSwap = (slug: string) => {
    addToSwapMutation.mutate(slug);
  };

  const handleRemoveFromSwap = (slug: string) => {
    removeFromSwapMutation.mutate(slug);
  };

  const handleConfirmSwap = () => {
    if (swapCount !== 5) {
      toast.error("Please select exactly 5 items for your next box");
      return;
    }
    confirmSwapMutation.mutate();
  };

  // Get selected products for summary
  const selectedProducts = useMemo(() => {
    if (!swapSlugs || !allProducts) return [];
    return swapSlugs
      .map(slug => allProducts.find(p => p.slug === slug))
      .filter((p): p is SanityProduct => p !== undefined);
  }, [swapSlugs, allProducts]);

  // Auth check
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  // Loading state
  if (subLoading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  // No subscription
  if (!subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Card className="p-8 max-w-md text-center">
          <p className="text-neutral-600 mb-4">No active subscription found.</p>
          <Link href="/catalog">
            <span className="inline-block w-full">
              <Button className="w-full">Browse Collection</Button>
            </span>
          </Link>
        </Card>
      </div>
    );
  }

  // Swap window not open
  if (!isSwapWindowOpen) {
    const cycleEnd = new Date(subscription.cycle_end_date);
    const today = new Date();
    const daysRemaining = Math.ceil((cycleEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-xl font-medium text-neutral-900 mb-4">Swap Window Not Open Yet</h2>
          <p className="text-neutral-600 mb-4">
            Your swap window opens 10 days before the end of your cycle.
          </p>
          <p className="text-sm text-neutral-500 mb-6">
            {daysRemaining} days remaining until swap window opens
          </p>
          <Link href="/dashboard">
            <span className="inline-block w-full">
              <Button variant="outline" className="w-full">Back to Dashboard</Button>
            </span>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navigation />

      {/* Progress Bar */}
      <div className="bg-white border-b border-neutral-200 py-3 md:py-4 sticky top-[65px] z-40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-900">
              {swapCount} of 5 items selected for next box
            </span>
            {swapCount === 5 && (
              <Button
                size="sm"
                className="rounded-full"
                onClick={handleConfirmSwap}
                disabled={confirmSwapMutation.isPending}
              >
                {confirmSwapMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  <>
                    Confirm Swap
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
          <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((swapCount ?? 0) / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-light text-neutral-900">Select Your Next Box</h1>
          <p className="text-neutral-600 mt-2">Choose 5 items for your upcoming cycle</p>
        </div>

        {/* Selected Items Summary */}
        {selectedProducts.length > 0 && (
          <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
            <h3 className="text-sm font-medium text-neutral-900 mb-3">Your Next Box:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-2 bg-white rounded-full pl-1 pr-3 py-1 border border-neutral-200"
                >
                  <div className="w-8 h-8 rounded-full bg-neutral-100 overflow-hidden flex-shrink-0">
                    {(() => {
                      const imageUrl = getProductImageUrl(product, { width: 32, height: 32 });
                      return imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-3 h-3 text-neutral-300" />
                        </div>
                      );
                    })()}
                  </div>
                  <span className="text-xs text-neutral-700 truncate max-w-[100px]">{product.name}</span>
                  <button
                    onClick={() => handleRemoveFromSwap(product.slug)}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {allProducts?.map((product) => {
            const availableCount = getAvailabilityCount(product.slug);
            const inSwap = isInSwap(product.slug);
            const outOfStock = availableCount === 0;

            return (
              <Card
                key={product._id}
                className={`group overflow-hidden transition-all ${
                  inSwap ? "border-blue-500 ring-2 ring-blue-100" : "border-neutral-200 hover:shadow-lg"
                }`}
              >
                <Link href={`/product/${product.slug}`} className="block">
                  <div className="aspect-square bg-neutral-100 relative overflow-hidden">
                    {(() => {
                      const imageUrl = getProductImageUrl(product, { width: 400, height: 400 });
                      return imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-12 md:w-16 h-12 md:h-16 text-neutral-300" />
                        </div>
                      );
                    })()}
                    {availableCount <= 3 && availableCount > 0 && (
                      <Badge className="absolute top-2 md:top-3 left-2 md:left-3 bg-amber-500 text-white text-xs">
                        Only {availableCount} left
                      </Badge>
                    )}
                    {outOfStock && (
                      <Badge className="absolute top-2 md:top-3 left-2 md:left-3 bg-neutral-900 text-white text-xs">
                        Out of Stock
                      </Badge>
                    )}
                    {inSwap && (
                      <div className="absolute top-2 md:top-3 right-2 md:right-3 w-6 h-6 md:w-8 md:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-3 md:p-4">
                  <div className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                    {product.brand?.name}
                  </div>
                  <Link
                    href={`/product/${product.slug}`}
                    className="text-sm font-medium text-neutral-900 hover:underline line-clamp-2"
                  >
                    {product.name}
                  </Link>
                  <div className="text-xs text-neutral-500 mt-1">RRP €{product.rrpPrice}</div>
                  <div className="mt-3">
                    {inSwap ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full rounded-full border-blue-500 text-blue-600 hover:bg-blue-50"
                        onClick={() => handleRemoveFromSwap(product.slug)}
                      >
                        <Minus className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full rounded-full"
                        disabled={!canAddMore || outOfStock || addToSwapMutation.isPending}
                        onClick={() => handleAddToSwap(product.slug)}
                      >
                        {addToSwapMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Floating Confirm Button on Mobile */}
      {swapCount === 5 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-200 md:hidden">
          <Button
            size="lg"
            className="w-full rounded-full"
            onClick={handleConfirmSwap}
            disabled={confirmSwapMutation.isPending}
          >
            {confirmSwapMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Confirming...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Confirm Swap & Ship Next Box
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
