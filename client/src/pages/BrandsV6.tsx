/**
 * BrandsV6 - Brands page with V6 design system
 * Styled to match homepage: no gaps, full-bleed images, text overlays
 */

import { useQuery } from "@tanstack/react-query";
import { fetchBrands, urlFor, type SanityBrand } from "@/lib/sanity";
import { Link } from "wouter";
import { Loader2, Building2, Leaf, Heart, Sparkles } from "lucide-react";
import { Header, Footer, V6_COLORS as C } from "@/components/v6";

export default function BrandsV6() {
  const { data: brands, isLoading } = useQuery<SanityBrand[]>({
    queryKey: ["sanity", "brands"],
    queryFn: fetchBrands,
  });

  // Accent colors matching homepage design system - expanded palette
  const accentColors = [C.red, C.green, C.blue, C.navy, C.lavender, C.darkBrown];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section style={{ backgroundColor: C.beige }}>
          <div className="px-6 py-8 md:py-12">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl md:text-5xl mb-4" style={{ color: C.darkBrown }}>
                Our Brands
              </h1>
              <p className="max-w-2xl" style={{ color: C.textBrown }}>
                We partner with the finest European baby clothing brands, each selected for their commitment
                to quality, sustainability, and timeless design.
              </p>
            </div>
          </div>
        </section>

        {/* Brands Grid - Full width, no gaps */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20" style={{ backgroundColor: C.beige }}>
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.textBrown }} />
          </div>
        ) : brands?.length === 0 ? (
          <div className="text-center py-20" style={{ backgroundColor: C.beige }}>
            <Building2 className="w-16 h-16 mx-auto mb-4" style={{ color: C.lavender }} />
            <h2 className="text-xl font-medium mb-2" style={{ color: C.darkBrown }}>No brands yet</h2>
            <p style={{ color: C.textBrown }}>Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3">
            {brands?.map((brand, index) => {
              const logoUrl = brand.logo
                ? urlFor(brand.logo).width(600).height(600).auto("format").url()
                : null;
              const accentColor = accentColors[index % accentColors.length];

              return (
                <Link key={brand._id} href={`/catalog?brand=${encodeURIComponent(brand.name)}`}>
                  <article className="group relative">
                    {/* Full bleed image */}
                    <div className="aspect-square overflow-hidden">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={brand.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: C.lavender }}
                        >
                          <span
                            className="text-6xl md:text-8xl font-bold"
                            style={{ color: C.darkBrown, opacity: 0.3 }}
                          >
                            {brand.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Text overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                      <h2 className="text-lg md:text-xl text-white mb-1">
                        {brand.name}
                      </h2>
                      {brand.description && (
                        <p className="text-xs text-white/80 line-clamp-2 mb-2">
                          {brand.description}
                        </p>
                      )}
                      {/* Colored stripe */}
                      <div
                        className="h-1 w-10"
                        style={{ backgroundColor: accentColor }}
                      />
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}

        {/* Separator header before story section */}
        <div style={{ backgroundColor: C.beige }}>
          <div className="px-6 py-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl" style={{ color: C.darkBrown }}>
                Why we choose these brands
              </h2>
            </div>
          </div>
        </div>

        {/* Brand Story Section - Full width alternating layout (green, navy, lavender to not clash with red footer) */}
        <section className="grid grid-cols-1 md:grid-cols-3">
          <div
            className="p-8 md:p-12 flex flex-col items-center justify-center min-h-[300px]"
            style={{ backgroundColor: C.green }}
          >
            <Leaf className="w-10 h-10 mb-4 text-white" />
            <h3 className="text-lg font-medium mb-2 text-center text-white">
              Quality Materials
            </h3>
            <p className="text-sm text-center text-white/80">
              Organic cottons, natural fibers, and fabrics gentle on sensitive skin.
            </p>
          </div>
          <div
            className="p-8 md:p-12 flex flex-col items-center justify-center min-h-[300px]"
            style={{ backgroundColor: C.navy }}
          >
            <Heart className="w-10 h-10 mb-4 text-white" />
            <h3 className="text-lg font-medium mb-2 text-center text-white">
              Ethical Production
            </h3>
            <p className="text-sm text-center text-white/80">
              Fair wages, safe working conditions, and transparent supply chains.
            </p>
          </div>
          <div
            className="p-8 md:p-12 flex flex-col items-center justify-center min-h-[300px]"
            style={{ backgroundColor: C.lavender }}
          >
            <Sparkles className="w-10 h-10 mb-4" style={{ color: C.darkBrown }} />
            <h3 className="text-lg font-medium mb-2 text-center" style={{ color: C.darkBrown }}>
              Timeless Design
            </h3>
            <p className="text-sm text-center" style={{ color: C.darkBrown }}>
              Classic aesthetics that transcend trends and pass beautifully between children.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
