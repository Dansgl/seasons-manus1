import { useState, useMemo, useCallback } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { fetchProductBySlug, urlFor, getProductImageUrl, type SanityProduct } from "@/lib/sanity";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Loader2, ShoppingBag, Shield, Sparkles, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Navigation from "@/components/Navigation";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

interface ImageItem {
  src: string;
  alt: string;
}

export default function ProductDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const { isAuthenticated } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  // Fetch product from Sanity
  const { data: product, isLoading } = useQuery<SanityProduct>({
    queryKey: ["sanity", "product", slug],
    queryFn: () => fetchProductBySlug(slug),
    enabled: !!slug,
  });

  // Build all images array from mainImage + images array + externalImageUrl fallback
  const allImages = useMemo((): ImageItem[] => {
    if (!product) return [];

    const images: ImageItem[] = [];

    // Add mainImage first if it exists
    if (product.mainImage) {
      images.push({
        src: urlFor(product.mainImage).width(800).height(800).auto("format").url(),
        alt: product.name,
      });
    }

    // Add additional images from images array
    if (product.images && product.images.length > 0) {
      product.images.forEach((img: SanityImageSource, index: number) => {
        images.push({
          src: urlFor(img).width(800).height(800).auto("format").url(),
          alt: `${product.name} - Image ${index + 2}`,
        });
      });
    }

    // If no Sanity images but has external URL, use that
    if (images.length === 0 && product.externalImageUrl) {
      const url = product.externalImageUrl;
      const formattedUrl = url.includes('unsplash.com')
        ? `${url}&w=800&h=800&fit=crop&auto=format`
        : url;
      images.push({
        src: formattedUrl,
        alt: product.name,
      });
    }

    return images;
  }, [product]);

  // Sync carousel with selected index
  const onCarouselSelect = useCallback(() => {
    if (!carouselApi) return;
    setSelectedImageIndex(carouselApi.selectedScrollSnap());
  }, [carouselApi]);

  // Set up carousel event listener
  useMemo(() => {
    if (!carouselApi) return;
    carouselApi.on("select", onCarouselSelect);
    return () => {
      carouselApi.off("select", onCarouselSelect);
    };
  }, [carouselApi, onCarouselSelect]);

  const scrollToImage = (index: number) => {
    carouselApi?.scrollTo(index);
    setSelectedImageIndex(index);
  };

  // Fetch real-time availability from PostgreSQL
  const { data: availability } = trpc.catalog.availability.useQuery(
    { slugs: [slug] },
    { enabled: !!slug }
  );
  const availableCount = availability?.[slug] ?? 0;

  // Cart state
  const { data: cartCount } = trpc.cart.count.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: cartSlugs } = trpc.cart.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const utils = trpc.useUtils();

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

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    if (product) {
      addToCart.mutate({ slug: product.slug });
    }
  };

  const handleRemoveFromCart = () => {
    if (product) {
      removeFromCart.mutate({ slug: product.slug });
    }
  };

  const isInCart = cartSlugs?.includes(slug) ?? false;
  const canAddMore = (cartCount ?? 0) < 5;
  const outOfStock = availableCount === 0;

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
            <span className="inline-block">
              <Button variant="outline">Back to Catalog</Button>
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navigation showCartCount />

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <Link href="/catalog" className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Catalog
        </Link>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Product Image Gallery */}
          <div className="space-y-4">
            {allImages.length > 0 ? (
              <>
                {/* Main Image Carousel */}
                <div className="relative">
                  <Carousel
                    setApi={setCarouselApi}
                    className="w-full"
                    opts={{
                      loop: allImages.length > 1,
                    }}
                  >
                    <CarouselContent>
                      {allImages.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                            <img
                              src={image.src}
                              alt={image.alt}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {allImages.length > 1 && (
                      <>
                        <CarouselPrevious className="left-2 md:-left-12 bg-white/80 hover:bg-white" />
                        <CarouselNext className="right-2 md:-right-12 bg-white/80 hover:bg-white" />
                      </>
                    )}
                  </Carousel>

                  {/* Image counter for mobile */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full md:hidden">
                      {selectedImageIndex + 1} / {allImages.length}
                    </div>
                  )}
                </div>

                {/* Thumbnail Strip - Desktop Only */}
                {allImages.length > 1 && (
                  <div className="hidden md:flex gap-2 overflow-x-auto pb-2">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => scrollToImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? "border-neutral-900 ring-1 ring-neutral-900"
                            : "border-transparent hover:border-neutral-300"
                        }`}
                      >
                        <img
                          src={image.src}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Dot indicators for mobile */}
                {allImages.length > 1 && (
                  <div className="flex justify-center gap-2 md:hidden">
                    {allImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => scrollToImage(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          selectedImageIndex === index
                            ? "bg-neutral-900 w-4"
                            : "bg-neutral-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square bg-neutral-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-24 h-24 text-neutral-300" />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="text-sm text-neutral-500 uppercase tracking-wide mb-2">
              {product.brand?.name}
            </div>
            <h1 className="text-3xl font-light text-neutral-900 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <Badge variant="outline" className="border-green-600 text-green-700 bg-green-50">
                <Shield className="w-3 h-3 mr-1" />
                Ozone Cleaned
              </Badge>
              <Badge variant="outline" className="border-blue-600 text-blue-700 bg-blue-50">
                <Sparkles className="w-3 h-3 mr-1" />
                Insurance Included
              </Badge>
            </div>

            {product.description && (
              <div className="prose prose-neutral mb-6">
                <p className="text-neutral-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            <div className="space-y-3 mb-8 text-sm">
              <div className="flex justify-between py-2 border-b border-neutral-200">
                <span className="text-neutral-600">Category</span>
                <span className="text-neutral-900 capitalize">{product.category}</span>
              </div>
              {product.ageRange && (
                <div className="flex justify-between py-2 border-b border-neutral-200">
                  <span className="text-neutral-600">Age Range</span>
                  <span className="text-neutral-900">{product.ageRange}</span>
                </div>
              )}
              {product.season && (
                <div className="flex justify-between py-2 border-b border-neutral-200">
                  <span className="text-neutral-600">Season</span>
                  <span className="text-neutral-900 capitalize">{product.season}</span>
                </div>
              )}
              {product.rrpPrice && (
                <div className="flex justify-between py-2 border-b border-neutral-200">
                  <span className="text-neutral-600">Retail Price</span>
                  <span className="text-neutral-900">€{product.rrpPrice}</span>
                </div>
              )}
              <div className="flex justify-between py-2">
                <span className="text-neutral-600">Availability</span>
                <span className={availableCount > 0 ? "text-green-700" : "text-red-700"}>
                  {availableCount > 0 ? `${availableCount} available` : "Out of stock"}
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
                disabled={removeFromCart.isPending}
              >
                {removeFromCart.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Remove from Box
              </Button>
            ) : (
              <Button
                size="lg"
                className="w-full rounded-full"
                disabled={!canAddMore || outOfStock || addToCart.isPending}
                onClick={handleAddToCart}
              >
                {addToCart.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {outOfStock
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
