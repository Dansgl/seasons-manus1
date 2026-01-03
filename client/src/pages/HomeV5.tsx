/**
 * HomeV5 - Final refined version
 *
 * Final improvements:
 * - More prominent abstract shapes
 * - Added warm yellow accent for extra "jolly" feel
 * - Bolder color blocking
 * - More playful typography
 * - Better visual rhythm
 * - Chunky, prominent visual elements
 *
 * Colors:
 * - Vermilion: #fe4216
 * - Lavender: #e2c8f3
 * - Dark burgundy: #531103
 * - Text: #761e0b
 * - Cream: #faf8f5
 * - Yellow accent: #f9dc5c (playful/jolly addition)
 */

import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { fetchFeaturedProducts, fetchBrands, fetchFeaturedPosts, fetchSiteSettings, getProductImageUrl, getPostImageUrl, getSettingsImageUrl, type SanityProduct, type SanityBrand, type SanityPost, type SanitySettings } from "@/lib/sanity";
import { ArrowRight, ShoppingBag, Sparkles, Shield, Truck, Leaf, Clock } from "lucide-react";
import { format } from "date-fns";
import Navigation from "@/components/Navigation";

// Fallback images when Sanity images aren't set
const FALLBACK_IMAGES = {
  hero: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=450&h=600&fit=crop&auto=format",
  bento1: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=400&fit=crop",
  bento2: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=500&h=400&fit=crop",
};

const C = {
  vermilion: "#fe4216",
  lavender: "#e2c8f3",
  burgundy: "#531103",
  text: "#761e0b",
  cream: "#faf8f5",
  white: "#ffffff",
  yellow: "#f9dc5c", // Playful accent
};

// ============================================
// HERO - Bold with large abstract shapes
// ============================================
function HeroSection({ heroImage }: { heroImage?: string }) {
  return (
    <section className="relative overflow-hidden min-h-[85vh]" style={{ backgroundColor: C.cream }}>
      {/* Large decorative shapes */}
      <div
        className="absolute top-0 right-0 w-2/3 h-full -z-0"
        style={{ backgroundColor: C.lavender }}
      />
      <div
        className="absolute bottom-0 left-[10%] w-32 h-32 md:w-48 md:h-48"
        style={{ backgroundColor: C.yellow, opacity: 0.6 }}
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-6 items-center py-12 md:py-16 min-h-[80vh]">
          {/* Left - Text */}
          <div>
            <div
              className="inline-block px-3 py-1 mb-4 text-[10px] font-bold uppercase tracking-widest"
              style={{ backgroundColor: C.vermilion, color: C.white }}
            >
              Premium Baby Rental
            </div>
            <h1
              className="leading-[0.85] mb-4"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
                fontWeight: 400,
                color: C.burgundy,
              }}
            >
              Dress<br />them<br />
              <span className="italic" style={{ color: C.vermilion }}>beautifully</span>
            </h1>
            <p className="text-sm max-w-xs leading-relaxed mb-6" style={{ color: C.text }}>
              Europe's finest baby brands. €70/quarter for 5 designer pieces.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/catalog">
                <button
                  className="px-6 py-3 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105"
                  style={{ backgroundColor: C.vermilion, color: C.white }}
                >
                  Start Your Box →
                </button>
              </Link>
            </div>
          </div>

          {/* Right - Image with overlapping shapes */}
          <div className="relative">
            {/* Yellow shape */}
            <div
              className="absolute -top-4 -left-4 w-24 h-24 md:w-32 md:h-32 z-0"
              style={{ backgroundColor: C.yellow }}
            />
            {/* Main image */}
            <div className="relative z-10 aspect-[3/4] max-w-sm ml-auto overflow-hidden">
              <img
                src={heroImage || FALLBACK_IMAGES.hero}
                alt="Baby in designer clothing"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Burgundy badge overlapping image */}
            <div
              className="absolute bottom-8 -left-2 md:left-4 p-4 z-20"
              style={{ backgroundColor: C.burgundy, color: C.white }}
            >
              <p className="text-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>5</p>
              <p className="text-[9px] uppercase tracking-widest opacity-80">pieces / quarter</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// BENEFITS - Chunky bar
