/**
 * CheckoutV6 - Checkout page with V6 design system
 * Integrates with Stripe Checkout for subscription payments (client-side)
 */

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/_core/hooks/useAuth";
import { getCart, getCartCount } from "@/lib/supabase-db";
import { fetchProducts, getProductImageUrl, type SanityProduct } from "@/lib/sanity";
import { Link } from "wouter";
import { Loader2, ShoppingBag, Check, Shield, Sparkles, Package, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Header, Footer, V6_COLORS as C, CheckoutErrorBoundary } from "@/components/v6";

// Stripe Payment Link (hosted by Stripe - no server needed)
// Use test mode link for development, live link for production
const STRIPE_PAYMENT_LINK = import.meta.env.VITE_STRIPE_PAYMENT_LINK || "https://buy.stripe.com/28E7sL5POcAx68u2eW0Jq00";

function CheckoutV6Content() {
  const { user, isAuthenticated } = useAuth();
  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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

  const [isRedirecting, setIsRedirecting] = useState(false);

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

    setIsRedirecting(true);

    // Store shipping info in localStorage for after checkout
    localStorage.setItem("checkout_shipping", JSON.stringify({
      address: shippingAddress,
      phone: phone || undefined,
      cartItems: cartSlugs || [],
      email: user?.email,
    }));

    // Redirect to Stripe Payment Link (prefill email if available)
    const paymentUrl = user?.email
      ? `${STRIPE_PAYMENT_LINK}?prefilled_email=${encodeURIComponent(user.email)}`
      : STRIPE_PAYMENT_LINK;

    window.location.href = paymentUrl;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
        <Header />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className=" p-8 text-center max-w-md" style={{ backgroundColor: C.white }}>
            <p className="mb-6" style={{ color: C.textBrown }}>Te rugăm să te autentifici pentru a finaliza</p>
            <Link href="/login">
              <button
                className="px-8 py-3  text-base font-medium text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: C.red }}
              >
                Autentifică-te
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
            <h2 className="text-2xl mb-4" style={{ color: C.darkBrown }}>Aproape gata!</h2>
            <p className="mb-6" style={{ color: C.textBrown }}>
              Ai nevoie de exact 5 articole pentru a începe abonamentul. Selectate: {cartCount}
            </p>
            <Link href="/catalog">
              <button
                className="px-8 py-3  text-base font-medium text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: C.red }}
              >
                Continuă cumpărăturile
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
            Finalizează abonamentul
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className=" p-6" style={{ backgroundColor: C.white }}>
                <h2 className="text-xl font-semibold mb-6" style={{ color: C.darkBrown }}>
                  Informații livrare
                </h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: C.darkBrown }}>
                      Nume complet
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
                      Telefon (opțional)
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
                      Adresă de livrare *
                    </label>
                    <textarea
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Strada, număr, oraș, cod poștal"
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
                  Termeni abonament
                </h2>
                <div className="space-y-4 text-sm" style={{ color: C.textBrown }}>
                  <p>Prin abonare la Seasons, accepți următorii termeni:</p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: C.red }}>•</span>
                      <span>Facturare trimestrială de 350 lei la fiecare 3 luni</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: C.red }}>•</span>
                      <span>Vei primi 5 articole premium pe ciclu</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: C.red }}>•</span>
                      <span>Articolele trebuie returnate la sfârșitul fiecărui ciclu de 3 luni</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: C.red }}>•</span>
                      <span>Uzura normală este inclusă în abonament</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: C.red }}>•</span>
                      <span>Toate articolele sunt curățate profesional</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: C.red }}>•</span>
                      <span>Poți anula abonamentul oricând</span>
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
                      Sunt de acord cu termenii și condițiile abonamentului
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isRedirecting || !agreedToTerms}
                className="w-full flex items-center justify-center gap-2 py-4  text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: C.red }}
              >
                {isRedirecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Redirecționare către plată...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Continuă la plată
                  </>
                )}
              </button>
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <div className=" p-6 sticky top-32" style={{ backgroundColor: C.white }}>
                <h2 className="text-xl font-semibold mb-6" style={{ color: C.darkBrown }}>
                  Coșul tău
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cartProducts.map((product) => (
                    <div key={product._id} className="flex gap-3">
                      <div className="w-16 h-16 flex-shrink-0 overflow-hidden" style={{ backgroundColor: C.beige }}>
                        {getProductImageUrl(product, { width: 64, height: 64 }) ? (
                          <img
                            src={getProductImageUrl(product, { width: 64, height: 64 })!}
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
                    <span style={{ color: C.textBrown }}>Abonament trimestrial</span>
                    <span style={{ color: C.darkBrown }}>350 lei</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: C.textBrown }}>Articole</span>
                    <span style={{ color: C.darkBrown }}>5 piese</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: C.textBrown }}>Durată ciclu</span>
                    <span style={{ color: C.darkBrown }}>3 luni</span>
                  </div>
                </div>

                <div className="border-t mt-4 pt-4" style={{ borderColor: C.lavender }}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium" style={{ color: C.darkBrown }}>Total azi</span>
                    <span className="text-3xl font-light" style={{ color: C.darkBrown }}>350 lei</span>
                  </div>
                  <p className="text-xs mt-2" style={{ color: C.textBrown }}>
                    Facturat trimestrial. Următoarea plată în 3 luni.
                  </p>
                </div>

                {/* Features */}
                <div className="mt-6 pt-6 border-t space-y-3" style={{ borderColor: C.lavender }}>
                  <div className="flex items-center gap-2 text-xs" style={{ color: C.textBrown }}>
                    <Shield className="w-4 h-4" style={{ color: C.red }} />
                    <span>Asigurare inclusă</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: C.textBrown }}>
                    <Sparkles className="w-4 h-4" style={{ color: C.red }} />
                    <span>Curățat profesional</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: C.textBrown }}>
                    <Package className="w-4 h-4" style={{ color: C.red }} />
                    <span>Etichetă de retur inclusă</span>
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

// Wrap with error boundary for better checkout error handling
export default function CheckoutV6() {
  return (
    <CheckoutErrorBoundary>
      <CheckoutV6Content />
    </CheckoutErrorBoundary>
  );
}
