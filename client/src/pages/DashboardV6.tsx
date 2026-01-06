/**
 * DashboardV6 - User dashboard with V6 design system
 */

import { useMemo, useEffect, useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/_core/hooks/useAuth";
import { getSubscription, getCurrentBox, cancelSubscription, createSubscription } from "@/lib/supabase-db";
import { fetchProducts, getProductImageUrl, type SanityProduct } from "@/lib/sanity";
import { generateReturnLabel } from "@/lib/returnLabel";
import { Link, useLocation, useSearch } from "wouter";
import { Loader2, ShoppingBag, Calendar, Package, Download, ArrowRight, LogOut, CheckCircle, PartyPopper, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { Header, Footer, V6_COLORS as C } from "@/components/v6";

export default function DashboardV6() {
  const { user, isAuthenticated, loading: authLoading, signOut } = useAuth();
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const checkoutProcessedRef = useRef(false);

  const queryClient = useQueryClient();

  // Handle post-checkout: create subscription from localStorage data
  useEffect(() => {
    const params = new URLSearchParams(searchString);
    if (params.get("checkout") !== "success") return;
    if (!isAuthenticated || authLoading) return;
    if (checkoutProcessedRef.current) return;

    // Mark as processed to prevent double execution
    checkoutProcessedRef.current = true;

    // Remove query param from URL immediately
    window.history.replaceState({}, "", "/dashboard");

    const processCheckout = async () => {
      setCheckoutProcessing(true);
      setCheckoutError(null);

      try {
        // Read checkout data from localStorage
        const checkoutDataStr = localStorage.getItem("checkout_shipping");
        if (!checkoutDataStr) {
          // No checkout data - user may have already processed or came here directly
          // Just show success if they have a subscription, otherwise show normal dashboard
          setCheckoutProcessing(false);
          return;
        }

        const checkoutData = JSON.parse(checkoutDataStr);
        const { address, phone } = checkoutData;

        if (!address) {
          setCheckoutError("Missing shipping address. Please contact support.");
          setCheckoutProcessing(false);
          return;
        }

        // Create the subscription
        const result = await createSubscription(address, phone);

        if (result.success) {
          // Clear localStorage
          localStorage.removeItem("checkout_shipping");

          // Invalidate queries to refresh data
          queryClient.invalidateQueries({ queryKey: ["subscription"] });
          queryClient.invalidateQueries({ queryKey: ["currentBox"] });
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          queryClient.invalidateQueries({ queryKey: ["cartCount"] });

          setShowCheckoutSuccess(true);
          toast.success("Subscription activated!");
        } else {
          // Check if they already have an active subscription (payment succeeded but already processed)
          if (result.error?.includes("already have an active subscription")) {
            localStorage.removeItem("checkout_shipping");
            setShowCheckoutSuccess(true);
          } else {
            setCheckoutError(result.error || "Failed to activate subscription");
          }
        }
      } catch (err) {
        console.error("Checkout processing error:", err);
        setCheckoutError("An error occurred while activating your subscription");
      } finally {
        setCheckoutProcessing(false);
      }
    };

    processCheckout();
  }, [searchString, isAuthenticated, authLoading, queryClient]);

  const { data: subscription, isLoading: subLoading } = useQuery({
    queryKey: ["subscription"],
    queryFn: getSubscription,
    enabled: isAuthenticated,
  });

  const { data: currentBox, isLoading: boxLoading } = useQuery({
    queryKey: ["currentBox"],
    queryFn: getCurrentBox,
    enabled: isAuthenticated,
  });

  const { data: allProducts } = useQuery<SanityProduct[]>({
    queryKey: ["sanity", "products"],
    queryFn: fetchProducts,
  });

  const boxItemsWithProducts = useMemo(() => {
    if (!currentBox?.items || !allProducts) return [];
    return currentBox.items.map((item) => {
      const sanityProduct = allProducts.find(p => p.slug === item.sanity_product_slug);
      return {
        inventoryItem: item,
        sanityProduct,
      };
    });
  }, [currentBox, allProducts]);

  const cancelSubscriptionMutation = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Subscription cancelled");
        queryClient.invalidateQueries({ queryKey: ["subscription"] });
      } else {
        toast.error(result.error || "Failed to cancel subscription");
      }
    },
    onError: () => {
      toast.error("Failed to cancel subscription");
    },
  });

  if (authLoading || !isAuthenticated) {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: C.beige }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.textBrown }} />
      </div>
    );
  }

  if (subLoading || boxLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: C.beige }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.textBrown }} />
      </div>
    );
  }

  // Show processing state while creating subscription after checkout
  if (checkoutProcessing) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
        <Header />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6" style={{ color: C.red }} />
            <h1 className="text-2xl md:text-3xl mb-4" style={{ color: C.darkBrown }}>
              Se activează abonamentul...
            </h1>
            <p style={{ color: C.textBrown }}>
              Te rugăm să aștepți în timp ce îți configurăm contul și rezervăm articolele.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state if checkout processing failed
  if (checkoutError) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
        <Header />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div
              className="w-20 h-20 mx-auto mb-6 flex items-center justify-center"
              style={{ backgroundColor: C.lavender }}
            >
              <AlertCircle className="w-10 h-10" style={{ color: C.red }} />
            </div>
            <h1 className="text-2xl md:text-3xl mb-4" style={{ color: C.darkBrown }}>
              Ceva nu a funcționat
            </h1>
            <p className="mb-6" style={{ color: C.textBrown }}>
              {checkoutError}
            </p>
            <p className="mb-8 text-sm" style={{ color: C.textBrown }}>
              Plata ta a fost procesată cu succes. Te rugăm să contactezi support@babyseasons.ro și vom rezolva imediat.
            </p>
            <button
              onClick={() => {
                setCheckoutError(null);
                checkoutProcessedRef.current = false;
              }}
              className="px-8 py-3 text-base font-medium border-2 hover:opacity-70 transition-opacity"
              style={{ borderColor: C.darkBrown, color: C.darkBrown }}
            >
              Încearcă din nou
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!subscription) {
    // Show success message after checkout
    if (showCheckoutSuccess) {
      return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
          <Header />
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="text-center max-w-md">
              <div
                className="w-20 h-20 mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: C.lavender }}
              >
                <PartyPopper className="w-10 h-10" style={{ color: C.red }} />
              </div>
              <h1 className="text-3xl md:text-4xl mb-4" style={{ color: C.darkBrown }}>
                Abonament activat!
              </h1>
              <p className="mb-2 text-lg" style={{ color: C.textBrown }}>
                Bine ai venit la Seasons! Plata ta a fost procesată cu succes.
              </p>
              <p className="mb-8" style={{ color: C.textBrown }}>
                Pregătim primul tău pachet cu articolele selectate. Vei primi un email de confirmare în curând.
              </p>
              <div className="space-y-3">
                <Link href="/catalog">
                  <button
                    className="w-full px-8 py-3 text-base font-medium text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: C.red }}
                  >
                    Continuă să explorezi
                  </button>
                </Link>
                <button
                  onClick={() => setShowCheckoutSuccess(false)}
                  className="w-full px-8 py-3 text-base font-medium border-2 hover:opacity-70 transition-opacity"
                  style={{ borderColor: C.darkBrown, color: C.darkBrown }}
                >
                  Vezi panoul de control
                </button>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
        <Header />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl mb-4" style={{ color: C.darkBrown }}>
              Niciun abonament activ
            </h1>
            <p className="mb-8" style={{ color: C.textBrown }}>
              Începe călătoria cu Seasons selectând primele 5 articole.
            </p>
            <Link href="/catalog">
              <button
                className="px-8 py-3  text-base font-medium text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: C.red }}
              >
                Explorează colecția
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const today = new Date();
  const cycleEnd = new Date(subscription.cycle_end_date);
  const daysRemaining = Math.ceil((cycleEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const swapWindowOpen = daysRemaining <= 10;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
          {/* Welcome */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl mb-2" style={{ color: C.darkBrown }}>
                Bine ai revenit, {user?.name}
              </h1>
              <p style={{ color: C.textBrown }}>Gestionează abonamentul și garderoba</p>
            </div>
            <button
              onClick={async () => {
                await signOut();
                setLocation("/");
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 hover:opacity-70 transition-opacity self-start md:self-auto"
              style={{ borderColor: C.textBrown, color: C.textBrown }}
            >
              <LogOut className="w-4 h-4" />
              Deconectare
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {/* Days Remaining */}
            <div className=" p-6" style={{ backgroundColor: C.white }}>
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5" style={{ color: C.textBrown }} />
                <h3 className="font-medium" style={{ color: C.darkBrown }}>Zile rămase</h3>
              </div>
              <p className="text-4xl font-light" style={{ color: C.darkBrown }}>{daysRemaining}</p>
              <p className="text-sm mt-1" style={{ color: C.textBrown }}>
                Până la {new Date(subscription.cycle_end_date).toLocaleDateString()}
              </p>
            </div>

            {/* Next Billing */}
            <div className=" p-6" style={{ backgroundColor: C.white }}>
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-5 h-5" style={{ color: C.textBrown }} />
                <h3 className="font-medium" style={{ color: C.darkBrown }}>Următoarea facturare</h3>
              </div>
              <p className="text-4xl font-light" style={{ color: C.darkBrown }}>350 lei</p>
              <p className="text-sm mt-1" style={{ color: C.textBrown }}>
                Pe {new Date(subscription.next_billing_date).toLocaleDateString()}
              </p>
            </div>

            {/* Status */}
            <div className=" p-6" style={{ backgroundColor: C.white }}>
              <h3 className="font-medium mb-2" style={{ color: C.darkBrown }}>Status</h3>
              <div className="flex flex-wrap gap-2">
                <span
                  className="px-3 py-1  text-sm font-medium"
                  style={{
                    backgroundColor: subscription.status === 'active' ? C.lavender : C.beige,
                    color: C.darkBrown,
                  }}
                >
                  {subscription.status === 'active' ? 'Activ' : subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                </span>
                {swapWindowOpen && (
                  <span
                    className="px-3 py-1  text-sm font-medium text-white"
                    style={{ backgroundColor: C.red }}
                  >
                    Fereastră de schimb deschisă
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Swap Window Alert */}
          {swapWindowOpen && (
            <div
              className=" p-6 mb-8"
              style={{ backgroundColor: C.lavender }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: C.darkBrown }}>
                    E timpul să alegi următorul pachet!
                  </h3>
                  <p className="text-sm md:text-base" style={{ color: C.darkBrown }}>
                    Fereastra de schimb e deschisă. Selectează următoarele 5 articole înainte să se termine ciclul curent.
                  </p>
                </div>
                <Link href="/swap-selection">
                  <button
                    className="flex items-center gap-2 px-6 py-3  text-sm font-medium text-white whitespace-nowrap hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: C.red }}
                  >
                    Alege următorul pachet
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Current Wardrobe */}
          <div className="mb-8">
            <h2 className="text-2xl mb-6" style={{ color: C.darkBrown }}>Garderoba curentă</h2>
            {boxItemsWithProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {boxItemsWithProducts.map((item, index) => {
                  const imageUrl = item.sanityProduct
                    ? getProductImageUrl(item.sanityProduct, { width: 300, height: 300 })
                    : null;
                  return (
                    <Link
                      key={item.inventoryItem.id || index}
                      href={item.sanityProduct ? `/product/${item.sanityProduct.slug}` : "#"}
                    >
                      <div className="group">
                        <div className="aspect-square overflow-hidden mb-3" style={{ backgroundColor: '#f5f5f0' }}>
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={item.sanityProduct?.name || "Product"}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-12 h-12" style={{ color: C.lavender }} />
                            </div>
                          )}
                        </div>
                        <p className="text-xs font-medium mb-1" style={{ color: C.red }}>
                          {item.sanityProduct?.brand?.name}
                        </p>
                        <p className="text-sm font-medium line-clamp-2" style={{ color: C.darkBrown }}>
                          {item.sanityProduct?.name || "Unknown Item"}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className=" p-12 text-center" style={{ backgroundColor: C.white }}>
                <p style={{ color: C.textBrown }}>Niciun articol în pachetul curent</p>
              </div>
            )}
          </div>

          {/* Return Label */}
          {currentBox && subscription && (
            <div className=" p-6 mb-8" style={{ backgroundColor: C.white }}>
              <h3 className="font-semibold mb-4" style={{ color: C.darkBrown }}>Returnează pachetul</h3>
              <p className="text-sm mb-4" style={{ color: C.textBrown }}>
                Termen retur: {new Date(currentBox.return_by_date).toLocaleDateString()}
              </p>
              <button
                onClick={() => {
                  generateReturnLabel({
                    customerName: user?.name || "Customer",
                    customerAddress: (user as any)?.shipping_address || "Address not provided",
                    boxId: currentBox.id,
                    subscriptionId: subscription.id,
                    returnByDate: new Date(currentBox.return_by_date).toLocaleDateString(),
                  });
                  toast.success("Return label downloaded!");
                }}
                className="flex items-center gap-2 px-6 py-2  text-sm font-medium border-2 hover:opacity-70 transition-opacity"
                style={{ borderColor: C.darkBrown, color: C.darkBrown }}
              >
                <Download className="w-4 h-4" />
                Descarcă eticheta de retur
              </button>
              <p className="text-xs mt-3" style={{ color: C.textBrown }}>
                O etichetă de retur preplătită e inclusă în pachetul tău
              </p>
            </div>
          )}

          {/* Subscription Management */}
          <div className=" p-6" style={{ backgroundColor: C.white }}>
            <h3 className="font-semibold mb-4" style={{ color: C.darkBrown }}>Gestionare abonament</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  if (confirm("Ești sigur/ă că vrei să anulezi abonamentul? Va trebui să returnezi articolele curente.")) {
                    cancelSubscriptionMutation.mutate();
                  }
                }}
                disabled={cancelSubscriptionMutation.isPending}
                className="flex items-center gap-2 px-6 py-2 text-sm font-medium border-2 hover:opacity-70 transition-opacity disabled:opacity-50"
                style={{ borderColor: C.darkBrown, color: C.darkBrown }}
              >
                {cancelSubscriptionMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {cancelSubscriptionMutation.isPending ? "Se anulează..." : "Anulează abonamentul"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
