import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { fetchProducts, fetchBrands, getProductImageUrl, type SanityProduct, type SanityBrand } from "@/lib/sanity";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useSearch } from "wouter";
import { Plus, Minus, Loader2, ShoppingBag, X, Filter, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Navigation from "@/components/Navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Catalog() {
  const { isAuthenticated } = useAuth();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const brandFromUrl = searchParams.get("brand") || "";

  const [selectedBrand, setSelectedBrand] = useState<string>(brandFromUrl);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedAgeRange, setSelectedAgeRange] = useState<string>("");
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Update selected brand when URL changes
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
  const { data: availability } = trpc.catalog.availability.useQuery(
    { slugs: productSlugs },
    { enabled: productSlugs.length > 0 }
  );

  // Cart state
  const { data: cartSlugs } = trpc.cart.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: cartCount } = trpc.cart.count.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const utils = trpc.useUtils();

  const addToCart = trpc.cart.add.useMutation({
    onSuccess: () => {
      toast.success("Added to your box!");
      utils.cart.get.invalidate();
      utils.cart.count.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const removeFromCart = trpc.cart.remove.useMutation({
    onSuccess: () => {
      toast.success("Removed from your box");
      utils.cart.get.invalidate();
      utils.cart.count.invalidate();
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
      // Sort age ranges naturally: 0-3m, 3-6m, 6-12m, etc.
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

  const getAvailability = (slug: string) => availability?.[slug] ?? 0;
  const isInCart = (slug: string) => cartSlugs?.includes(slug) ?? false;
  const canAddMore = (cartCount ?? 0) < 5;

  const handleAddToCart = (slug: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    addToCart.mutate({ slug });
  };

  const handleRemoveFromCart = (slug: string) => {
    removeFromCart.mutate({ slug });
  };

  const clearFilters = () => {
    setSelectedBrand("");
    setSelectedCategory("");
    setSelectedAgeRange("");
    setSelectedSeason("");
  };

  const hasActiveFilters = selectedBrand || selectedCategory || selectedAgeRange || selectedSeason;

  // Filter sidebar component (reused for mobile sheet)
  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Brand Filter */}
      <div>
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Brand</h3>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedBrand("")}
            className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
              selectedBrand === "" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            All Brands
          </button>
          {brands?.map((brand) => (
            <button
              key={brand._id}
              onClick={() => setSelectedBrand(brand.name)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
                selectedBrand === brand.name
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Category</h3>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory("")}
            className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
              selectedCategory === "" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            All Categories
          </button>
          {filterOptions.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors capitalize ${
                selectedCategory === cat
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Age Range Filter */}
      <div>
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Age Range</h3>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedAgeRange("")}
            className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
              selectedAgeRange === "" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            All Ages
          </button>
          {filterOptions.ageRanges.map((age) => (
            <button
              key={age}
              onClick={() => setSelectedAgeRange(age)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
                selectedAgeRange === age
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {age}
            </button>
          ))}
        </div>
      </div>

      {/* Season Filter */}
      <div>
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Season</h3>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedSeason("")}
            className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
              selectedSeason === "" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            All Seasons
          </button>
          {filterOptions.seasons.map((season) => (
            <button
              key={season}
              onClick={() => setSelectedSeason(season)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors capitalize ${
                selectedSeason === season
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {season}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navigation showCartCount />

      {/* Cart Progress Bar */}
      {isAuthenticated && (
        <div className="bg-white border-b border-neutral-200 py-3 md:py-4 sticky top-[65px] z-40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-900">
                {cartCount} of 5 items selected
              </span>
              {cartCount === 5 && (
                <Link href="/checkout">
                  <Button size="sm" className="rounded-full">
                    Proceed to Checkout
                  </Button>
                </Link>
              )}
            </div>
            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-neutral-900 transition-all duration-300"
                style={{ width: `${((cartCount ?? 0) / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">Active</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
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
            <div className="sticky top-40">
              <FilterSidebar />
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-light text-neutral-900">Browse Collection</h1>
              <p className="text-neutral-600 mt-2">{products?.length || 0} luxury pieces available</p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {products?.map((product) => {
                  const availableCount = getAvailability(product.slug);
                  const inCart = isInCart(product.slug);
                  const outOfStock = availableCount === 0;

                  return (
                    <Card
                      key={product._id}
                      className="group overflow-hidden border-neutral-200 hover:shadow-lg transition-shadow"
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
                          {inCart && (
                            <div className="absolute top-2 md:top-3 right-2 md:right-3 w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center">
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
                          {inCart ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full rounded-full"
                              onClick={() => handleRemoveFromCart(product.slug)}
                            >
                              <Minus className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="w-full rounded-full"
                              disabled={!canAddMore || outOfStock || addToCart.isPending}
                              onClick={() => handleAddToCart(product.slug)}
                            >
                              {addToCart.isPending ? (
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
            )}

            {!isLoading && products?.length === 0 && (
              <div className="text-center py-20">
                <p className="text-neutral-600">No products found with the selected filters.</p>
                {hasActiveFilters && (
                  <Button variant="link" onClick={clearFilters} className="mt-2">
                    Clear all filters
                  </Button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
