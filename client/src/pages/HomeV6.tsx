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
import { User, ShoppingBag, Plus, Facebook, Instagram, ArrowRight, Sparkles, Shield, Truck, Leaf, Clock } from "lucide-react";
import { FAQSection, Header as V6Header, WaitlistModal } from "@/components/v6";
import type { WaitlistSource } from "@/components/v6/WaitlistModal";
import { format } from "date-fns";

// Fallback images
const FALLBACK_IMAGES = {
  hero: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=600&fit=crop&auto=format",
  bento1: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=400&fit=crop",
  bento2: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=500&h=400&fit=crop",
};

// Colors from Pitch template + extended palette
const C = {
  red: "#FF3C1F",
  darkBrown: "#5C1A11",
  lavender: "#D4B8F0",
  beige: "#F5F1ED",
  textBrown: "#B85C4A",
  white: "#ffffff",
  // Extended palette for section separation
  green: "#157145",
  blue: "#3685B5",
  navy: "#141B41",
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
        Premium baby clothing rental — €70/quarter for 5 designer pieces
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
                Rent
              </Link>
              <Link
                href="/brands"
                className="hover:opacity-70 transition-colors text-sm"
                style={{ color: C.textBrown }}
              >
                Brands
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
    <section className="py-12 px-6 md:py-16" style={{ backgroundColor: C.beige }}>
      <div className="max-w-7xl mx-auto">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Side - Title and Subhead */}
          <div>
            <h1
              className="text-[60px] md:text-[100px] leading-[0.9] tracking-tighter"
              style={{ fontFamily: "Arial Black, sans-serif", fontWeight: 900, color: C.red }}
            >
              SEASONS
            </h1>
            <p className="text-base mt-2" style={{ color: C.textBrown }}>
              Baby fashion, simplified.
            </p>
            {/* Caption - left aligned under title */}
            <p className="text-sm mt-8" style={{ color: C.textBrown }}>
              Only premium, caring brands,
              <br />
              and nothing less.
            </p>

            {/* CTA Button */}
            <div className="mt-8">
              {isWaitlistMode ? (
                <button
                  onClick={onOpenWaitlist}
                  className="inline-flex items-center px-8 py-4 text-base font-medium text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: C.red }}
                >
                  Join the Waitlist
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <Link
                  href="/catalog"
                  className="inline-flex items-center px-8 py-4 text-base font-medium text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: C.red }}
                >
                  Browse Collection
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
function BenefitsBar() {
  const benefits = [
    "Ozone Cleaned",
    "Insurance Included",
    "Free Shipping",
    "Sustainable",
    "Flexible Swaps",
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
function PhilosophySection({ bentoImage1 }: { bentoImage1?: string }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {/* Left Side - Lavender Background with Text */}
      <div
        className="p-12 md:p-16 flex items-center justify-center min-h-[350px] md:min-h-[400px]"
        style={{ backgroundColor: C.lavender }}
      >
        <div className="max-w-md">
          <h2 className="text-3xl md:text-4xl mb-4" style={{ color: C.darkBrown }}>
            Our philosophy
          </h2>
          <p className="text-base" style={{ color: C.darkBrown }}>
            Premium European fashion for your little one. Curated with care, cleaned with
            medical-grade sanitization. Only the best for your baby.
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
function CleaningStandard({ bentoImage2 }: { bentoImage2?: string }) {
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
        <div className="max-w-md text-center">
          <h2 className="text-3xl md:text-4xl mb-6 text-white">The cleaning standard</h2>
          <p className="text-base leading-relaxed text-white/90">
            Ozone-cleaned, hypoallergenic, and baby-safe. Every piece is professionally sanitized
            to medical-grade standards. Safe for even the most sensitive skin.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================
// MOST LOVED (one product per brand, 3x2 grid, no gaps, text overlay)
// ============================================
function MostLoved() {
  const { data: allProducts, isLoading } = useQuery<SanityProduct[]>({
    queryKey: ["sanity", "products"],
    queryFn: fetchProducts,
  });

  // Get one unique product per brand (up to 6)
  const display = useMemo(() => {
    if (!allProducts) return [];
    const seenBrands = new Set<string>();
    const uniqueProducts: SanityProduct[] = [];

    for (const product of allProducts) {
      const brandName = product.brand?.name;
      if (brandName && !seenBrands.has(brandName)) {
        seenBrands.add(brandName);
        uniqueProducts.push(product);
        if (uniqueProducts.length >= 6) break;
      }
    }

    // If we don't have 6 unique brands, fill with remaining products
    if (uniqueProducts.length < 6) {
      for (const product of allProducts) {
        if (!uniqueProducts.find(p => p._id === product._id)) {
          uniqueProducts.push(product);
          if (uniqueProducts.length >= 6) break;
        }
      }
    }

    return uniqueProducts;
  }, [allProducts]);

  // Accent colors for each product card - expanded palette
  const accentColors = [C.red, C.green, C.blue, C.navy, C.lavender, C.darkBrown];

  return (
    <section style={{ backgroundColor: C.beige }}>
      {/* Header */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h2 className="text-3xl md:text-4xl" style={{ color: C.darkBrown }}>
            Most loved
          </h2>
          <Link
            href="/catalog"
            className="flex items-center gap-1 text-sm hover:opacity-70"
            style={{ color: C.textBrown }}
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Full-width grid with no gaps */}
      <div className="grid grid-cols-2 md:grid-cols-3">
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square animate-pulse" style={{ backgroundColor: C.lavender }} />
            ))
          : display.map((product, index) => {
              const img = getProductImageUrl(product, { width: 500, height: 500 });
              const accentColor = accentColors[index % accentColors.length];

              return (
                <Link key={product._id} href={`/product/${product.slug}`}>
                  <article className="group relative">
                    {/* Full bleed image */}
                    <div className="aspect-square overflow-hidden">
                      {img ? (
                        <img
                          src={img}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: C.lavender }}>
                          <ShoppingBag className="w-12 h-12" style={{ color: C.darkBrown, opacity: 0.3 }} />
                        </div>
                      )}
                    </div>
                    {/* Text overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-xs text-white/80 mb-1">
                        {product.brand?.name}
                      </p>
                      <h3 className="text-sm text-white line-clamp-1 mb-2">
                        {product.name}
                      </h3>
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
    </section>
  );
}

// ============================================
// COLLECTIONS (3x1 grid with brand photos)
// ============================================
function Collections() {
  const { data: brands } = useQuery<SanityBrand[]>({
    queryKey: ["sanity", "brands"],
    queryFn: fetchBrands,
  });

  // Get first 3 brands
  const displayBrands = brands?.slice(0, 3) || [];

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
              Our brands
            </h2>
            <Link
              href="/brands"
              className="flex items-center gap-1 text-sm hover:opacity-70"
              style={{ color: C.textBrown }}
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Brand cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        {displayBrands.map((brand, index) => {
          const bgColor = bgColors[index % bgColors.length];
          const textColor = textColors[index % textColors.length];
          const logoUrl = brand.logo ? urlFor(brand.logo).width(400).height(400).auto("format").url() : null;

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
                  {logoUrl ? (
                    <img
                      src={logoUrl}
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
function Newsletter() {
  return (
    <section className="py-16 px-6" style={{ backgroundColor: C.navy }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-white text-3xl md:text-4xl mb-4">Join the waitlist</h2>
          <p className="text-white/90 text-base">
            Be the first to know when we launch. Get exclusive access to our curated baby fashion
            collection.
          </p>
        </div>

        <form className="flex flex-col sm:flex-row gap-4 max-w-xl">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-6 py-3 bg-white/10 border-2 border-white text-white placeholder:text-white/60 focus:outline-none focus:bg-white/20"
          />
          <button
            type="submit"
            className="px-8 py-3 text-white hover:opacity-90 transition-colors whitespace-nowrap"
            style={{ backgroundColor: C.red }}
          >
            Sign up
          </button>
        </form>
      </div>
    </section>
  );
}

// ============================================
// BLOG PREVIEW
// ============================================
function BlogPreview() {
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
            From the blog
          </h2>
          <Link
            href="/blog"
            className="flex items-center gap-1 text-sm hover:opacity-70"
            style={{ color: C.darkBrown }}
          >
            View all <ArrowRight className="w-4 h-4" />
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
              <h3 className="mb-4 font-semibold">Rent</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>
                  <Link href="/catalog" className="hover:text-white transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/brands" className="hover:text-white transition-colors">
                    Brands
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
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
              <h3 className="mb-4 font-semibold">Support</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-white transition-colors">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/sizing" className="hover:text-white transition-colors">
                    Sizing Guide
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
              <p className="text-white/60 text-xs mt-2">© 2025 Seasons. Premium baby rental.</p>
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

  const heroImage = getSettingsImageUrl(settings?.heroImage, { width: 600, height: 600 });
  const bentoImage1 = getSettingsImageUrl(settings?.bentoImage1, { width: 500, height: 400 });
  const bentoImage2 = getSettingsImageUrl(settings?.bentoImage2, { width: 500, height: 400 });

  return (
    <div className="min-h-screen bg-white">
      <V6Header />
      <main>
        <HeroSection
          heroImage={heroImage || undefined}
          isWaitlistMode={isWaitlistMode}
          onOpenWaitlist={() => setWaitlistModalOpen(true)}
        />
        <BenefitsBar />
        <PhilosophySection bentoImage1={bentoImage1 || undefined} />
        <CleaningStandard bentoImage2={bentoImage2 || undefined} />
        <MostLoved />
        <Collections />
        <Newsletter />
        <BlogPreview />
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
