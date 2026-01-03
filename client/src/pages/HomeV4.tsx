/**
 * HomeV4 - Second iteration with bolder color blocking
 *
 * Improvements from V3:
 * - Bolder color blocking (full-bleed areas)
 * - Abstract shape frames around images
 * - More playful/jolly layout
 * - Tighter spacing
 * - Asymmetric hero with colored shape
 * - More visual overlap/interest
 *
 * Colors:
 * - Vermilion: #fe4216
 * - Lavender: #e2c8f3
 * - Dark burgundy: #531103
 * - Text: #761e0b
 * - Cream: #faf8f5
 */

import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { fetchFeaturedProducts, fetchBrands, fetchFeaturedPosts, getProductImageUrl, getPostImageUrl, type SanityProduct, type SanityBrand, type SanityPost } from "@/lib/sanity";
import { ArrowRight, ShoppingBag, Sparkles, Shield, Truck, Leaf, Clock } from "lucide-react";
import { format } from "date-fns";
import Navigation from "@/components/Navigation";

const C = {
  vermilion: "#fe4216",
  lavender: "#e2c8f3",
  burgundy: "#531103",
  text: "#761e0b",
  cream: "#faf8f5",
  white: "#ffffff",
};

// ============================================
// HERO - Playful with abstract shape
// ============================================
function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: C.cream }}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-12 gap-4 items-center py-10 md:py-14 min-h-[75vh]">
          {/* Left content - 5 cols */}
          <div className="md:col-span-5 relative z-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: C.vermilion }}>
              Premium Baby Rental
            </p>
            <h1
              className="leading-[0.9] mb-4"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2.25rem, 6vw, 4rem)",
                fontWeight: 400,
                color: C.burgundy,
              }}
            >
              Dress them<br />
              <span className="italic">beautifully</span>
            </h1>
            <p className="text-sm max-w-sm leading-relaxed mb-5" style={{ color: C.text }}>
              Europe's finest baby brands. €70/quarter for 5 designer pieces.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/catalog">
                <button
                  className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider"
                  style={{ backgroundColor: C.vermilion, color: C.white }}
                >
                  Start Your Box
                </button>
              </Link>
              <Link href="/brands">
                <button
                  className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider border-2"
                  style={{ borderColor: C.burgundy, color: C.burgundy }}
                >
                  Our Brands
                </button>
              </Link>
            </div>
          </div>

          {/* Right - Image with abstract shape frame - 7 cols */}
          <div className="md:col-span-7 relative">
            {/* Abstract lavender shape behind image */}
            <div
              className="absolute -top-6 -right-6 md:-top-10 md:-right-10 w-[90%] h-[95%]"
              style={{ backgroundColor: C.lavender }}
            />
            {/* Image */}
            <div className="relative aspect-[4/5] max-w-md ml-auto">
              <img
                src="https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500&h=625&fit=crop&auto=format"
                alt="Baby in designer clothing"
                className="w-full h-full object-cover relative z-10"
              />
              {/* Floating badge */}
              <div
                className="absolute bottom-4 -left-4 md:bottom-8 md:-left-8 p-4 z-20"
                style={{ backgroundColor: C.burgundy, color: C.white }}
              >
                <p className="text-2xl font-light" style={{ fontFamily: "'Playfair Display', serif" }}>5</p>
                <p className="text-[10px] uppercase tracking-wider opacity-80">pieces/quarter</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// BENEFITS BAR - Compact
// ============================================
function BenefitsBar() {
  const benefits = [
    { icon: Sparkles, label: "Clinically Cleaned" },
    { icon: Shield, label: "Insurance Included" },
    { icon: Truck, label: "Free Shipping" },
    { icon: Leaf, label: "Sustainable" },
    { icon: Clock, label: "Flexible" },
  ];

  return (
    <section className="py-4" style={{ backgroundColor: C.burgundy }}>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-x-6 gap-y-2">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <b.icon className="w-3.5 h-3.5" style={{ color: C.lavender }} />
              <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: C.cream }}>
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
// BENTO SECTION - Philosophy + Cleaning combined
// Bold 2x2 grid with color blocks
// ============================================
function BentoSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {/* Top Left - Lavender text */}
      <div className="p-6 md:p-10 flex flex-col justify-center min-h-[280px] md:min-h-[350px]" style={{ backgroundColor: C.lavender }}>
        <h2
          className="mb-3"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", color: C.burgundy }}
        >
          Our philosophy
        </h2>
        <p className="text-sm leading-relaxed max-w-sm" style={{ color: C.text }}>
          Premium garments from Europe's finest brands. Fashion that cares for families and the planet.
        </p>
      </div>

      {/* Top Right - Image */}
      <div className="relative min-h-[280px] md:min-h-[350px]">
        <img
          src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=400&fit=crop&auto=format"
          alt="Baby"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Bottom Left - Image */}
      <div className="relative min-h-[280px] md:min-h-[350px] order-4 md:order-3">
        <img
          src="https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=500&h=400&fit=crop&auto=format"
          alt="Clothing detail"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Bottom Right - Burgundy text */}
      <div className="p-6 md:p-10 flex flex-col justify-center min-h-[280px] md:min-h-[350px] order-3 md:order-4" style={{ backgroundColor: C.burgundy }}>
        <h2
          className="mb-3"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", color: C.cream }}
        >
          Clinically clean
        </h2>
        <p className="text-sm leading-relaxed max-w-sm mb-4" style={{ color: C.cream, opacity: 0.85 }}>
          Medical-grade sanitization. Safe for sensitive skin, free from harsh chemicals.
        </p>
        <Link href="/catalog">
          <button className="px-4 py-2 text-xs font-semibold uppercase tracking-wider w-fit" style={{ backgroundColor: C.vermilion, color: C.white }}>
            Rent Now
          </button>
        </Link>
      </div>
    </section>
  );
}

