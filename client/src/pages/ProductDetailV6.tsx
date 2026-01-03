/**
 * ProductDetailV6 - Product detail page with V6 design system
 */

import { useState, useMemo, useCallback } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { fetchProductBySlug, urlFor, type SanityProduct } from "@/lib/sanity";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Loader2, ShoppingBag, Shield, Sparkles, ArrowLeft, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Header, Footer, V6_COLORS as C } from "@/components/v6";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

interface ImageItem {
  src: string;
  alt: string;
}

export default function ProductDetailV6() {
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

  // Build all images array
  const allImages = useMemo((): ImageItem[] => {
    if (!product) return [];

    const images: ImageItem[] = [];

    if (product.mainImage) {
      images.push({
        src: urlFor(product.mainImage).width(800).height(800).auto("format").url(),
        alt: product.name,
      });
    }

    if (product.images && product.images.length > 0) {
      product.images.forEach((img: SanityImageSource, index: number) => {
        images.push({
          src: urlFor(img).width(800).height(800).auto("format").url(),
          alt: `${product.name} - Image ${index + 2}`,
        });
      });
    }

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

  const onCarouselSelect = useCallback(() => {
    if (!carouselApi) return;
    setSelectedImageIndex(carouselApi.selectedScrollSnap());
  }, [carouselApi]);

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

  // Fetch availability
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: C.beige }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.textBrown }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4" style={{ color: C.textBrown }}>Product not found</p>
            <Link href="/catalog">
              <button
                className="px-6 py-2  text-sm font-medium"
                style={{ backgroundColor: C.darkBrown, color: C.white }}
              >
                Back to Catalog
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
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Link
            href="/catalog"
            className="inline-flex items-center text-sm mb-6 hover:opacity-70 transition-opacity"
            style={{ color: C.textBrown }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Catalog
          </Link>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Product Image Gallery */}
            <div className="space-y-4">
              {allImages.length > 0 ? (
                <>
                  <div className="relative">
                    <Carousel
                      setApi={setCarouselApi}
                      className="w-full"
                      opts={{ loop: allImages.length > 1 }}
                    >
                      <CarouselContent>
                        {allImages.map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="aspect-square  overflow-hidden bg-white">
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
                          <CarouselPrevious className="left-2 md:-left-12" style={{ backgroundColor: C.white }} />
                          <CarouselNext className="right-2 md:-right-12" style={{ backgroundColor: C.white }} />
                        </>
                      )}
                    </Carousel>

                    {allImages.length > 1 && (
                      <div
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-xs px-3 py-1  md:hidden"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                      >
                        {selectedImageIndex + 1} / {allImages.length}
                      </div>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {allImages.length > 1 && (
                    <div className="hidden md:flex gap-2 overflow-x-auto pb-2">
                      {allImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => scrollToImage(index)}
                          className={`flex-shrink-0 w-20 h-20  overflow-hidden border-2 transition-all ${
                            selectedImageIndex === index
                              ? "border-current ring-1"
                              : "border-transparent hover:border-gray-300"
                          }`}
                          style={{ borderColor: selectedImageIndex === index ? C.darkBrown : undefined }}
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

                  {/* Mobile dots */}
                  {allImages.length > 1 && (
                    <div className="flex justify-center gap-2 md:hidden">
                      {allImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => scrollToImage(index)}
                          className="w-2 h-2  transition-all"
                          style={{
                            backgroundColor: selectedImageIndex === index ? C.darkBrown : C.lavender,
                            width: selectedImageIndex === index ? "16px" : "8px",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-square  flex items-center justify-center bg-white">
                  <ShoppingBag className="w-24 h-24" style={{ color: C.lavender }} />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: C.red }}>
                {product.brand?.name}
              </p>
              <h1 className="text-3xl md:text-4xl mb-4" style={{ color: C.darkBrown }}>
                {product.name}
              </h1>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span
                  className="inline-flex items-center px-3 py-1  text-xs font-medium"
                  style={{ backgroundColor: C.lavender, color: C.darkBrown }}
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Ozone Cleaned
                </span>
                <span
                  className="inline-flex items-center px-3 py-1  text-xs font-medium"
                  style={{ backgroundColor: C.lavender, color: C.darkBrown }}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Insurance Included
                </span>
              </div>

              {product.description && (
                <p className="leading-relaxed mb-6" style={{ color: C.textBrown }}>
                  {product.description}
                </p>
              )}

              {/* Specs Table */}
              <div className="space-y-0 mb-8 text-sm">
                <div className="flex justify-between py-3 border-b" style={{ borderColor: C.lavender }}>
                  <span style={{ color: C.textBrown }}>Category</span>
                  <span className="capitalize" style={{ color: C.darkBrown }}>{product.category}</span>
                </div>
                {product.ageRange && (
                  <div className="flex justify-between py-3 border-b" style={{ borderColor: C.lavender }}>
                    <span style={{ color: C.textBrown }}>Age Range</span>
                    <span style={{ color: C.darkBrown }}>{product.ageRange}</span>
                  </div>
                )}
                {product.season && (
                  <div className="flex justify-between py-3 border-b" style={{ borderColor: C.lavender }}>
                    <span style={{ color: C.textBrown }}>Season</span>
                    <span className="capitalize" style={{ color: C.darkBrown }}>{product.season}</span>
                  </div>
                )}
                {product.rrpPrice && (
                  <div className="flex justify-between py-3 border-b" style={{ borderColor: C.lavender }}>
                    <span style={{ color: C.textBrown }}>Retail Price</span>
                    <span style={{ color: C.darkBrown }}>€{product.rrpPrice}</span>
                  </div>
                )}
                <div className="flex justify-between py-3">
                  <span style={{ color: C.textBrown }}>Availability</span>
                  <span style={{ color: availableCount > 0 ? "#22c55e" : C.red }}>
                    {availableCount > 0 ? `${availableCount} available` : "Out of stock"}
                  </span>
                </div>
              </div>

              {/* What's Included */}
              <div className=" p-6 mb-8" style={{ backgroundColor: C.white }}>
                <h3 className="font-semibold mb-3" style={{ color: C.darkBrown }}>What's Included</h3>
                <ul className="space-y-2 text-sm" style={{ color: C.textBrown }}>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: C.red }}>✓</span>
                    Medical-grade Ozone cleaning between every rental
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: C.red }}>✓</span>
                    Full insurance coverage for wear and tear
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: C.red }}>✓</span>
                    Pre-paid return label included in your box
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: C.red }}>✓</span>
                    Part of your €70 quarterly subscription
                  </li>
                </ul>
              </div>

              {/* Add/Remove Button */}
              {isInCart ? (
                <button
                  onClick={handleRemoveFromCart}
                  disabled={removeFromCart.isPending}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4  text-base font-medium border-2 transition-colors hover:opacity-70 disabled:opacity-50"
                  style={{ borderColor: C.darkBrown, color: C.darkBrown }}
                >
                  {removeFromCart.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Minus className="w-4 h-4" />
                  Remove from Box
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={!canAddMore || outOfStock || addToCart.isPending}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4  text-base font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: outOfStock ? C.textBrown : C.red }}
                >
                  {addToCart.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {!addToCart.isPending && <Plus className="w-4 h-4" />}
                  {outOfStock
                    ? "Out of Stock"
                    : !canAddMore
                    ? "Box is Full (5/5)"
                    : "Add to Box"}
                </button>
              )}

              {isAuthenticated && cartCount !== undefined && (
                <p className="text-center text-sm mt-4" style={{ color: C.textBrown }}>
                  {cartCount} of 5 items selected
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
