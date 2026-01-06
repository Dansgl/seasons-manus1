/**
 * HomeV6 - Based on Pitch Figma Template
 *
 * Design elements from template:
 * - Bold chunky logo (Arial Black)
 * - Rounded corners on cards
 * - Clean grid layouts
 * - Newsletter with red background
 *
 * Colors from template:
 * - Pitch red: #FF3C1F
 * - Dark brown: #5C1A11
 * - Lavender: #D4B8F0
 * - Beige: #F5F1ED
 * - Text brown: #B85C4A
 */

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useWaitlistMode } from "@/hooks/useWaitlistMode";
import {
  fetchProducts,
  fetchBrands,
  fetchFeaturedBrands,
  fetchFeaturedPosts,
  fetchSiteSettings,
  getProductImageUrl,
  getPostImageUrl,
  getSettingsImageUrl,
  urlFor,
  type SanityProduct,
  type SanityBrand,
  type SanityPost,
  type SanitySettings,
} from "@/lib/sanity";
import { User, ShoppingBag, Plus, Facebook, Instagram, ArrowRight, Sparkles, Shield, Truck, Leaf, Clock, Search } from "lucide-react";
import { FAQSection, Header as V6Header, WaitlistModal, V6_COLORS as C } from "@/components/v6";
import type { WaitlistSource } from "@/components/v6/WaitlistModal";
import { format } from "date-fns";

// Fallback images
const FALLBACK_IMAGES = {
  hero: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=600&fit=crop&auto=format",
  bento1: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=400&fit=crop",
  bento2: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=500&h=400&fit=crop",
};


