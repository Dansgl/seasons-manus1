import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingBag, Shield, Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : 0;
  const { isAuthenticated } = useAuth();

  const { data: product, isLoading } = trpc.products.getById.useQuery({ id: productId });
  const { data: cartCount } = trpc.cart.count.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: cartItems } = trpc.cart.get.useQuery(undefined, {
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

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    if (product) {
      addToCart.mutate({ productId: product.id });
    }
  };

  const handleRemoveFromCart = () => {
    if (product) {
      removeFromCart.mutate({ productId: product.id });
    }
  };

  const isInCart = cartItems?.some(item => item.product?.id === productId) ?? false;
  const canAddMore = (cartCount ?? 0) < 5;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="text-center">
          <p className="text-neutral-600 mb-4">Product not found</p>
          <Link href="/catalog">
            <Button variant="outline">Back to Catalog</Button>
          </Link>
        </div>
      </div>
    );
  }

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
              <a className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Browse</a>
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard">
                <a className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Dashboard</a>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <Link href="/catalog">
          <a className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Catalog
          </a>
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag className="w-24 h-24 text-neutral-300" />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="text-sm text-neutral-500 uppercase tracking-wide mb-2">
              {product.brand}
            </div>
            <h1 className="text-3xl font-light text-neutral-900 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-6">
              {product.ozoneCleaned && (
                <Badge variant="outline" className="border-green-600 text-green-700 bg-green-50">
                  <Shield className="w-3 h-3 mr-1" />
                  Ozone Cleaned
                </Badge>
              )}
              {product.insuranceIncluded && (
                <Badge variant="outline" className="border-blue-600 text-blue-700 bg-blue-50">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Insurance Included
                </Badge>
              )}
            </div>

            <div className="prose prose-neutral mb-6">
              <p className="text-neutral-700 leading-relaxed">{product.description}</p>
            </div>

            <div className="space-y-3 mb-8 text-sm">
              <div className="flex justify-between py-2 border-b border-neutral-200">
                <span className="text-neutral-600">Category</span>
                <span className="text-neutral-900 capitalize">{product.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-200">
                <span className="text-neutral-600">Age Range</span>
                <span className="text-neutral-900">{product.ageRange}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-200">
                <span className="text-neutral-600">Season</span>
                <span className="text-neutral-900 capitalize">{product.season}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-200">
                <span className="text-neutral-600">Retail Price</span>
                <span className="text-neutral-900">€{product.rrpPrice}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral-600">Availability</span>
                <span className={product.availableCount > 0 ? "text-green-700" : "text-red-700"}>
                  {product.availableCount > 0 ? `${product.availableCount} available` : "Out of stock"}
                </span>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-lg p-6 mb-8">
              <h3 className="font-medium text-neutral-900 mb-3">What's Included</h3>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Medical-grade Ozone cleaning between every rental</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Full insurance coverage for wear and tear</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Pre-paid return label included in your box</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Part of your €70 quarterly subscription</span>
                </li>
              </ul>
            </div>

            {isInCart ? (
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-full"
                onClick={handleRemoveFromCart}
              >
                Remove from Box
              </Button>
            ) : (
              <Button
                size="lg"
                className="w-full rounded-full"
                disabled={!canAddMore || product.availableCount === 0}
                onClick={handleAddToCart}
              >
                {product.availableCount === 0 
                  ? "Out of Stock" 
                  : !canAddMore 
                  ? "Box is Full (5/5)" 
                  : "Add to Box"}
              </Button>
            )}

            {isAuthenticated && cartCount !== undefined && (
              <p className="text-center text-sm text-neutral-600 mt-4">
                {cartCount} of 5 items selected
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
