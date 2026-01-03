import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { fetchProducts, getProductImageUrl, type SanityProduct } from "@/lib/sanity";
import { generateReturnLabel } from "@/lib/returnLabel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { Loader2, ShoppingBag, Calendar, Package, Download, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import Navigation from "@/components/Navigation";

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: subscription, isLoading: subLoading } = trpc.subscription.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: currentBox, isLoading: boxLoading } = trpc.box.current.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Fetch all products from Sanity to match with box items
  const { data: allProducts } = useQuery<SanityProduct[]>({
    queryKey: ["sanity", "products"],
    queryFn: fetchProducts,
  });

  // Match box items with Sanity products
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

  const utils = trpc.useUtils();

  if (authLoading || !isAuthenticated) {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (subLoading || boxLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <nav className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-light tracking-wide text-neutral-900">
              Seasons
            </Link>
          </div>
        </nav>
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-light text-neutral-900 mb-4">No Active Subscription</h1>
          <p className="text-neutral-600 mb-8">
            Start your journey with Seasons by selecting your first 5 items.
          </p>
          <Link href="/catalog">
            <span className="inline-block">
              <Button size="lg" className="rounded-full">Browse Collection</Button>
            </span>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate days remaining
  const today = new Date();
  const cycleEnd = new Date(subscription.cycleEndDate);
  const daysRemaining = Math.ceil((cycleEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const swapWindowOpen = daysRemaining <= 10;

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navigation />

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-neutral-900 mb-2">Welcome back, {user?.name}</h1>
          <p className="text-neutral-600">Manage your subscription and wardrobe</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Days Remaining */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-neutral-600" />
              <h3 className="font-medium text-neutral-900">Days Remaining</h3>
            </div>
            <p className="text-3xl font-light text-neutral-900">{daysRemaining}</p>
            <p className="text-sm text-neutral-600 mt-1">
              Until {new Date(subscription.cycleEndDate).toLocaleDateString()}
            </p>
          </Card>

          {/* Next Billing */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-neutral-600" />
              <h3 className="font-medium text-neutral-900">Next Billing</h3>
            </div>
            <p className="text-3xl font-light text-neutral-900">€70</p>
            <p className="text-sm text-neutral-600 mt-1">
              On {new Date(subscription.nextBillingDate).toLocaleDateString()}
            </p>
          </Card>

          {/* Status */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-medium text-neutral-900">Status</h3>
            </div>
            <Badge 
              className={
                subscription.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : subscription.status === 'paused'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-neutral-100 text-neutral-800'
              }
            >
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </Badge>
            {swapWindowOpen && (
              <Badge className="ml-2 bg-blue-100 text-blue-800">
                Swap Window Open
              </Badge>
            )}
          </Card>
        </div>

        {/* Swap Window Alert */}
        {swapWindowOpen && (
          <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-medium text-neutral-900 mb-2">Time to Select Your Next Box!</h3>
                <p className="text-neutral-700 text-sm md:text-base">
                  Your swap window is now open. Select your next 5 items before your current cycle ends.
                </p>
              </div>
              <Link href="/swap-selection">
                <span className="inline-block">
                  <Button className="rounded-full whitespace-nowrap">
                    Select Next Box
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </span>
              </Link>
            </div>
          </Card>
        )}

        {/* Current Wardrobe */}
        <div className="mb-8">
          <h2 className="text-2xl font-light text-neutral-900 mb-6">Current Wardrobe</h2>
          {boxItemsWithProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {boxItemsWithProducts.map((item) => (
                <Card key={item.boxItem.id} className="overflow-hidden">
                  <Link href={item.sanityProduct ? `/product/${item.sanityProduct.slug}` : "#"}>
                    <div className="aspect-square bg-neutral-100 relative">
                      {(() => {
                        const imageUrl = item.sanityProduct
                          ? getProductImageUrl(item.sanityProduct, { width: 300, height: 300 })
                          : null;
                        return imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.sanityProduct?.name || "Product"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-12 h-12 text-neutral-300" />
                          </div>
                        );
                      })()}
                    </div>
                  </Link>
                  <div className="p-3 md:p-4">
                    <div className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                      {item.sanityProduct?.brand?.name}
                    </div>
                    <div className="text-sm font-medium text-neutral-900 line-clamp-2">
                      {item.sanityProduct?.name || "Unknown Item"}
                    </div>
                    <div className="text-xs text-neutral-500 mt-2">
                      SKU: {item.inventoryItem?.sku}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-neutral-600">No items in your current box</p>
            </Card>
          )}
        </div>

        {/* Return Label */}
        {currentBox && subscription && (
          <Card className="p-6 mb-8">
            <h3 className="font-medium text-neutral-900 mb-4">Return Your Box</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Return by: {new Date(currentBox.returnByDate).toLocaleDateString()}
            </p>
            <Button
              variant="outline"
              className="rounded-full"
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
            >
              <Download className="w-4 h-4 mr-2" />
              Download Return Label
            </Button>
            <p className="text-xs text-neutral-500 mt-3">
              A pre-paid return label is also included in your box
            </p>
          </Card>
        )}

        {/* Subscription Management */}
        <Card className="p-6">
          <h3 className="font-medium text-neutral-900 mb-4">Manage Subscription</h3>
          <div className="flex gap-3">
            {subscription.status === 'active' && (
              <Button
                variant="outline"
                onClick={() => pauseSubscription.mutate()}
                disabled={pauseSubscription.isPending}
              >
                {pauseSubscription.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Pausing...
                  </>
                ) : (
                  "Pause Subscription"
                )}
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm("Are you sure you want to cancel your subscription?")) {
                  cancelSubscription.mutate();
                }
              }}
              disabled={cancelSubscription.isPending}
            >
              {cancelSubscription.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Cancel Subscription"
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