// ============================================
function BenefitsBar() {
  const benefits = [
    { icon: Sparkles, label: "Clinically Clean" },
    { icon: Shield, label: "Insured" },
    { icon: Truck, label: "Free Shipping" },
    { icon: Leaf, label: "Sustainable" },
    { icon: Clock, label: "Flexible" },
  ];

  return (
    <section className="py-5" style={{ backgroundColor: C.burgundy }}>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-center gap-2">
              <b.icon className="w-4 h-4" style={{ color: C.yellow }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.cream }}>
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// BENTO - 2x2 with bold colors
// ============================================
function BentoGrid({ bentoImage1, bentoImage2 }: { bentoImage1?: string; bentoImage2?: string }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {/* Philosophy - Lavender */}
      <div className="relative p-8 md:p-12 flex flex-col justify-center min-h-[320px]" style={{ backgroundColor: C.lavender }}>
        {/* Decorative circle */}
        <div
          className="absolute top-4 right-4 w-16 h-16 rounded-full"
          style={{ backgroundColor: C.yellow, opacity: 0.5 }}
        />
        <h2
          className="mb-3 relative z-10"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: C.burgundy }}
        >
          Our philosophy
        </h2>
        <p className="text-sm leading-relaxed max-w-sm relative z-10" style={{ color: C.text }}>
          Premium European fashion for your little one. Curated with care, cleaned with science.
        </p>
      </div>

      {/* Image 1 */}
      <div className="relative min-h-[320px]">
        <img
          src={bentoImage1 || FALLBACK_IMAGES.bento1}
          alt="Baby"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Image 2 */}
      <div className="relative min-h-[320px] order-4 md:order-3">
        <img
          src={bentoImage2 || FALLBACK_IMAGES.bento2}
          alt="Clothing"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Cleaning - Burgundy */}
      <div className="relative p-8 md:p-12 flex flex-col justify-center min-h-[320px] order-3 md:order-4" style={{ backgroundColor: C.burgundy }}>
        {/* Decorative shape */}
        <div
          className="absolute bottom-4 left-4 w-20 h-20"
          style={{ backgroundColor: C.vermilion, opacity: 0.3 }}
        />
        <h2
          className="mb-3 relative z-10"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: C.cream }}
        >
          Clinically clean
        </h2>
        <p className="text-sm leading-relaxed max-w-sm mb-5 relative z-10" style={{ color: C.cream, opacity: 0.9 }}>
          Medical-grade sanitization. Safe for sensitive skin.
        </p>
        <Link href="/catalog" className="relative z-10 w-fit">
          <button className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest" style={{ backgroundColor: C.vermilion, color: C.white }}>
            Rent Now →
          </button>
        </Link>
      </div>
    </section>
  );
}

