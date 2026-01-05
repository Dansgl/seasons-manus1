/**
 * CatalogV6 - Product catalog with V6 design system
 */

import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchProducts, fetchBrands, getProductImageUrl, type SanityProduct, type SanityBrand } from "@/lib/sanity";
import { getAvailability, getCart, getCartCount, addToCart, removeFromCart } from "@/lib/supabase-db";
import { Link, useSearch } from "wouter";
import { Plus, Minus, Loader2, ShoppingBag, X, Filter, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Header, Footer, V6_COLORS as C, WaitlistModal, FavoriteButton } from "@/components/v6";
import { useWaitlistMode } from "@/hooks/useWaitlistMode";
import { trackAddToCart, trackRemoveFromCart, trackCartFull, trackCatalogFilter, trackCatalogFilterCleared, trackOutOfStockInterest } from "@/lib/analytics";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function CatalogV6() {
  const { isAuthenticated } = useAuth();
  const { isWaitlistMode } = useWaitlistMode();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const brandFromUrl = searchParams.get("brand") || "";

  const [selectedBrand, setSelectedBrand] = useState<string>(brandFromUrl);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedAgeRange, setSelectedAgeRange] = useState<string>("");
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);

  useEffect(() => {
    if (brandFromUrl) {
      setSelectedBrand(brandFromUrl);
    }
  }, [brandFromUrl]);

  // Fetch products from Sanity
  const { data: allProducts, isLoading } = useQuery<SanityProduct[]>({
    queryKey: ["sanity", "products"],
    queryFn: fetchProducts,
  });

  // Fetch brands from Sanity
  const { data: brands } = useQuery<SanityBrand[]>({
    queryKey: ["sanity", "brands"],
    queryFn: fetchBrands,
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

  // Cart state (disabled in waitlist mode)
  const { data: cartSlugs } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isAuthenticated && !isWaitlistMode,
  });
  const { data: cartCount } = useQuery({
    queryKey: ["cartCount"],
    queryFn: getCartCount,
    enabled: isAuthenticated && !isWaitlistMode,
  });

  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: (slug: string) => addToCart(slug),
    onSuccess: (result, slug) => {
      if (result.success) {
        toast.success("Added to your box!");
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        queryClient.invalidateQueries({ queryKey: ["cartCount"] });

        // Track add to cart
        const product = allProducts?.find(p => p.slug === slug);
        if (product) {
          trackAddToCart({
            productSlug: slug,
            productName: product.name,
            brand: product.brand?.name || 'Unknown',
            cartCount: (cartCount || 0) + 1,
            isWaitlistMode: false,
          });
        }
      } else {
        toast.error(result.error || "Failed to add item");

        // Track cart full attempt
        if (result.error?.includes('full') || result.error?.includes('5')) {
          trackCartFull(slug);
        }
      }
    },
    onError: () => {
      toast.error("Failed to add item");
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (slug: string) => removeFromCart(slug),
    onSuccess: (result, slug) => {
      toast.success("Removed from your box");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartCount"] });

      // Track remove from cart
      trackRemoveFromCart(slug, (cartCount || 1) - 1);
    },
  });

  // Derive unique filter options from actual product data
  const filterOptions = useMemo(() => {
    if (!allProducts) return { categories: [] as string[], ageRanges: [] as string[], seasons: [] as string[] };

    const categoriesSet = new Set<string>();
    const ageRangesSet = new Set<string>();
    const seasonsSet = new Set<string>();

    allProducts.forEach(p => {
      if (p.category) categoriesSet.add(p.category);
      if (p.ageRange) ageRangesSet.add(p.ageRange);
      if (p.season) seasonsSet.add(p.season);
    });

    const categories = Array.from(categoriesSet).sort();
    const ageRanges = Array.from(ageRangesSet).sort((a, b) => {
      const getMonths = (s: string) => parseInt(s.split('-')[0]) || 0;
      return getMonths(a) - getMonths(b);
    });
    const seasons = Array.from(seasonsSet).sort();

    return { categories, ageRanges, seasons };
  }, [allProducts]);

  // Filter products
  const products = useMemo(() => {
    if (!allProducts) return [];
    return allProducts.filter((product) => {
      if (selectedBrand && product.brand?.name?.toLowerCase() !== selectedBrand.toLowerCase()) return false;
      if (selectedCategory && product.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      if (selectedAgeRange && product.ageRange !== selectedAgeRange) return false;
      if (selectedSeason && product.season?.toLowerCase() !== selectedSeason.toLowerCase()) return false;
      return true;
    });
  }, [allProducts, selectedBrand, selectedCategory, selectedAgeRange, selectedSeason]);

  const getAvailabilityCount = (slug: string) => availability?.[slug] ?? 0;
  const isInCart = (slug: string) => cartSlugs?.includes(slug) ?? false;
  const canAddMore = (cartCount ?? 0) < 5;

  const handleAddToCart = (slug: string) => {
    // In waitlist mode, show the waitlist modal with toast
    if (isWaitlistMode) {
      toast("Join our waitlist to be first to rent this item!", {
        description: "We're launching soon. Sign up to get early access.",
      });
      setWaitlistModalOpen(true);
      return;
    }

    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    addToCartMutation.mutate(slug);
  };

  const handleRemoveFromCart = (slug: string) => {
    removeFromCartMutation.mutate(slug);
  };

  const clearFilters = () => {
    setSelectedBrand("");
    setSelectedCategory("");
    setSelectedAgeRange("");
    setSelectedSeason("");
    trackCatalogFilterCleared();
  };

  // Filter handlers with tracking
  const handleBrandFilter = (brand: string) => {
    setSelectedBrand(brand);
    if (brand) {
      const resultCount = allProducts?.filter(p => p.brand?.name === brand).length || 0;
      trackCatalogFilter({ type: 'brand', value: brand, resultCount });
    }
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category) {
      const resultCount = allProducts?.filter(p => p.category === category).length || 0;
      trackCatalogFilter({ type: 'category', value: category, resultCount });
    }
  };

  const handleAgeRangeFilter = (ageRange: string) => {
    setSelectedAgeRange(ageRange);
    if (ageRange) {
      const resultCount = allProducts?.filter(p => p.ageRange === ageRange).length || 0;
      trackCatalogFilter({ type: 'age_range', value: ageRange, resultCount });
    }
  };

  const handleSeasonFilter = (season: string) => {
    setSelectedSeason(season);
    if (season) {
      const resultCount = allProducts?.filter(p => p.season === season).length || 0;
      trackCatalogFilter({ type: 'season', value: season, resultCount });
    }
  };

  const hasActiveFilters = selectedBrand || selectedCategory || selectedAgeRange || selectedSeason;

  // Filter button component
  const FilterButton = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`block w-full text-left text-sm px-3 py-2  transition-colors ${
        active
          ? "text-white"
          : "hover:opacity-70"
      }`}
      style={{
        backgroundColor: active ? C.darkBrown : "transparent",
        color: active ? C.white : C.textBrown,
      }}
    >
      {label}
    </button>
  );

  // Filter sidebar component
  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Brand Filter */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: C.darkBrown }}>Brand</h3>
        <div className="space-y-1">
          <FilterButton label="All Brands" active={selectedBrand === ""} onClick={() => handleBrandFilter("")} />
          {brands?.map((brand) => (
            <FilterButton
              key={brand._id}
              label={brand.name}
              active={selectedBrand === brand.name}
              onClick={() => handleBrandFilter(brand.name)}
            />
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: C.darkBrown }}>Category</h3>
        <div className="space-y-1">
          <FilterButton label="All Categories" active={selectedCategory === ""} onClick={() => handleCategoryFilter("")} />
          {filterOptions.categories.map((cat) => (
            <FilterButton
              key={cat}
              label={cat}
              active={selectedCategory === cat}
              onClick={() => handleCategoryFilter(cat)}
            />
          ))}
        </div>
      </div>

      {/* Age Range Filter */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: C.darkBrown }}>Age Range</h3>
        <div className="space-y-1">
          <FilterButton label="All Ages" active={selectedAgeRange === ""} onClick={() => handleAgeRangeFilter("")} />
          {filterOptions.ageRanges.map((age) => (
            <FilterButton
              key={age}
              label={age}
              active={selectedAgeRange === age}
              onClick={() => handleAgeRangeFilter(age)}
            />
          ))}
        </div>
      </div>

      {/* Season Filter */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: C.darkBrown }}>Season</h3>
        <div className="space-y-1">
          <FilterButton label="All Seasons" active={selectedSeason === ""} onClick={() => handleSeasonFilter("")} />
          {filterOptions.seasons.map((season) => (
            <FilterButton
              key={season}
              label={season}
              active={selectedSeason === season}
              onClick={() => handleSeasonFilter(season)}
            />
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 px-4 py-2  border-2 text-sm font-medium transition-colors hover:opacity-70"
          style={{ borderColor: C.darkBrown, color: C.darkBrown }}
        >
          <X className="w-4 h-4" />
          Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
      <Header />

      {/* Cart Progress Bar (hidden in waitlist mode) */}
      {isAuthenticated && !isWaitlistMode && (
        <div className="bg-white border-b border-gray-200 py-3 md:py-4 sticky top-[105px] z-40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: C.darkBrown }}>
                {cartCount} of 5 items selected
              </span>
              {cartCount === 5 && (
                <Link href="/checkout">
                  <button
                    className="px-6 py-2  text-sm font-medium text-white transition-colors hover:opacity-90"
                    style={{ backgroundColor: C.red }}
                  >
                    Proceed to Checkout
                  </button>
                </Link>
              )}
            </div>
            <div className="w-full h-2  overflow-hidden" style={{ backgroundColor: C.lavender }}>
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${((cartCount ?? 0) / 5) * 100}%`, backgroundColor: C.red }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 max-w-7xl mx-auto px-6 py-8">
        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <button
                className="w-full flex items-center justify-center gap-2 px-4 py-3  text-sm font-medium"
                style={{ backgroundColor: C.white, color: C.darkBrown }}
              >
                <Filter className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span
                    className="ml-2 px-2 py-0.5  text-xs text-white"
                    style={{ backgroundColor: C.red }}
                  >
                    Active
                  </span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle style={{ color: C.darkBrown }}>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterSidebar />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-48 bg-white  p-6">
              <FilterSidebar />
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl mb-2" style={{ color: C.darkBrown }}>
                Rent Collection
              </h1>
              <p style={{ color: C.textBrown }}>{products?.length || 0} pieces available</p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.textBrown }} />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {products?.map((product) => {
                  const availableCount = getAvailabilityCount(product.slug);
                  const inCart = isInCart(product.slug);
                  const outOfStock = availableCount === 0;
                  const imageUrl = getProductImageUrl(product, { width: 400, height: 400 });

                  return (
                    <div key={product._id} className="group">
                      <Link href={`/product/${product.slug}`} className="block">
                        <div
                          className="aspect-square  relative overflow-hidden mb-3"
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

                          {/* Badges */}
                          {availableCount <= 3 && availableCount > 0 && (
                            <span
                              className="absolute top-3 left-3 px-3 py-1  text-xs text-white"
                              style={{ backgroundColor: C.red }}
                            >
                              Only {availableCount} left
                            </span>
                          )}
                          {outOfStock && (
                            <span
                              className="absolute top-3 left-3 px-3 py-1  text-xs text-white"
                              style={{ backgroundColor: C.darkBrown }}
                            >
                              Out of Stock
                            </span>
                          )}
                          {inCart && (
                            <div
                              className="absolute top-3 right-3 w-8 h-8  flex items-center justify-center"
                              style={{ backgroundColor: "#22c55e" }}
                            >
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}

                          {/* Favorite Button */}
                          <div className="absolute bottom-3 right-3">
                            <FavoriteButton productSlug={product.slug} size="sm" />
                          </div>
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

                        {inCart && !isWaitlistMode ? (
                          <button
                            onClick={() => handleRemoveFromCart(product.slug)}
                            className="w-full flex items-center justify-center gap-1 px-4 py-2  text-sm font-medium border-2 transition-colors hover:opacity-70"
                            style={{ borderColor: C.darkBrown, color: C.darkBrown }}
                          >
                            <Minus className="w-4 h-4" />
                            Remove
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(product.slug)}
                            disabled={(!isWaitlistMode && (!canAddMore || outOfStock)) || addToCartMutation.isPending}
                            className="w-full flex items-center justify-center gap-1 px-4 py-2  text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
                            style={{ backgroundColor: isWaitlistMode ? C.red : C.darkBrown }}
                          >
                            {addToCartMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isWaitlistMode ? (
                              <>
                                <Plus className="w-4 h-4" />
                                Add to Box
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" />
                                Add
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!isLoading && products?.length === 0 && (
              <div className="text-center py-20">
                <p style={{ color: C.textBrown }}>No products found with the selected filters.</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 underline"
                    style={{ color: C.red }}
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />

      {/* Waitlist Modal */}
      <WaitlistModal
        open={waitlistModalOpen}
        onOpenChange={setWaitlistModalOpen}
        source="add_to_cart"
      />
    </div>
  );
}