// ============================================
// HEADER
// ============================================
function Header() {
  return (
    <header className="sticky top-0 bg-white z-50">
      {/* Announcement Bar */}
      <div
        className="text-white text-center py-2 px-4 text-sm"
        style={{ backgroundColor: C.red }}
      >
        Închiriază haine pentru bebeluși și copii mici începând cu 350 lei/capsulă - 5 articole premium livrate la tine acasă
      </div>

      {/* Main Navigation - aligned with content */}
      <nav className="border-b border-gray-200" style={{ backgroundColor: C.beige }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Navigation - aligned with headline */}
            <div className="flex items-center gap-6 md:gap-8 flex-shrink-0">
              <Link
                href="/catalog"
                className="hover:opacity-70 transition-colors text-sm"
                style={{ color: C.textBrown }}
              >
                Toate produsele
              </Link>
              <Link
                href="/brands"
                className="hover:opacity-70 transition-colors text-sm"
                style={{ color: C.textBrown }}
              >
                Branduri
              </Link>
              <Link
                href="/blog"
                className="hover:opacity-70 transition-colors text-sm"
                style={{ color: C.textBrown }}
              >
                Blog
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <button className="hover:opacity-70 transition-colors" style={{ color: C.textBrown }}>
                <Search className="w-5 h-5" />
              </button>
              <Link href="/login" className="hover:opacity-70 transition-colors" style={{ color: C.textBrown }}>
                <User className="w-5 h-5" />
              </Link>
              <Link href="/catalog" className="hover:opacity-70 transition-colors" style={{ color: C.textBrown }}>
                <ShoppingBag className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

// ============================================
// HERO
// ============================================
interface HeroSectionProps {
  heroImage?: string;
  isWaitlistMode?: boolean;
  onOpenWaitlist?: () => void;
}

function HeroSection({ heroImage, isWaitlistMode, onOpenWaitlist }: HeroSectionProps) {
  return (
    <section className="py-12 px-12 md:py-16 md:px-16" style={{ backgroundColor: C.beige }}>
      <div className="max-w-7xl mx-auto px-0">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Side - Title and Subhead */}
          <div>
            <h1
              className="text-5xl md:text-7xl tracking-tighter"
              style={{ fontFamily: "Arial Black, sans-serif", fontWeight: 900, color: C.red }}
            >
              SEASONS
            </h1>
            <h2 className="text-xl md:text-2xl mt-6 leading-tight" style={{ color: C.darkBrown }}>
              De ce să plătești prețul întreg pentru haine purtate 6 săptămâni?
            </h2>
            <p className="text-base mt-4 leading-relaxed" style={{ color: C.textBrown }}>
              Copiii cresc peste noapte. Teancul de haine pe care trebuie să le dai mai departe parcă și mai repede. Azi îi cumperi primul body cu "I'm new here", peste două luni nu se mai închid capsele între picioare, peste încă o lună îl retragi în fundul dulapului. Și tot așa în primii ani, când copiii mici trec prin 7 mărimi la haine în 24 de luni.
            </p>

            {/* CTA Button */}
            <div className="mt-8">
              {isWaitlistMode ? (
                <button
                  onClick={onOpenWaitlist}
                  className="inline-flex items-center px-8 py-4 text-base font-medium text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: C.red }}
                >
                  Intră pe waitlist
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <Link
                  href="/catalog"
                  className="inline-flex items-center px-8 py-4 text-base font-medium text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: C.red }}
                >
                  Explorează selecția
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              )}
            </div>
          </div>

          {/* Right Side - Smaller Image aligned to right edge */}
          <div className="flex justify-end">
            <div className="w-full max-w-[280px] md:max-w-[320px] aspect-square overflow-hidden">
              <img
                src={heroImage || FALLBACK_IMAGES.hero}
                alt="Baby in designer clothing"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// BENEFITS BAR (scrolling)
// ============================================
interface BenefitsBarProps {
  benefits?: Array<{ title: string; description?: string; icon?: string }>;
}

function BenefitsBar({ benefits: sanityBenefits }: BenefitsBarProps) {
  // Use Sanity benefits if available, otherwise fallback
  const benefits = sanityBenefits?.length
    ? sanityBenefits.map(b => b.title)
    : [
        "No waste, no fuss",
        "Branduri premium la o fracțiune din preț",
        "Abonament sezonier",
        "Asigurare pete",
        "Curățenie profesională între folosiri",
      ];

  // Create items with sparkle separators
  const items = benefits.flatMap((label, i) => [
    { type: 'sparkle', key: `sparkle-${i}` },
    { type: 'text', label, key: `text-${i}` }
  ]);

  return (
    <section className="py-4 overflow-hidden" style={{ backgroundColor: C.darkBrown }}>
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: 'marquee 25s linear infinite',
        }}
      >
        {/* Triple duplicate for seamless loop */}
        {[0, 1, 2].map(setIndex => (
          <div key={setIndex} className="flex items-center flex-shrink-0">
            {items.map((item) => (
              item.type === 'sparkle' ? (
                <Sparkles
                  key={`${setIndex}-${item.key}`}
                  className="w-4 h-4 mx-6 flex-shrink-0"
                  style={{ color: C.lavender }}
                />
              ) : (
                <span
                  key={`${setIndex}-${item.key}`}
                  className="text-sm font-medium uppercase tracking-wider text-white flex-shrink-0"
                >
                  {item.label}
                </span>
              )
            ))}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </section>
  );
}

// ============================================
// PHILOSOPHY (2-column grid)
// ============================================
interface PhilosophySectionProps {
  bentoImage1?: string;
  title?: string;
  content?: string;
}

function PhilosophySection({ bentoImage1, title, content }: PhilosophySectionProps) {
  const defaultContent = `Haine de designer pe care nu prea ai da banii pentru doar câteva luni. Piese vintage descoperite la second. Mai puțin timp petrecut vânând măsura 86 prin grupuri de Facebook sau lână merinos fără defecte pe Vinted.

Toate astea pot fi ușurate de o garderobă comună, cu închiriere sezonieră. Noi curatoriem branduri premium, vânăm vintage, ne ocupăm de curățenie profesională și de toată logistica.

Tu ai mai mult timp de smotocit.`;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {/* Left Side - Lavender Background with Text */}
      <div
        className="p-12 md:p-16 flex items-center justify-center min-h-[350px] md:min-h-[400px]"
        style={{ backgroundColor: C.lavender }}
      >
        <div className="max-w-md">
          <h2 className="text-3xl md:text-4xl mb-4" style={{ color: C.darkBrown }}>
            {title || "Viziunea noastră"}
          </h2>
          <p className="text-base whitespace-pre-line" style={{ color: C.darkBrown }}>
            {content || defaultContent}
          </p>
        </div>
      </div>

      {/* Right Side - Full Bleed Image */}
      <div className="min-h-[350px] md:min-h-[400px] relative">
        <img
          src={bentoImage1 || FALLBACK_IMAGES.bento1}
          alt="Baby fashion"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </section>
  );
}

// ============================================
// SKINCARE STANDARD (adapted for Seasons)
// ============================================
interface CleaningStandardProps {
  bentoImage2?: string;
  title?: string;
  content?: string;
}

function CleaningStandard({ bentoImage2, title, content }: CleaningStandardProps) {
  const defaultContent = `Fără panică. Copiii se pătează. Agață haine. Se joacă în noroi. E treaba lor.

Ce e inclus în abonament: Asigurare pentru pete și mici defecte. Adică copilul tău se poate juca liniștit fără să stai cu inima-n dinți.

Ce facem noi: Între fiecare ciclu de închiriere: curățenie profesională și reparații minore. Hainele ajung la tine curate și gata de purtat.`;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {/* Left Side - Full Bleed Image */}
      <div className="min-h-[350px] md:min-h-[400px] relative">
        <img
          src={bentoImage2 || FALLBACK_IMAGES.bento2}
          alt="Clean clothing"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Dark Brown Background with Text */}
      <div
        className="p-12 md:p-16 flex items-center justify-center min-h-[350px] md:min-h-[400px]"
        style={{ backgroundColor: C.darkBrown }}
      >
        <div className="max-w-md text-left">
          <h2 className="text-3xl md:text-4xl mb-6 text-white">
            {title || "Pete, rupturi și alte realități"}
          </h2>
          <p className="text-base leading-relaxed text-white/90 whitespace-pre-line">
            {content || defaultContent}
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================
// MOST LOVED (featured products, 6x2 grid, no gaps, text overlay)
// ============================================
interface MostLovedProps {
  sectionTitle?: string;
}

function MostLoved({ sectionTitle }: MostLovedProps) {
  const { data: allProducts, isLoading } = useQuery<SanityProduct[]>({
    queryKey: ["sanity", "products"],
    queryFn: fetchProducts,
  });

  // Get featured products (up to 8 for 4x2 grid)
  const display = useMemo(() => {
    if (!allProducts) return [];
    // Return first 8 products for the grid
    return allProducts.slice(0, 8);
  }, [allProducts]);

  // Background colors for grid - pattern ensures no adjacent cells (horizontal/vertical) share same color
  // For 4-column grid: alternating pattern that works for both rows
  const gridColors = [
    C.red, C.green, C.lavender, C.navy,      // Row 1
    C.lavender, C.navy, C.red, C.green,      // Row 2
  ];

  return (
    <section style={{ backgroundColor: C.beige }}>
      {/* Header */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h2 className="text-3xl md:text-4xl" style={{ color: C.darkBrown }}>
            {sectionTitle || "Cele mai populare"}
          </h2>
          <Link
            href="/catalog"
            className="flex items-center gap-1 text-sm hover:opacity-70"
            style={{ color: C.textBrown }}
          >
            Vezi tot <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Full-width grid with no gaps - 4x2 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {isLoading
          ? [...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square animate-pulse" style={{ backgroundColor: gridColors[i % gridColors.length] }} />
            ))
          : display.map((product, index) => {
              const img = getProductImageUrl(product, { width: 500, height: 500 });
              const bgColor = gridColors[index % gridColors.length];

              return (
                <Link key={product._id} href={`/product/${product.slug}`}>
                  <article
                    className="group aspect-square relative p-6"
                    style={{ backgroundColor: bgColor }}
                  >
                    {/* Fixed-size image frame centered */}
                    <div className="absolute inset-6 bottom-16 flex items-center justify-center">
                      <div className="w-full h-full max-w-[75%] max-h-[75%] overflow-hidden">
                        {img ? (
                          <img
                            src={img}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: C.white }}>
                            <ShoppingBag className="w-12 h-12" style={{ color: C.darkBrown, opacity: 0.3 }} />
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Text at fixed position - left aligned, top of text area */}
                    <div className="absolute bottom-4 left-6 right-6 h-10 text-left">
                      <h3 className="text-sm text-white font-medium line-clamp-2 leading-tight">
                        {product.name}
                      </h3>
                    </div>
                  </article>
                </Link>
              );
            })}
      </div>
    </section>
  );
}

// ============================================
// COLLECTIONS (3x1 grid with brand photos)
// ============================================
interface CollectionsProps {
  sectionTitle?: string;
}

function Collections({ sectionTitle }: CollectionsProps) {
  // Try featured brands first, fall back to all brands
  const { data: featuredBrands } = useQuery<SanityBrand[]>({
    queryKey: ["sanity", "featuredBrands"],
    queryFn: fetchFeaturedBrands,
  });

  const { data: allBrands } = useQuery<SanityBrand[]>({
    queryKey: ["sanity", "brands"],
    queryFn: fetchBrands,
  });

  // Use featured brands if available, otherwise first 3 from all brands
  const displayBrands = (featuredBrands?.length ? featuredBrands : allBrands?.slice(0, 3)) || [];

  // Alternating background colors - green, lavender (for Studio Koter), red
  const bgColors = [C.green, C.lavender, C.red];
  const textColors = [C.white, C.darkBrown, C.white];

  return (
    <section>
      {/* Header - separator like Most Loved */}
      <div style={{ backgroundColor: C.beige }}>
        <div className="px-6 py-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h2 className="text-3xl md:text-4xl" style={{ color: C.darkBrown }}>
              {sectionTitle || "Our brands"}
            </h2>
            <Link
              href="/brands"
              className="flex items-center gap-1 text-sm hover:opacity-70"
              style={{ color: C.textBrown }}
            >
              Vezi tot <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Brand cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        {displayBrands.map((brand, index) => {
          const bgColor = bgColors[index % bgColors.length];
          const textColor = textColors[index % textColors.length];
          // Prefer brandImage over logo for homepage cards
          const imageUrl = brand.brandImage
            ? urlFor(brand.brandImage).width(800).height(800).auto("format").url()
            : brand.logo
            ? urlFor(brand.logo).width(800).height(800).auto("format").url()
            : null;

          return (
            <Link
              key={brand._id}
              href={`/catalog?brand=${encodeURIComponent(brand.name)}`}
              className="block"
            >
              <div
                className="p-8 md:p-12 flex flex-col items-center justify-center min-h-[400px] hover:opacity-90 transition-opacity"
                style={{ backgroundColor: bgColor }}
              >
                {/* Brand Image Frame - zoom to fit, no white edges */}
                <div className="relative mb-6 w-48 h-48 md:w-56 md:h-56 overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={brand.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: C.beige }}
                    >
                      <span className="text-5xl font-bold" style={{ color: C.darkBrown }}>
                        {brand.name?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Brand Name */}
                <h2
                  className="text-xl md:text-2xl text-center"
                  style={{ color: textColor }}
                >
                  {brand.name} →
                </h2>
              </div>
            </Link>
          );
        })}

        {/* Fill remaining slots if less than 3 brands */}
        {displayBrands.length < 3 && (
          <Link href="/brands" className="block">
            <div
              className="p-8 md:p-12 flex flex-col items-center justify-center min-h-[400px] hover:opacity-90 transition-opacity"
              style={{ backgroundColor: bgColors[displayBrands.length % bgColors.length] }}
            >
              <div className="relative mb-6 w-48 h-48 md:w-56 md:h-56">
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: C.beige }}
                >
                  <span className="text-5xl font-bold" style={{ color: C.darkBrown }}>+</span>
                </div>
              </div>
              <h2
                className="text-xl md:text-2xl text-center"
                style={{ color: textColors[displayBrands.length % textColors.length] }}
              >
                View All Brands →
              </h2>
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}

// ============================================
// NEWSLETTER
// ============================================
interface NewsletterProps {
  title?: string;
  content?: string;
}

function Newsletter({ title, content }: NewsletterProps) {
  return (
    <section className="py-16 px-6" style={{ backgroundColor: C.navy }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-white text-3xl md:text-4xl mb-4">
            {title || "Intră pe waitlist"}
          </h2>
          <p className="text-white/90 text-base">
            {content || "Fii primul care află când lansăm. Primește acces exclusiv la colecția noastră de haine pentru bebeluși."}
          </p>
        </div>

        <form className="flex flex-col sm:flex-row gap-4 max-w-xl">
          <input
            type="email"
            placeholder="Adresa ta de email"
            className="flex-1 px-6 py-3 bg-white/10 border-2 border-white text-white placeholder:text-white/60 focus:outline-none focus:bg-white/20"
          />
          <button
            type="submit"
            className="px-8 py-3 text-white hover:opacity-90 transition-colors whitespace-nowrap"
            style={{ backgroundColor: C.red }}
          >
            Înscrie-te
          </button>
        </form>
      </div>
    </section>
  );
}

// ============================================
// BLOG PREVIEW
// ============================================
interface BlogPreviewProps {
  sectionTitle?: string;
}

function BlogPreview({ sectionTitle }: BlogPreviewProps) {
  const { data: posts } = useQuery<SanityPost[]>({
    queryKey: ["sanity", "featuredPosts"],
    queryFn: fetchFeaturedPosts,
  });
  const display = posts?.slice(0, 3) || [];

  // Different accent colors for each blog card - expanded palette
  const accentColors = [C.red, C.green, C.blue];

  if (display.length === 0) return null;

  return (
    <section style={{ backgroundColor: C.lavender }}>
      {/* Header */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h2 className="text-3xl md:text-4xl" style={{ color: C.darkBrown }}>
            {sectionTitle || "De pe blog"}
          </h2>
          <Link
            href="/blog"
            className="flex items-center gap-1 text-sm hover:opacity-70"
            style={{ color: C.darkBrown }}
          >
            Vezi tot <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Full-width 3-column grid with no gaps */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        {display.map((post, index) => {
          const img = getPostImageUrl(post, { width: 600, height: 450 });
          const accentColor = accentColors[index % accentColors.length];

          return (
            <Link key={post._id} href={`/blog/${post.slug}`}>
              <article className="group relative">
                {/* Full bleed image */}
                <div className="aspect-[4/3] overflow-hidden">
                  {img ? (
                    <img
                      src={img}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full" style={{ backgroundColor: C.beige }} />
                  )}
                </div>
                {/* Text overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="text-base text-white line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                  {/* Colored stripe under title */}
                  <div
                    className="h-1 w-12"
                    style={{ backgroundColor: accentColor }}
                  />
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ============================================
// FOOTER
// ============================================
function Footer() {
  return (
    <footer className="text-white" style={{ backgroundColor: C.red }}>
      {/* Navigation Links */}
      <div className="border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Rent Column */}
            <div>
              <h3 className="mb-4 font-semibold">Închiriază</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>
                  <Link href="/catalog" className="hover:text-white transition-colors">
                    Toate produsele
                  </Link>
                </li>
                <li>
                  <Link href="/brands" className="hover:text-white transition-colors">
                    Branduri
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white transition-colors">
                    Cum funcționează
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="mb-4 font-semibold">Despre noi</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    Povestea Seasons
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h3 className="mb-4 font-semibold">Asistență</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    Întrebări frecvente
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-white transition-colors">
                    Retururi
                  </Link>
                </li>
                <li>
                  <Link href="/sizing" className="hover:text-white transition-colors">
                    Ghid mărimi
                  </Link>
                </li>
              </ul>
            </div>

            {/* Empty Column for spacing */}
            <div></div>
          </div>
        </div>
      </div>

      {/* Logo and Social */}
      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Logo */}
            <div>
              <h2
                className="text-white text-6xl md:text-8xl tracking-tighter"
                style={{ fontFamily: "Arial Black, sans-serif", fontWeight: 900 }}
              >
                SEASONS
              </h2>
              <p className="text-white/60 text-xs mt-2">© 2025 Seasons. Închiriere haine premium pentru bebeluși.</p>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a href="#" className="text-white hover:text-white/80 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-white/80 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// MAIN
// ============================================
export default function HomeV6() {
  const { data: settings } = useQuery<SanitySettings>({
    queryKey: ["sanity", "siteSettings"],
    queryFn: fetchSiteSettings,
  });

  const { isWaitlistMode } = useWaitlistMode();
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);

  const heroImage = getSettingsImageUrl(settings?.heroImage, { width: 1200, height: 1200 });
  const bentoImage1 = getSettingsImageUrl(settings?.bentoImage1, { width: 1200, height: 1000 });
  const bentoImage2 = getSettingsImageUrl(settings?.bentoImage2, { width: 1200, height: 1000 });

  return (
    <div className="min-h-screen bg-white">
      <V6Header />
      <main>
        <HeroSection
          heroImage={heroImage || undefined}
          isWaitlistMode={isWaitlistMode}
          onOpenWaitlist={() => setWaitlistModalOpen(true)}
        />
        <BenefitsBar benefits={settings?.benefits} />
        <PhilosophySection
          bentoImage1={bentoImage1 || undefined}
          title={settings?.philosophySection?.title}
          content={settings?.philosophySection?.content}
        />
        <CleaningStandard
          bentoImage2={bentoImage2 || undefined}
          title={settings?.qualitySection?.title}
          content={settings?.qualitySection?.content}
        />
        <MostLoved sectionTitle={settings?.sectionTitles?.mostLoved} />
        <Collections sectionTitle={settings?.sectionTitles?.ourBrands} />
        <Newsletter
          title={settings?.newsletterSection?.title}
          content={settings?.newsletterSection?.content}
        />
        <BlogPreview sectionTitle={settings?.sectionTitles?.fromTheBlog} />
        <FAQSection />
      </main>
      <Footer />

      {/* Waitlist Modal for hero CTA */}
      <WaitlistModal
        open={waitlistModalOpen}
        onOpenChange={setWaitlistModalOpen}
        source="hero"
      />
    </div>
  );
}