// ============================================
// MARQUEE - Bold vermilion
// ============================================
function MarqueeBanner() {
  const items = ["NO STRESS ✦", "PREMIUM BRANDS ✦", "SUSTAINABLE ✦", "CLEAN ✦", "FREE RETURNS ✦"];
  return (
    <section className="py-4 overflow-hidden" style={{ backgroundColor: C.vermilion }}>
      <div className="animate-marquee flex whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} className="text-sm font-bold uppercase tracking-widest mx-6" style={{ color: C.white }}>
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

// ============================================
// HOW IT WORKS - Playful numbers
// ============================================
function HowItWorks() {
  const steps = [
    { num: "01", title: "Pick 5", desc: "Browse premium brands" },
    { num: "02", title: "Wear", desc: "Enjoy for 3 months" },
    { num: "03", title: "Return", desc: "Swap for new pieces" },
  ];

  return (
    <section className="py-14 md:py-20 relative" style={{ backgroundColor: C.cream }}>
      {/* Decorative shape */}
      <div className="absolute top-8 left-8 w-24 h-24 rounded-full" style={{ backgroundColor: C.lavender, opacity: 0.5 }} />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-10">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: C.vermilion }}>How It Works</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: C.burgundy }}>
            Simple as <span style={{ color: C.vermilion }}>1, 2, 3</span>
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
          {steps.map((s, i) => (
            <div key={i} className="text-center">
              <span
                className="block mb-2"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(3rem, 6vw, 4.5rem)",
                  color: i === 1 ? C.vermilion : C.lavender,
                  lineHeight: 1,
                }}
              >
                {s.num}
              </span>
              <h3 className="text-sm font-bold mb-1" style={{ color: C.burgundy }}>{s.title}</h3>
              <p className="text-xs" style={{ color: C.text }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// PRODUCTS - With prominent color frames
// ============================================
function FeaturedProducts() {
  const { data: products, isLoading } = useQuery<SanityProduct[]>({
    queryKey: ["sanity", "featuredProducts"],
    queryFn: fetchFeaturedProducts,
  });
  const display = products?.slice(0, 4) || [];
  const frameColors = [C.lavender, C.yellow, C.vermilion, C.lavender];

  return (
    <section className="py-14 md:py-20" style={{ backgroundColor: C.white }}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: C.vermilion }}>Featured</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: C.burgundy }}>
              Bestsellers
            </h2>
          </div>
          <Link href="/catalog" className="hidden md:flex items-center text-xs font-bold uppercase tracking-wider hover:opacity-70" style={{ color: C.burgundy }}>
            View All <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] mb-3" style={{ backgroundColor: C.lavender }} />
              </div>
            ))
          ) : (
            display.map((p, i) => {
              const img = getProductImageUrl(p, { width: 300, height: 400 });
              return (
                <Link key={p._id} href={`/product/${p.slug}`}>
                  <div className="group relative">
                    {/* Bold colored frame */}
                    <div
                      className="absolute -top-3 -left-3 w-full h-full"
                      style={{ backgroundColor: frameColors[i], opacity: i === 2 ? 0.2 : 1 }}
                    />
                    <div className="relative aspect-[3/4] overflow-hidden mb-3" style={{ backgroundColor: C.cream }}>
                      {img ? (
                        <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-10 h-10" style={{ color: C.burgundy, opacity: 0.2 }} />
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.vermilion }}>{p.brand?.name}</p>
                    <h3 className="text-sm line-clamp-1" style={{ fontFamily: "'Playfair Display', serif", color: C.burgundy }}>{p.name}</h3>
                    <p className="text-[10px] mt-0.5" style={{ color: C.text }}>RRP €{p.rrpPrice}</p>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/catalog">
            <button className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: C.burgundy, color: C.white }}>
              View All
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================
// CTA - Bold vermilion with shape
// ============================================
function CTASection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden" style={{ backgroundColor: C.vermilion }}>
      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 w-48 h-48" style={{ backgroundColor: C.yellow, opacity: 0.2 }} />
      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full" style={{ backgroundColor: C.burgundy, opacity: 0.2 }} />

      <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
        <h2
          className="mb-4"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: C.white }}
        >
          Ready to start?
        </h2>
        <p className="text-sm max-w-md mx-auto mb-8" style={{ color: C.white, opacity: 0.9 }}>
          Join families dressing their babies in designer clothes sustainably.
        </p>
        <Link href="/catalog">
          <button className="px-8 py-3 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105" style={{ backgroundColor: C.white, color: C.vermilion }}>
            Start Your Subscription →
          </button>
        </Link>
      </div>
    </section>
  );
}