// ============================================
// MARQUEE
// ============================================
function MarqueeBanner() {
  const items = ["NO STRESS", "PREMIUM BRANDS", "SUSTAINABLE", "CLINICALLY CLEANED", "FREE RETURNS"];
  return (
    <section className="py-2.5 overflow-hidden" style={{ backgroundColor: C.vermilion }}>
      <div className="animate-marquee flex whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} className="text-[11px] font-semibold uppercase tracking-widest mx-5" style={{ color: C.white }}>
            {item} <span className="mx-5 opacity-50">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}

// ============================================
// HOW IT WORKS - Compact
// ============================================
function HowItWorks() {
  const steps = [
    { num: "01", title: "Pick 5", desc: "Browse premium European brands" },
    { num: "02", title: "Wear", desc: "Enjoy for 3 months" },
    { num: "03", title: "Return", desc: "Swap for new pieces" },
  ];

  return (
    <section className="py-12 md:py-16" style={{ backgroundColor: C.cream }}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: C.vermilion }}>How It Works</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", color: C.burgundy }}>
            Simple as 1, 2, 3
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {steps.map((s, i) => (
            <div key={i} className="text-center">
              <span className="block text-4xl md:text-5xl mb-2" style={{ fontFamily: "'Playfair Display', serif", color: C.lavender }}>
                {s.num}
              </span>
              <h3 className="text-sm font-semibold mb-1" style={{ color: C.burgundy }}>{s.title}</h3>
              <p className="text-xs" style={{ color: C.text }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// PRODUCTS - With shape frames
// ============================================
function FeaturedProducts() {
  const { data: products, isLoading } = useQuery<SanityProduct[]>({
    queryKey: ["sanity", "featuredProducts"],
    queryFn: fetchFeaturedProducts,
  });
  const display = products?.slice(0, 4) || [];

  return (
    <section className="py-12 md:py-16" style={{ backgroundColor: C.white }}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: C.vermilion }}>Featured</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", color: C.burgundy }}>
              Bestsellers
            </h2>
          </div>
          <Link href="/catalog" className="hidden md:flex items-center text-xs uppercase tracking-wider" style={{ color: C.burgundy }}>
            View All <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] mb-2" style={{ backgroundColor: C.lavender }} />
              </div>
            ))
          ) : (
            display.map((p, i) => {
              const img = getProductImageUrl(p, { width: 280, height: 370 });
              return (
                <Link key={p._id} href={`/product/${p.slug}`}>
                  <div className="group relative">
                    {/* Colored shape frame - alternating colors */}
                    <div
                      className="absolute -top-2 -left-2 w-full h-full -z-10"
                      style={{ backgroundColor: i % 2 === 0 ? C.lavender : C.vermilion, opacity: i % 2 === 0 ? 1 : 0.15 }}
                    />
                    <div className="aspect-[3/4] overflow-hidden mb-2" style={{ backgroundColor: C.cream }}>
                      {img ? (
                        <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8" style={{ color: C.burgundy, opacity: 0.2 }} />
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: C.vermilion }}>{p.brand?.name}</p>
                    <h3 className="text-xs line-clamp-1" style={{ fontFamily: "'Playfair Display', serif", color: C.burgundy }}>{p.name}</h3>
                    <p className="text-[10px] mt-0.5" style={{ color: C.text }}>RRP €{p.rrpPrice}</p>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        <div className="mt-6 text-center md:hidden">
          <Link href="/catalog">
            <button className="px-5 py-2 text-xs font-semibold uppercase tracking-wider border-2" style={{ borderColor: C.burgundy, color: C.burgundy }}>
              View All
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================
// CTA - Full bleed vermilion
// ============================================
function CTASection() {
  return (
    <section className="py-12 md:py-16" style={{ backgroundColor: C.vermilion }}>
      <div className="container mx-auto px-4 md:px-8 text-center">
        <h2
          className="mb-3"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: C.white }}
        >
          Ready to start?
        </h2>
        <p className="text-sm max-w-md mx-auto mb-6" style={{ color: C.white, opacity: 0.9 }}>
          Join families who dress their babies in designer clothes sustainably.
        </p>
        <Link href="/catalog">
          <button className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider" style={{ backgroundColor: C.white, color: C.vermilion }}>
            Start Your Subscription
          </button>
        </Link>
      </div>
    </section>
  );
}

// ============================================
// BRANDS - Lavender background
// ============================================
function BrandsShowcase() {
  const { data: brands } = useQuery<SanityBrand[]>({
    queryKey: ["sanity", "brands"],
    queryFn: fetchBrands,
  });
  const display = brands?.slice(0, 3) || [];

  return (
    <section className="py-12 md:py-16" style={{ backgroundColor: C.lavender }}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: C.burgundy }}>Partners</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", color: C.burgundy }}>
            Premium brands
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {display.map((b) => (
            <Link key={b._id} href={`/catalog?brand=${encodeURIComponent(b.name)}`}>
              <div className="p-5 text-center hover:shadow-md transition-shadow" style={{ backgroundColor: C.white }}>
                <h3 className="text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif", color: C.burgundy }}>{b.name}</h3>
                <span className="text-[10px] uppercase tracking-wider" style={{ color: C.vermilion }}>Rent Collection →</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/brands">
            <button className="px-5 py-2 text-xs font-semibold uppercase tracking-wider border-2" style={{ borderColor: C.burgundy, color: C.burgundy }}>
              All Brands
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================
// BLOG - Compact cards
// ============================================
function BlogPreview() {
  const { data: posts } = useQuery<SanityPost[]>({
    queryKey: ["sanity", "featuredPosts"],
    queryFn: fetchFeaturedPosts,
  });
  const display = posts?.slice(0, 3) || [];

  return (
    <section className="py-12 md:py-16" style={{ backgroundColor: C.cream }}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: C.vermilion }}>Blog</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", color: C.burgundy }}>
              Stories
            </h2>
          </div>
          <Link href="/blog" className="hidden md:flex items-center text-xs uppercase tracking-wider" style={{ color: C.burgundy }}>
            View All <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {display.map((p) => {
            const img = getPostImageUrl(p, { width: 280, height: 200 });
            return (
              <Link key={p._id} href={`/blog/${p.slug}`}>
                <article className="group" style={{ backgroundColor: C.white }}>
                  <div className="aspect-[4/3] overflow-hidden">
                    {img ? (
                      <img src={img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full" style={{ backgroundColor: C.lavender }} />
                    )}
                  </div>
                  <div className="p-3">
                    {p.publishedAt && <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: C.vermilion }}>{format(new Date(p.publishedAt), "MMM d")}</p>}
                    <h3 className="text-sm line-clamp-2" style={{ fontFamily: "'Playfair Display', serif", color: C.burgundy }}>{p.title}</h3>
                  </div>
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
// TESTIMONIALS - Compact
// ============================================
function Testimonials() {
  const quotes = [
    { q: "Sustainable and stylish!", author: "Sarah M." },
    { q: "Quality is incredible.", author: "Emma K." },
    { q: "Designer without the guilt.", author: "Lisa O." },
  ];

  return (
    <section className="py-12 md:py-16" style={{ backgroundColor: C.white }}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-6">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", color: C.burgundy }}>
            Loved by families
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {quotes.map((t, i) => (
            <div key={i} className="text-center p-4" style={{ backgroundColor: C.cream }}>
              <p className="text-sm italic mb-2" style={{ fontFamily: "'Playfair Display', serif", color: C.burgundy }}>"{t.q}"</p>
              <p className="text-xs" style={{ color: C.text }}>{t.author}</p>
            </div>
          ))}
        </div>
        {/* Stats */}
        <div className="flex justify-center gap-10 mt-8">
          {[{ v: "500+", l: "Families" }, { v: "15+", l: "Brands" }, { v: "4.9", l: "Rating" }].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl" style={{ fontFamily: "'Playfair Display', serif", color: C.burgundy }}>{s.v}</p>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: C.text }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// FOOTER - Compact
// ============================================
function Footer() {
  return (
    <footer style={{ backgroundColor: C.burgundy, color: C.cream }}>
      <div className="container mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Seasons</Link>
            <p className="mt-2 text-[10px] opacity-70 leading-relaxed">Premium baby clothing rental.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 uppercase text-[10px] tracking-wider">Shop</h4>
            <ul className="space-y-1 text-[11px] opacity-70">
              <li><Link href="/catalog">All Products</Link></li>
              <li><Link href="/brands">Brands</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 uppercase text-[10px] tracking-wider">Company</h4>
            <ul className="space-y-1 text-[11px] opacity-70">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/how-it-works">How It Works</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 uppercase text-[10px] tracking-wider">Support</h4>
            <ul className="space-y-1 text-[11px] opacity-70">
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/returns">Returns</Link></li>
              <li><Link href="/sizing">Sizing</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-2 text-[10px] opacity-70">
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
export default function HomeV4() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: C.cream }}>
      <Navigation />
      <main>
        <HeroSection />
        <BenefitsBar />
        <BentoSection />
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
