import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { Loader2, ShoppingBag, Calendar, Package, Download, LogOut } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: subscription, isLoading: subLoading } = trpc.subscription.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: currentBox, isLoading: boxLoading } = trpc.box.current.useQuery(undefined, {
    enabled: isAuthenticated,
  });

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

  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      window.location.href = '/';
    },
  });

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
      {/* Navigation */}
      <nav className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-light tracking-wide text-neutral-900">
            Seasons
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/catalog" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
              Browse
            </Link>
            <Link href="/dashboard" className="text-sm text-neutral-900 font-medium">
              Dashboard
            </Link>
            {user?.role === 'admin' && (
              <Link href="/admin" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                Admin
              </Link>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => logout.mutate()}
              className="text-sm text-neutral-600 hover:text-neutral-900"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
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
          <Card className="p-6 mb-8 bg-blue-50 border-blue-200">
            <h3 className="font-medium text-neutral-900 mb-2">Time to Select Your Next Box!</h3>
            <p className="text-neutral-700 mb-4">
              Your swap window is now open. Select your next 5 items before your current cycle ends.
            </p>
            <Link href="/catalog">
              <span className="inline-block">
                <Button className="rounded-full">Select Next Box</Button>
              </span>
            </Link>
          </Card>
        )}

        {/* Current Wardrobe */}
        <div className="mb-8">
          <h2 className="text-2xl font-light text-neutral-900 mb-6">Current Wardrobe</h2>
          {currentBox && currentBox.items && currentBox.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {currentBox.items.map((item) => (
                <Card key={item.boxItem.id} className="overflow-hidden">
                  <div className="aspect-square bg-neutral-100 relative">
                    {item.product?.imageUrl ? (
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-neutral-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                      {item.product?.brand}
                    </div>
                    <div className="text-sm font-medium text-neutral-900 line-clamp-2">
                      {item.product?.name}
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
        {currentBox && (
          <Card className="p-6 mb-8">
            <h3 className="font-medium text-neutral-900 mb-4">Return Your Box</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Return by: {new Date(currentBox.returnByDate).toLocaleDateString()}
            </p>
            <Button variant="outline" className="rounded-full">
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
