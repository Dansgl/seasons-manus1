import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Plus, Heart, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Catalog() {
  const { isAuthenticated } = useAuth();
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedAgeRange, setSelectedAgeRange] = useState<string>("");
  const [selectedSeason, setSelectedSeason] = useState<string>("");

  const { data: products, isLoading } = trpc.products.list.useQuery({
    brand: selectedBrand || undefined,
    category: selectedCategory || undefined,
    ageRange: selectedAgeRange || undefined,
    season: selectedSeason || undefined,
  });

  const { data: brands } = trpc.products.getBrands.useQuery();
  const { data: cartItems } = trpc.cart.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: cartCount } = trpc.cart.count.useQuery(undefined, {
    enabled: isAuthenticated,
  });

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

  const utils = trpc.useUtils();

  const cartProductIds = useMemo(() => {
    return new Set(cartItems?.map(item => item.product?.id).filter(Boolean));
  }, [cartItems]);

  const categories = [
    "bodysuit", "sleepsuit", "joggers", "jacket", "cardigan", 
    "top", "bottom", "dress", "outerwear", "overall"
  ];

  const ageRanges = ["0-3m", "3-6m", "6-12m", "12-18m", "18-24m"];
  const seasons = ["summer", "winter", "all-season"];

  const handleAddToCart = (productId: number) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    addToCart.mutate({ productId });
  };

  const handleRemoveFromCart = (productId: number) => {
    removeFromCart.mutate({ productId });
  };

  const isInCart = (productId: number) => cartProductIds.has(productId);
  const canAddMore = (cartCount ?? 0) < 5;

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Navigation */}
      <nav className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-light tracking-wide text-neutral-900">Seasons</a>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/catalog">
              <a className="text-sm text-neutral-900 font-medium">Browse</a>
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard">
                <a className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Dashboard</a>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Cart Progress Bar */}
      {isAuthenticated && (
        <div className="bg-white border-b border-neutral-200 py-4">
          <div className="container mx-auto px-6">
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

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="sticky top-32 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-neutral-900 mb-3">Brand</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedBrand("")}
                    className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
                      selectedBrand === "" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    All Brands
                  </button>
                  {brands?.map(brand => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
                        selectedBrand === brand ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-900 mb-3">Category</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === "" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors capitalize ${
                        selectedCategory === cat ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-900 mb-3">Age Range</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedAgeRange("")}
                    className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
                      selectedAgeRange === "" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    All Ages
                  </button>
                  {ageRanges.map(age => (
                    <button
                      key={age}
                      onClick={() => setSelectedAgeRange(age)}
                      className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
                        selectedAgeRange === age ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-900 mb-3">Season</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedSeason("")}
                    className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
                      selectedSeason === "" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    All Seasons
                  </button>
                  {seasons.map(season => (
                    <button
                      key={season}
                      onClick={() => setSelectedSeason(season)}
                      className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors capitalize ${
                        selectedSeason === season ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      {season}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-light text-neutral-900">Browse Collection</h1>
              <p className="text-neutral-600 mt-2">
                {products?.length || 0} luxury pieces available
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map(product => (
                  <Card key={product.id} className="group overflow-hidden border-neutral-200 hover:shadow-lg transition-shadow">
                    <Link href={`/product/${product.id}`}>
                      <a className="block">
                        <div className="aspect-square bg-neutral-100 relative overflow-hidden">
                          {product.imageUrl ? (
                            <img 
                              src={product.imageUrl} 
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-16 h-16 text-neutral-300" />
                            </div>
                          )}
                          {product.lowStock && (
                            <Badge className="absolute top-3 left-3 bg-amber-500 text-white">
                              Only a few left
                            </Badge>
                          )}
                          {product.availableCount === 0 && (
                            <Badge className="absolute top-3 left-3 bg-neutral-900 text-white">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                      </a>
                    </Link>
                    <div className="p-4">
                      <div className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                        {product.brand}
                      </div>
                      <Link href={`/product/${product.id}`}>
                        <a className="text-sm font-medium text-neutral-900 hover:underline line-clamp-2">
                          {product.name}
                        </a>
                      </Link>
                      <div className="text-xs text-neutral-500 mt-1">
                        RRP €{product.rrpPrice}
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        {isInCart(product.id) ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 rounded-full"
                            onClick={() => handleRemoveFromCart(product.id)}
                          >
                            Remove
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="flex-1 rounded-full"
                            disabled={!canAddMore || product.availableCount === 0}
                            onClick={() => handleAddToCart(product.id)}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && products?.length === 0 && (
              <div className="text-center py-20">
                <p className="text-neutral-600">No products found with the selected filters.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
