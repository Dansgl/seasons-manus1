/**
 * CartV6 - Shopping cart page with V6 design system
 */

import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/_core/hooks/useAuth";
import { getCart, getCartCount, removeFromCart } from "@/lib/supabase-db";
import { fetchProducts, urlFor, type SanityProduct } from "@/lib/sanity";
import { Link, useLocation } from "wouter";
import { Loader2, ShoppingBag, X, ArrowRight, Package, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Header, Footer, V6_COLORS as C } from "@/components/v6";

export default function CartV6() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Get cart slugs from Supabase
  const { data: cartSlugs, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isAuthenticated,
  });

  const { data: cartCount } = useQuery({
    queryKey: ["cartCount"],
    queryFn: getCartCount,
    enabled: isAuthenticated,
  });

  // Fetch all products from Sanity to display cart items
  const { data: allProducts } = useQuery<SanityProduct[]>({
    queryKey: ["sanity", "products"],
    queryFn: fetchProducts,
  });

  // Get cart product details from Sanity data
  const cartProducts = useMemo(() => {
    if (!cartSlugs || !allProducts) return [];
    return cartSlugs
      .map(slug => allProducts.find(p => p.slug === slug))
      .filter((p): p is SanityProduct => p !== undefined);
  }, [cartSlugs, allProducts]);

  const removeFromCartMutation = useMutation({
    mutationFn: (slug: string) => removeFromCart(slug),
    onSuccess: (result, slug) => {
      if (result.success) {
        toast.success("Item removed from your box");
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        queryClient.invalidateQueries({ queryKey: ["cartCount"] });
      } else {
        toast.error(result.error || "Failed to remove item");
      }
    },
    onError: () => {
      toast.error("Failed to remove item");
    },
  });

  const handleRemoveItem = (slug: string) => {
    removeFromCartMutation.mutate(slug);
  };

  const handleProceedToCheckout = () => {
    if (cartCount === 5) {
      setLocation("/checkout");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
        <Header />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="p-8 text-center max-w-md" style={{ backgroundColor: C.white }}>
            <ShoppingBag className="w-16 h-16 mx-auto mb-4" style={{ color: C.lavender }} />
            <h2 className="text-2xl mb-4" style={{ color: C.darkBrown }}>Sign In Required</h2>
            <p className="mb-6" style={{ color: C.textBrown }}>
              Please sign in to view your cart and start your subscription
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

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: C.beige }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.textBrown }} />
      </div>
    );
  }

  const itemsRemaining = 5 - (cartCount || 0);
  const canCheckout = cartCount === 5;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
      <Header />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl mb-2" style={{ color: C.darkBrown }}>
            Your Box
          </h1>
          <p className="text-base mb-8" style={{ color: C.textBrown }}>
            Select 5 items to start your quarterly subscription
          </p>

          {cartCount === 0 ? (
            <div className="text-center py-16">
              <div className="p-8 inline-block" style={{ backgroundColor: C.white }}>
                <ShoppingBag className="w-20 h-20 mx-auto mb-4" style={{ color: C.lavender }} />
                <h2 className="text-2xl mb-4" style={{ color: C.darkBrown }}>
                  Your box is empty
                </h2>
                <p className="mb-6 max-w-md" style={{ color: C.textBrown }}>
                  Browse our collection of premium baby clothing and add 5 items to your box to get started
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
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {/* Progress Indicator */}
                <div className="p-6" style={{ backgroundColor: C.white }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold" style={{ color: C.darkBrown }}>
                      Items in Box: {cartCount} / 5
                    </h2>
                    {!canCheckout && (
                      <span className="text-sm" style={{ color: C.textBrown }}>
                        {itemsRemaining} more {itemsRemaining === 1 ? 'item' : 'items'} needed
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2" style={{ backgroundColor: C.beige }}>
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        backgroundColor: canCheckout ? C.green : C.red,
                        width: `${((cartCount || 0) / 5) * 100}%`,
                      }}
                    />
                  </div>

                  {canCheckout && (
                    <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: C.green }}>
                      <Package className="w-4 h-4" />
                      <span className="font-medium">Your box is ready for checkout!</span>
                    </div>
                  )}
                </div>

                {/* Cart Items List */}
                <div className="space-y-4">
                  {cartProducts.map((product) => (
                    <div
                      key={product._id}
                      className="p-6 flex gap-4"
                      style={{ backgroundColor: C.white }}
                    >
                      {/* Product Image */}
                      <div
                        className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 overflow-hidden"
                        style={{ backgroundColor: C.beige }}
                      >
                        {product.mainImage ? (
                          <img
                            src={urlFor(product.mainImage).width(200).height(200).auto("format").url()}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8" style={{ color: C.lavender }} />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs mb-1 font-medium" style={{ color: C.red }}>
                          {product.brand?.name}
                        </p>
                        <h3 className="text-base md:text-lg mb-2" style={{ color: C.darkBrown }}>
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-sm line-clamp-2 mb-3" style={{ color: C.textBrown }}>
                            {product.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {product.ageRange && (
                            <span
                              className="text-xs px-2 py-1"
                              style={{ backgroundColor: C.beige, color: C.textBrown }}
                            >
                              {product.ageRange}
                            </span>
                          )}
                          {product.category && (
                            <span
                              className="text-xs px-2 py-1"
                              style={{ backgroundColor: C.beige, color: C.textBrown }}
                            >
                              {product.category}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(product.slug)}
                        disabled={removeFromCartMutation.isPending}
                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity disabled:opacity-50"
                        style={{ color: C.textBrown }}
                        title="Remove from box"
                      >
                        {removeFromCartMutation.isPending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <X className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                {!canCheckout && (
                  <Link href="/catalog">
                    <button
                      className="w-full py-4 text-base font-medium hover:opacity-90 transition-opacity border-2"
                      style={{
                        borderColor: C.red,
                        color: C.red,
                        backgroundColor: "transparent",
                      }}
                    >
                      Continue Shopping
                    </button>
                  </Link>
                )}
              </div>

              {/* Summary Sidebar */}
              <div>
                <div className="p-6 sticky top-32" style={{ backgroundColor: C.white }}>
                  <h2 className="text-xl font-semibold mb-6" style={{ color: C.darkBrown }}>
                    Subscription Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: C.textBrown }}>Quarterly Price</span>
                      <span className="font-medium" style={{ color: C.darkBrown }}>350 RON</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: C.textBrown }}>Items Selected</span>
                      <span className="font-medium" style={{ color: C.darkBrown }}>
                        {cartCount} / 5
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: C.textBrown }}>Cycle Duration</span>
                      <span className="font-medium" style={{ color: C.darkBrown }}>3 months</span>
                    </div>
                  </div>

                  <div className="border-t pt-6 mb-6" style={{ borderColor: C.lavender }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium" style={{ color: C.darkBrown }}>Total</span>
                      <span className="text-3xl font-light" style={{ color: C.darkBrown }}>350 RON</span>
                    </div>
                    <p className="text-xs" style={{ color: C.textBrown }}>
                      Billed every 3 months
                    </p>
                  </div>

                  <button
                    onClick={handleProceedToCheckout}
                    disabled={!canCheckout}
                    className="w-full flex items-center justify-center gap-2 py-4 text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: C.red }}
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {!canCheckout && (
                    <p className="text-xs text-center mt-3" style={{ color: C.textBrown }}>
                      Add {itemsRemaining} more {itemsRemaining === 1 ? 'item' : 'items'} to checkout
                    </p>
                  )}

                  {/* Features */}
                  <div className="mt-6 pt-6 border-t space-y-3" style={{ borderColor: C.lavender }}>
                    <div className="flex items-center gap-2 text-xs" style={{ color: C.textBrown }}>
                      <Sparkles className="w-4 h-4 flex-shrink-0" style={{ color: C.red }} />
                      <span>Premium European brands</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: C.textBrown }}>
                      <Sparkles className="w-4 h-4 flex-shrink-0" style={{ color: C.red }} />
                      <span>Ozone cleaned & sanitized</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: C.textBrown }}>
                      <Package className="w-4 h-4 flex-shrink-0" style={{ color: C.red }} />
                      <span>Pre-paid return shipping</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
