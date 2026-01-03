/**
 * CheckoutV6 - Checkout page with V6 design system
 */

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/_core/hooks/useAuth";
import { getCart, getCartCount, createSubscription } from "@/lib/supabase-db";
import { fetchProducts, urlFor, type SanityProduct } from "@/lib/sanity";
import { Link, useLocation } from "wouter";
import { Loader2, ShoppingBag, Check, Shield, Sparkles, Package } from "lucide-react";
import { toast } from "sonner";
import { Header, Footer, V6_COLORS as C } from "@/components/v6";

export default function CheckoutV6() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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

  const createSubscriptionMutation = useMutation({
    mutationFn: (data: { shippingAddress: string; phone?: string }) =>
      createSubscription(data.shippingAddress, data.phone),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Subscription created successfully!");
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        queryClient.invalidateQueries({ queryKey: ["cartCount"] });
        setLocation("/dashboard");
      } else {
        toast.error(result.error || "Failed to create subscription");
      }
    },
    onError: () => {
      toast.error("Failed to create subscription");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    if (!shippingAddress.trim()) {
      toast.error("Please enter your shipping address");
      return;
    }

    createSubscriptionMutation.mutate({
      shippingAddress,
      phone: phone || undefined,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
        <Header />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className=" p-8 text-center max-w-md" style={{ backgroundColor: C.white }}>
            <p className="mb-6" style={{ color: C.textBrown }}>Please sign in to checkout</p>
            <Link href="/login">
              <button
                className="px-8 py-3  text-base font-medium text-white hover:opacity-90 transition-opacity"
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

  if (cartCount !== 5) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
        <Header />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className=" p-8 text-center max-w-md" style={{ backgroundColor: C.white }}>
            <h2 className="text-2xl mb-4" style={{ color: C.darkBrown }}>Almost There!</h2>
            <p className="mb-6" style={{ color: C.textBrown }}>
              You need exactly 5 items to start your subscription. Currently selected: {cartCount}
            </p>
            <Link href="/catalog">
              <button
                className="px-8 py-3  text-base font-medium text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: C.red }}
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
      <Header />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl mb-8" style={{ color: C.darkBrown }}>
            Complete Your Subscription
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className=" p-6" style={{ backgroundColor: C.white }}>
                <h2 className="text-xl font-semibold mb-6" style={{ color: C.darkBrown }}>
                  Shipping Information
                </h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: C.darkBrown }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={user?.name || ""}
                      disabled
                      className="w-full px-4 py-3  border-2 text-sm"
                      style={{ borderColor: C.lavender, color: C.textBrown, backgroundColor: C.beige }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: C.darkBrown }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-4 py-3  border-2 text-sm"
                      style={{ borderColor: C.lavender, color: C.textBrown, backgroundColor: C.beige }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: C.darkBrown }}>
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+421 900 000 000"
                      className="w-full px-4 py-3  border-2 text-sm focus:outline-none transition-colors"
                      style={{ borderColor: C.lavender, color: C.darkBrown }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: C.darkBrown }}>
                      Shipping Address *
                    </label>
                    <textarea
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Street address, city, postal code, country"
                      rows={4}
                      required
                      className="w-full px-4 py-3  border-2 text-sm focus:outline-none transition-colors resize-none"
                      style={{ borderColor: C.lavender, color: C.darkBrown }}
                    />
                  </div>
                </form>
              </div>

              {/* Subscription Terms */}
              <div className=" p-6" style={{ backgroundColor: C.white }}>
                <h2 className="text-xl font-semibold mb-6" style={{ color: C.darkBrown }}>
                  Subscription Agreement
                </h2>
                <div className="space-y-4 text-sm" style={{ color: C.textBrown }}>
                  <p>By subscribing to Seasons, you agree to the following terms:</p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: C.red }}>•</span>
                      <span>Quarterly billing of €70 every 3 months</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: C.red }}>•</span>
                      <span>You will receive 5 luxury baby items per cycle</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: C.red }}>•</span>
                      <span>Items must be returned at the end of each 3-month cycle</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: C.red }}>•</span>
                      <span>Normal wear and tear is included in your subscription</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: C.red }}>•</span>
                      <span>All items are professionally cleaned with Ozone technology</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: C.red }}>•</span>
                      <span>You can cancel your subscription at any time</span>
                    </li>
                  </ul>

                  <div className="flex items-start gap-3 pt-4 mt-4 border-t" style={{ borderColor: C.lavender }}>
                    <button
                      type="button"
                      onClick={() => setAgreedToTerms(!agreedToTerms)}
                      className="w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
                      style={{
                        borderColor: agreedToTerms ? C.red : C.lavender,
                        backgroundColor: agreedToTerms ? C.red : "transparent",
                      }}
                    >
                      {agreedToTerms && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <label
                      onClick={() => setAgreedToTerms(!agreedToTerms)}
                      className="text-sm cursor-pointer"
                      style={{ color: C.darkBrown }}
                    >
                      I agree to the subscription terms and conditions
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={createSubscriptionMutation.isPending || !agreedToTerms}
                className="w-full flex items-center justify-center gap-2 py-4  text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: C.red }}
              >
                {createSubscriptionMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Complete Subscription
                  </>
                )}
              </button>
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <div className=" p-6 sticky top-32" style={{ backgroundColor: C.white }}>
                <h2 className="text-xl font-semibold mb-6" style={{ color: C.darkBrown }}>
                  Your Box
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cartProducts.map((product) => (
                    <div key={product._id} className="flex gap-3">
                      <div className="w-16 h-16  flex-shrink-0 overflow-hidden" style={{ backgroundColor: C.beige }}>
                        {product.mainImage ? (
                          <img
                            src={urlFor(product.mainImage).width(64).height(64).auto("format").url()}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6" style={{ color: C.lavender }} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs mb-1" style={{ color: C.red }}>{product.brand?.name}</p>
                        <p className="text-sm line-clamp-2" style={{ color: C.darkBrown }}>
                          {product.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="border-t pt-4 space-y-2" style={{ borderColor: C.lavender }}>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: C.textBrown }}>Quarterly Subscription</span>
                    <span style={{ color: C.darkBrown }}>€70.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: C.textBrown }}>Items</span>
                    <span style={{ color: C.darkBrown }}>5 pieces</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: C.textBrown }}>Cycle Duration</span>
                    <span style={{ color: C.darkBrown }}>3 months</span>
                  </div>
                </div>

                <div className="border-t mt-4 pt-4" style={{ borderColor: C.lavender }}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium" style={{ color: C.darkBrown }}>Total Today</span>
                    <span className="text-3xl font-light" style={{ color: C.darkBrown }}>€70</span>
                  </div>
                  <p className="text-xs mt-2" style={{ color: C.textBrown }}>
                    Billed quarterly. Next payment in 3 months.
                  </p>
                </div>

                {/* Features */}
                <div className="mt-6 pt-6 border-t space-y-3" style={{ borderColor: C.lavender }}>
                  <div className="flex items-center gap-2 text-xs" style={{ color: C.textBrown }}>
                    <Shield className="w-4 h-4" style={{ color: C.red }} />
                    <span>Insurance included</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: C.textBrown }}>
                    <Sparkles className="w-4 h-4" style={{ color: C.red }} />
                    <span>Ozone cleaned</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: C.textBrown }}>
                    <Package className="w-4 h-4" style={{ color: C.red }} />
                    <span>Pre-paid return label</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
