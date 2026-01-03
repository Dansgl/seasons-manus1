/**
 * DashboardV6 - User dashboard with V6 design system
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { fetchProducts, getProductImageUrl, type SanityProduct } from "@/lib/sanity";
import { generateReturnLabel } from "@/lib/returnLabel";
import { Link, useLocation } from "wouter";
import { Loader2, ShoppingBag, Calendar, Package, Download, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { Header, Footer, V6_COLORS as C } from "@/components/v6";

export default function DashboardV6() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: subscription, isLoading: subLoading } = trpc.subscription.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: currentBox, isLoading: boxLoading } = trpc.box.current.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: allProducts } = useQuery<SanityProduct[]>({
    queryKey: ["sanity", "products"],
    queryFn: fetchProducts,
  });

  const boxItemsWithProducts = useMemo(() => {
    if (!currentBox?.items || !allProducts) return [];
    return currentBox.items.map((item) => {
      const sanityProduct = allProducts.find(p => p.slug === item.inventoryItem?.sanityProductSlug);
      return {
        boxItem: item.boxItem,
        inventoryItem: item.inventoryItem,
        sanityProduct,
      };
    });
  }, [currentBox, allProducts]);

  const utils = trpc.useUtils();

  const pauseSubscription = trpc.subscription.pause.useMutation({
    onSuccess: () => {
      toast.success("Subscription paused");
      utils.subscription.get.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const cancelSubscription = trpc.subscription.cancel.useMutation({
    onSuccess: () => {
      toast.success("Subscription cancelled");
      utils.subscription.get.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
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

  if (!subscription) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
        <Header />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl mb-4" style={{ color: C.darkBrown }}>
              No Active Subscription
            </h1>
            <p className="mb-8" style={{ color: C.textBrown }}>
              Start your journey with Seasons by selecting your first 5 items.
            </p>
            <Link href="/catalog">
              <button
                className="px-8 py-3  text-base font-medium text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: C.red }}
              >
                Browse Collection
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const today = new Date();
  const cycleEnd = new Date(subscription.cycleEndDate);
  const daysRemaining = Math.ceil((cycleEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const swapWindowOpen = daysRemaining <= 10;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl mb-2" style={{ color: C.darkBrown }}>
              Welcome back, {user?.name}
            </h1>
            <p style={{ color: C.textBrown }}>Manage your subscription and wardrobe</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {/* Days Remaining */}
            <div className=" p-6" style={{ backgroundColor: C.white }}>
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5" style={{ color: C.textBrown }} />
                <h3 className="font-medium" style={{ color: C.darkBrown }}>Days Remaining</h3>
              </div>
              <p className="text-4xl font-light" style={{ color: C.darkBrown }}>{daysRemaining}</p>
              <p className="text-sm mt-1" style={{ color: C.textBrown }}>
                Until {new Date(subscription.cycleEndDate).toLocaleDateString()}
              </p>
            </div>

            {/* Next Billing */}
            <div className=" p-6" style={{ backgroundColor: C.white }}>
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-5 h-5" style={{ color: C.textBrown }} />
                <h3 className="font-medium" style={{ color: C.darkBrown }}>Next Billing</h3>
              </div>
              <p className="text-4xl font-light" style={{ color: C.darkBrown }}>€70</p>
              <p className="text-sm mt-1" style={{ color: C.textBrown }}>
                On {new Date(subscription.nextBillingDate).toLocaleDateString()}
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
                  {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                </span>
                {swapWindowOpen && (
                  <span
                    className="px-3 py-1  text-sm font-medium text-white"
                    style={{ backgroundColor: C.red }}
                  >
                    Swap Window Open
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
                    Time to Select Your Next Box!
                  </h3>
                  <p className="text-sm md:text-base" style={{ color: C.darkBrown }}>
                    Your swap window is now open. Select your next 5 items before your current cycle ends.
                  </p>
                </div>
                <Link href="/swap-selection">
                  <button
                    className="flex items-center gap-2 px-6 py-3  text-sm font-medium text-white whitespace-nowrap hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: C.red }}
                  >
                    Select Next Box
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Current Wardrobe */}
          <div className="mb-8">
            <h2 className="text-2xl mb-6" style={{ color: C.darkBrown }}>Current Wardrobe</h2>
            {boxItemsWithProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {boxItemsWithProducts.map((item) => {
                  const imageUrl = item.sanityProduct
                    ? getProductImageUrl(item.sanityProduct, { width: 300, height: 300 })
                    : null;
                  return (
                    <Link
                      key={item.boxItem.id}
                      href={item.sanityProduct ? `/product/${item.sanityProduct.slug}` : "#"}
                    >
                      <div className="group">
                        <div className="aspect-square  overflow-hidden mb-3 bg-white">
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
                <p style={{ color: C.textBrown }}>No items in your current box</p>
              </div>
            )}
          </div>

          {/* Return Label */}
          {currentBox && subscription && (
            <div className=" p-6 mb-8" style={{ backgroundColor: C.white }}>
              <h3 className="font-semibold mb-4" style={{ color: C.darkBrown }}>Return Your Box</h3>
              <p className="text-sm mb-4" style={{ color: C.textBrown }}>
                Return by: {new Date(currentBox.returnByDate).toLocaleDateString()}
              </p>
              <button
                onClick={() => {
                  generateReturnLabel({
                    customerName: user?.name || "Customer",
                    customerAddress: user?.shippingAddress || "Address not provided",
                    boxId: currentBox.id,
                    subscriptionId: subscription.id,
                    returnByDate: new Date(currentBox.returnByDate).toLocaleDateString(),
                  });
                  toast.success("Return label downloaded!");
                }}
                className="flex items-center gap-2 px-6 py-2  text-sm font-medium border-2 hover:opacity-70 transition-opacity"
                style={{ borderColor: C.darkBrown, color: C.darkBrown }}
              >
                <Download className="w-4 h-4" />
                Download Return Label
              </button>
              <p className="text-xs mt-3" style={{ color: C.textBrown }}>
                A pre-paid return label is also included in your box
              </p>
            </div>
          )}

          {/* Subscription Management */}
          <div className=" p-6" style={{ backgroundColor: C.white }}>
            <h3 className="font-semibold mb-4" style={{ color: C.darkBrown }}>Manage Subscription</h3>
            <div className="flex flex-wrap gap-3">
              {subscription.status === 'active' && (
                <button
                  onClick={() => pauseSubscription.mutate()}
                  disabled={pauseSubscription.isPending}
                  className="flex items-center gap-2 px-6 py-2  text-sm font-medium border-2 hover:opacity-70 transition-opacity disabled:opacity-50"
                  style={{ borderColor: C.darkBrown, color: C.darkBrown }}
                >
                  {pauseSubscription.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {pauseSubscription.isPending ? "Pausing..." : "Pause Subscription"}
                </button>
              )}
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to cancel your subscription?")) {
                    cancelSubscription.mutate();
                  }
                }}
                disabled={cancelSubscription.isPending}
                className="flex items-center gap-2 px-6 py-2  text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ backgroundColor: C.red }}
              >
                {cancelSubscription.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {cancelSubscription.isPending ? "Cancelling..." : "Cancel Subscription"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