// ============================================
// BRANDS - Lavender with yellow accents
// ============================================
function BrandsShowcase() {
  const { data: brands } = useQuery<SanityBrand[]>({
    queryKey: ["sanity", "brands"],
    queryFn: fetchBrands,
  });
  const display = brands?.slice(0, 3) || [];

  return (
    <section className="py-14 md:py-20 relative" style={{ backgroundColor: C.lavender }}>
      {/* Decorative */}
      <div className="absolute top-4 right-8 w-16 h-16" style={{ backgroundColor: C.yellow }} />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: C.burgundy }}>Partners</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: C.burgundy }}>
            Premium brands
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {display.map((b) => (
            <Link key={b._id} href={`/catalog?brand=${encodeURIComponent(b.name)}`}>
              <div className="p-6 text-center hover:shadow-lg transition-shadow" style={{ backgroundColor: C.white }}>
                <h3 className="text-xl mb-2" style={{ fontFamily: "'Playfair Display', serif", color: C.burgundy }}>{b.name}</h3>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: C.vermilion }}>Rent Collection →</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/brands">
            <button className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: C.burgundy, color: C.white }}>
              All Brands
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================
// BLOG - Clean with colored accents
// ============================================
function BlogPreview() {
  const { data: posts } = useQuery<SanityPost[]>({
    queryKey: ["sanity", "featuredPosts"],
    queryFn: fetchFeaturedPosts,
  });
  const display = posts?.slice(0, 3) || [];

  return (
    <section className="py-14 md:py-20" style={{ backgroundColor: C.cream }}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: C.vermilion }}>Blog</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: C.burgundy }}>
              Stories
            </h2>
          </div>
          <Link href="/blog" className="hidden md:flex items-center text-xs font-bold uppercase tracking-wider hover:opacity-70" style={{ color: C.burgundy }}>
            View All <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {display.map((p, i) => {
            const img = getPostImageUrl(p, { width: 300, height: 220 });
            return (
              <Link key={p._id} href={`/blog/${p.slug}`}>
                <article className="group">
                  <div className="relative aspect-[4/3] overflow-hidden mb-3">
                    {/* Colored overlay on hover */}
                    <div
                      className="absolute inset-0 z-10 opacity-0 group-hover:opacity-20 transition-opacity"
                      style={{ backgroundColor: i === 1 ? C.vermilion : C.lavender }}
                    />
                    {img ? (
                      <img src={img} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full" style={{ backgroundColor: C.lavender }} />
                    )}
                  </div>
                  {p.publishedAt && <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: C.vermilion }}>{format(new Date(p.publishedAt), "MMM d")}</p>}
                  <h3 className="text-sm line-clamp-2" style={{ fontFamily: "'Playfair Display', serif", color: C.burgundy }}>{p.title}</h3>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// TESTIMONIALS - With colored backgrounds
// ============================================
function Testimonials() {
  const quotes = [
    { q: "Sustainable and stylish!", author: "Sarah M.", bg: C.lavender },
    { q: "Quality is incredible.", author: "Emma K.", bg: C.yellow },
    { q: "Designer without guilt.", author: "Lisa O.", bg: C.lavender },
  ];

  return (
    <section className="py-14 md:py-20" style={{ backgroundColor: C.white }}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-8">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: C.burgundy }}>
            Loved by families
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {quotes.map((t, i) => (
            <div key={i} className="text-center p-6" style={{ backgroundColor: t.bg }}>
              <p className="text-sm italic mb-3" style={{ fontFamily: "'Playfair Display', serif", color: C.burgundy }}>"{t.q}"</p>
              <p className="text-xs font-bold" style={{ color: C.text }}>{t.author}</p>
            </div>
          ))}
        </div>
        {/* Stats */}
        <div className="flex justify-center gap-12 mt-10">
          {[{ v: "500+", l: "Families" }, { v: "15+", l: "Brands" }, { v: "4.9", l: "Rating" }].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl" style={{ fontFamily: "'Playfair Display', serif", color: C.burgundy }}>{s.v}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.text }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// FOOTER
// ============================================
function Footer() {
  return (
    <footer style={{ backgroundColor: C.burgundy, color: C.cream }}>
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>Seasons</Link>
            <p className="mt-3 text-xs opacity-70">Premium baby clothing rental.</p>
          </div>
          <div>
            <h4 className="font-bold mb-3 uppercase text-[10px] tracking-wider">Shop</h4>
            <ul className="space-y-2 text-xs opacity-70">
              <li><Link href="/catalog">All Products</Link></li>
              <li><Link href="/brands">Brands</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 uppercase text-[10px] tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs opacity-70">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/how-it-works">How It Works</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 uppercase text-[10px] tracking-wider">Support</h4>
            <ul className="space-y-2 text-xs opacity-70">
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/returns">Returns</Link></li>
              <li><Link href="/sizing">Sizing</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs opacity-70">
          <p>© 2025 Seasons</p>
          <div className="flex gap-4">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// MAIN
// ============================================
export default function HomeV5() {
  // Fetch site settings for homepage images
  const { data: settings } = useQuery<SanitySettings>({
    queryKey: ["sanity", "siteSettings"],
    queryFn: fetchSiteSettings,
  });

  // Get image URLs from Sanity or use fallbacks
  const heroImage = getSettingsImageUrl(settings?.heroImage, { width: 450, height: 600 });
  const bentoImage1 = getSettingsImageUrl(settings?.bentoImage1, { width: 500, height: 400 });
  const bentoImage2 = getSettingsImageUrl(settings?.bentoImage2, { width: 500, height: 400 });

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.cream }}>
      <Navigation />
      <main>
        <HeroSection heroImage={heroImage || undefined} />
        <BenefitsBar />
        <BentoGrid bentoImage1={bentoImage1 || undefined} bentoImage2={bentoImage2 || undefined} />
        <MarqueeBanner />
        <HowItWorks />
        <FeaturedProducts />
        <CTASection />
        <BrandsShowcase />
        <BlogPreview />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
