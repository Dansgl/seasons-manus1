import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { fetchProducts, urlFor, type SanityProduct } from "@/lib/sanity";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useLocation } from "wouter";
import { Loader2, ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Get cart slugs from API
  const { data: cartSlugs, isLoading: cartLoading } = trpc.cart.get.useQuery();
  const { data: cartCount } = trpc.cart.count.useQuery();

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

  const createSubscription = trpc.subscription.create.useMutation({
    onSuccess: () => {
      toast.success("Subscription created successfully!");
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
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

    createSubscription.mutate({
      shippingAddress,
      phone: phone || undefined,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Card className="p-8 max-w-md">
          <p className="text-center text-neutral-600 mb-4">Please sign in to checkout</p>
          <Link href="/">
            <span className="inline-block w-full">
              <Button className="w-full">Go Home</Button>
            </span>
          </Link>
        </Card>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (cartCount !== 5) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Card className="p-8 max-w-md text-center">
          <p className="text-neutral-600 mb-4">
            You must select exactly 5 items to checkout. Currently selected: {cartCount}
          </p>
          <Link href="/catalog">
            <span className="inline-block w-full">
              <Button className="w-full">Continue Shopping</Button>
            </span>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navigation />

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-5xl">
        <h1 className="text-3xl font-light text-neutral-900 mb-8">Complete Your Subscription</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-medium text-neutral-900 mb-4">Shipping Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={user?.name || ""}
                    disabled
                    className="bg-neutral-50"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-neutral-50"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Shipping Address *</Label>
                  <Textarea
                    id="address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Street address, city, postal code, country"
                    rows={4}
                    required
                  />
                </div>
              </form>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-medium text-neutral-900 mb-4">Subscription Agreement</h2>
              <div className="space-y-4 text-sm text-neutral-700">
                <p>
                  By subscribing to Seasons, you agree to the following terms:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Quarterly billing of €70 every 3 months</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>You will receive 5 luxury baby items per cycle</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Items must be returned at the end of each 3-month cycle</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Normal wear and tear is included in your subscription</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>All items are professionally cleaned with Ozone technology</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>You can cancel your subscription at any time</span>
                  </li>
                </ul>

                <div className="flex items-start gap-3 pt-4 border-t border-neutral-200">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm cursor-pointer">
                    I agree to the subscription terms and conditions
                  </label>
                </div>
              </div>
            </Card>

            <Button
              size="lg"
              className="w-full rounded-full"
              onClick={handleSubmit}
              disabled={createSubscription.isPending || !agreedToTerms}
            >
              {createSubscription.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Complete Subscription
                </>
              )}
            </Button>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-medium text-neutral-900 mb-4">Your Box</h2>
              <div className="space-y-3 mb-6">
                {cartProducts.map((product) => (
                  <div key={product._id} className="flex gap-3">
                    <div className="w-16 h-16 bg-neutral-100 rounded flex-shrink-0 overflow-hidden">
                      {product.mainImage ? (
                        <img
                          src={urlFor(product.mainImage).width(64).height(64).auto("format").url()}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-neutral-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-neutral-500">{product.brand?.name}</div>
                      <div className="text-sm text-neutral-900 line-clamp-2">
                        {product.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Quarterly Subscription</span>
                  <span className="text-neutral-900">€70.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Items</span>
                  <span className="text-neutral-900">5 pieces</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Cycle Duration</span>
                  <span className="text-neutral-900">3 months</span>
                </div>
              </div>

              <div className="border-t border-neutral-200 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-neutral-900">Total Today</span>
                  <span className="text-2xl font-light text-neutral-900">€70.00</span>
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  Billed quarterly. Next payment in 3 months.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
