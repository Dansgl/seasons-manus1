/**
 * ProductDetailV6 - Product detail page with V6 design system
 */

import { useState, useMemo, useCallback } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchProductBySlug, urlFor, type SanityProduct } from "@/lib/sanity";
import { getAvailability, getCart, getCartCount, addToCart, removeFromCart } from "@/lib/supabase-db";
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
import { Header, Footer, V6_COLORS as C, WaitlistModal, FavoriteButton } from "@/components/v6";
import { useWaitlistMode } from "@/hooks/useWaitlistMode";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

interface ImageItem {
  src: string;
  alt: string;
}

export default function ProductDetailV6() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const { isAuthenticated } = useAuth();
  const { isWaitlistMode } = useWaitlistMode();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);

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
  const { data: availability } = useQuery({
    queryKey: ["availability", slug],
    queryFn: () => getAvailability([slug]),
    enabled: !!slug,
  });
  const availableCount = availability?.[slug] ?? 0;

  // Cart state (disabled in waitlist mode)
  const { data: cartCount } = useQuery({
    queryKey: ["cartCount"],
    queryFn: getCartCount,
    enabled: isAuthenticated && !isWaitlistMode,
  });
  const { data: cartSlugs } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isAuthenticated && !isWaitlistMode,
  });

  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: (productSlug: string) => addToCart(productSlug),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Adăugat în coș!");
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        queryClient.invalidateQueries({ queryKey: ["cartCount"] });
      } else {
        toast.error(result.error || "Nu s-a putut adăuga articolul");
      }
    },
    onError: () => {
      toast.error("Nu s-a putut adăuga articolul");
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (productSlug: string) => removeFromCart(productSlug),
    onSuccess: () => {
      toast.success("Eliminat din coș");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartCount"] });
    },
  });

  const handleAddToCart = () => {
    // In waitlist mode, show the waitlist modal with toast
    if (isWaitlistMode) {
      toast("Înscrie-te pe lista de așteptare!", {
        description: "Lansăm în curând. Înregistrează-te pentru acces anticipat.",
      });
      setWaitlistModalOpen(true);
      return;
    }

    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    if (product) {
      addToCartMutation.mutate(product.slug);
    }
  };

  const handleRemoveFromCart = () => {
    if (product) {
      removeFromCartMutation.mutate(product.slug);
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
            Înapoi la catalog
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
                  Curățat profesional
                </span>
                <span
                  className="inline-flex items-center px-3 py-1  text-xs font-medium"
                  style={{ backgroundColor: C.lavender, color: C.darkBrown }}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Asigurare inclusă
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
                  <span style={{ color: C.textBrown }}>Categorie</span>
                  <span className="capitalize" style={{ color: C.darkBrown }}>{product.category}</span>
                </div>
                {product.ageRange && (
                  <div className="flex justify-between py-3 border-b" style={{ borderColor: C.lavender }}>
                    <span style={{ color: C.textBrown }}>Vârstă</span>
                    <span style={{ color: C.darkBrown }}>{product.ageRange}</span>
                  </div>
                )}
                {product.season && (
                  <div className="flex justify-between py-3 border-b" style={{ borderColor: C.lavender }}>
                    <span style={{ color: C.textBrown }}>Sezon</span>
                    <span className="capitalize" style={{ color: C.darkBrown }}>{product.season}</span>
                  </div>
                )}
                {product.rrpPrice && (
                  <div className="flex justify-between py-3 border-b" style={{ borderColor: C.lavender }}>
                    <span style={{ color: C.textBrown }}>Preț retail</span>
                    <span style={{ color: C.darkBrown }}>€{product.rrpPrice}</span>
                  </div>
                )}
                <div className="flex justify-between py-3">
                  <span style={{ color: C.textBrown }}>Disponibilitate</span>
                  <span style={{ color: availableCount > 0 ? "#22c55e" : C.red }}>
                    {availableCount > 0 ? `${availableCount} disponibile` : "Stoc epuizat"}
                  </span>
                </div>
              </div>

              {/* What's Included */}
              <div className=" p-6 mb-8" style={{ backgroundColor: C.white }}>
                <h3 className="font-semibold mb-3" style={{ color: C.darkBrown }}>Ce e inclus</h3>
                <ul className="space-y-2 text-sm" style={{ color: C.textBrown }}>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: C.red }}>✓</span>
                    Curățenie profesională între fiecare închiriere
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: C.red }}>✓</span>
                    Asigurare completă pentru uzură
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: C.red }}>✓</span>
                    Etichetă de retur inclusă în pachet
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: C.red }}>✓</span>
                    Parte din abonamentul de 350 lei/sezon
                  </li>
                </ul>
              </div>

              {/* Add/Remove Button & Favorite */}
              <div className="flex gap-3">
                {isInCart && !isWaitlistMode ? (
                  <button
                    onClick={handleRemoveFromCart}
                    disabled={removeFromCartMutation.isPending}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4  text-base font-medium border-2 transition-colors hover:opacity-70 disabled:opacity-50"
                    style={{ borderColor: C.darkBrown, color: C.darkBrown }}
                  >
                    {removeFromCartMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    <Minus className="w-4 h-4" />
                    Elimină din coș
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={(!isWaitlistMode && (!canAddMore || outOfStock)) || addToCartMutation.isPending}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4  text-base font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: isWaitlistMode ? C.red : (outOfStock ? C.textBrown : C.red) }}
                  >
                    {addToCartMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    {!addToCartMutation.isPending && !isWaitlistMode && <Plus className="w-4 h-4" />}
                    {isWaitlistMode
                      ? "Intră pe waitlist"
                      : outOfStock
                      ? "Stoc epuizat"
                      : !canAddMore
                      ? "Coș plin (5/5)"
                      : "Adaugă în coș"}
                  </button>
                )}
                <FavoriteButton
                  productSlug={slug}
                  size="lg"
                  className="w-16 h-full aspect-square"
                />
              </div>

              {isAuthenticated && !isWaitlistMode && cartCount !== undefined && (
                <p className="text-center text-sm mt-4" style={{ color: C.textBrown }}>
                  {cartCount} din 5 articole selectate
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Waitlist Modal */}
      <WaitlistModal
        open={waitlistModalOpen}
        onOpenChange={setWaitlistModalOpen}
        source="add_to_cart"
      />
    </div>
  );
}
