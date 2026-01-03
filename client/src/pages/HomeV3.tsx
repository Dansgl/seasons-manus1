/**
 * HomeV3 - First iteration with exact Pitch colors
 *
 * Colors:
 * - Vermilion (CTA): #fe4216
 * - Moon Raker (lavender): #e2c8f3
 * - Dark burgundy: #531103
 * - Text: #761e0b
 * - Cream background: #faf8f5
 *
 * Changes from V2:
 * - Updated to exact Pitch color palette
 * - Smaller elements (founder feedback: "foarte mare totul")
 * - Added 5 benefits below hero
 * - More playful/jolly feel
 */

import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { fetchFeaturedProducts, fetchBrands, fetchFeaturedPosts, getProductImageUrl, getPostImageUrl, type SanityProduct, type SanityBrand, type SanityPost } from "@/lib/sanity";
import { ArrowRight, ShoppingBag, Sparkles, Shield, Truck, Leaf, Clock } from "lucide-react";
import { format } from "date-fns";
import Navigation from "@/components/Navigation";

// Color constants for this version
const COLORS = {
  vermilion: "#fe4216",
  lavender: "#e2c8f3",
  burgundy: "#531103",
  text: "#761e0b",
  cream: "#faf8f5",
  white: "#ffffff",
};

// ============================================
// HERO SECTION
// ============================================
function HeroSection() {
  return (
    <section className="min-h-[80vh] relative overflow-hidden" style={{ backgroundColor: COLORS.cream }}>
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center min-h-[60vh]">
          {/* Left - Typography */}
          <div className="relative z-10">
            <p
              className="text-sm font-medium uppercase tracking-wider mb-3"
              style={{ color: COLORS.vermilion }}
            >
              Premium Baby Clothing Rental
            </p>
            <h1
              className="leading-[0.95] mb-4"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2.5rem, 8vw, 5rem)",
                fontWeight: 400,
                color: COLORS.burgundy,
              }}
            >
              Dress them<br />
              <span className="italic">beautifully</span>
            </h1>
            <p
              className="text-base md:text-lg max-w-md leading-relaxed mb-6"
              style={{ color: COLORS.text }}
            >
              Access Europe's finest baby brands through our sustainable rental subscription.
              €70/quarter for 5 designer pieces.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/catalog">
                <button
                  className="px-6 py-3 text-sm font-medium uppercase tracking-wider transition-all hover:opacity-90"
                  style={{ backgroundColor: COLORS.vermilion, color: COLORS.white }}
                >
                  Start Your Box
                </button>
              </Link>
              <Link href="/brands">
                <button
                  className="px-6 py-3 text-sm font-medium uppercase tracking-wider border-2 transition-all hover:opacity-80"
                  style={{ borderColor: COLORS.text, color: COLORS.text }}
                >
                  Our Brands
                </button>
              </Link>
            </div>
          </div>

          {/* Right - Product Image */}
          <div className="relative">
            <div className="aspect-[4/5] relative overflow-hidden" style={{ backgroundColor: COLORS.lavender }}>
              <img
                src="https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=750&fit=crop&auto=format"
                alt="Baby in designer clothing"
                className="w-full h-full object-cover mix-blend-multiply"
              />
            </div>
            {/* Floating stat card */}
            <div
              className="absolute -bottom-4 -left-4 md:bottom-6 md:-left-8 p-5"
              style={{ backgroundColor: COLORS.burgundy, color: COLORS.white }}
            >
              <p
                className="text-3xl md:text-4xl mb-1"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                5
              </p>
              <p className="text-xs opacity-80">pieces per quarter</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// 5 BENEFITS BAR - Below Hero
// ============================================
function BenefitsBar() {
  const benefits = [
    { icon: Sparkles, label: "Ozone Cleaned" },
    { icon: Shield, label: "Insurance Included" },
    { icon: Truck, label: "Free Shipping" },
    { icon: Leaf, label: "Sustainable" },
    { icon: Clock, label: "Flexible Returns" },
  ];

  return (
    <section style={{ backgroundColor: COLORS.lavender }} className="py-6">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-4 md:gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <benefit.icon className="w-4 h-4" style={{ color: COLORS.burgundy }} />
              <span className="text-sm font-medium" style={{ color: COLORS.burgundy }}>
                {benefit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// PHILOSOPHY SECTION - Bento 50/50
// ============================================
function PhilosophySection() {
  return (
    <section className="grid md:grid-cols-2">
      {/* Left - Lavender text block */}
      <div
        className="p-8 md:p-12 lg:p-16 flex flex-col justify-center min-h-[350px] md:min-h-[450px]"
        style={{ backgroundColor: COLORS.lavender }}
      >
        <h2
          className="mb-4"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
            lineHeight: 1.1,
            color: COLORS.burgundy,
          }}
        >
          Our philosophy
        </h2>
        <p className="text-sm md:text-base leading-relaxed max-w-md" style={{ color: COLORS.text }}>
          Fashion that actually cares for families. Made with only premium,
          carefully-selected garments from Europe's finest children's brands
          that keep your little ones looking beautiful.
        </p>
      </div>

      {/* Right - Image */}
      <div className="relative min-h-[350px] md:min-h-[450px]">
        <img
          src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=600&fit=crop&auto=format"
          alt="Happy baby in sustainable clothing"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </section>
  );
}

// ============================================
// MARQUEE BANNER
// ============================================
function MarqueeBanner() {
  const items = [
    "CLINICALLY CLEANED",
    "INSURANCE INCLUDED",
    "FREE SHIPPING",
    "PREMIUM BRANDS",
    "SUSTAINABLE",
    "NO STRESS"
  ];

  return (
    <section className="py-3 overflow-hidden" style={{ backgroundColor: COLORS.burgundy }}>
      <div className="animate-marquee flex whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((item, index) => (
          <span key={index} className="text-xs font-medium uppercase tracking-wider mx-6" style={{ color: COLORS.cream }}>
            {item}
            <span className="mx-6 opacity-50">•</span>
          </span>
        ))}
      </div>
    </section>
  );
}

// ============================================
// CLEANING STANDARDS SECTION
// ============================================
function CleaningSection() {
  return (
    <section className="grid md:grid-cols-2">
      {/* Left - Image */}
      <div className="relative min-h-[350px] md:min-h-[450px] order-2 md:order-1">
        <img
          src="https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=600&h=600&fit=crop&auto=format"
          alt="Baby clothing quality"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Right - Dark text block */}
      <div
        className="p-8 md:p-12 lg:p-16 flex flex-col justify-center min-h-[350px] md:min-h-[450px] order-1 md:order-2"
        style={{ backgroundColor: COLORS.burgundy }}
      >
        <h2
          className="mb-4"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
            lineHeight: 1.1,
            color: COLORS.cream,
          }}
        >
          Clinically clean
        </h2>
        <p className="text-sm md:text-base leading-relaxed max-w-md mb-6" style={{ color: COLORS.cream, opacity: 0.85 }}>
          Every garment is professionally sanitized using medical-grade technology.
          Safe for sensitive skin, free from harsh chemicals.
        </p>
        <Link href="/catalog" className="inline-block">
          <button
            className="px-6 py-3 text-sm font-medium uppercase tracking-wider transition-all hover:opacity-90"
            style={{ backgroundColor: COLORS.vermilion, color: COLORS.white }}
          >
            Rent Collection
          </button>
        </Link>
      </div>
    </section>
  );
}

// ============================================
// HOW IT WORKS
// ============================================
function HowItWorks() {
  const steps = [
    { number: "01", title: "Browse & Pick 5", description: "Choose any 5 pieces from premium European brands." },
    { number: "02", title: "Wear & Enjoy", description: "Dress your little one in luxury for 3 months." },
    { number: "03", title: "Return & Refresh", description: "Send back and pick 5 new pieces." },
  ];

  return (
    <section className="py-14 md:py-20" style={{ backgroundColor: COLORS.cream }}>
      <div className="container mx-auto px-4 md:px-8">
        <p className="text-xs font-medium uppercase tracking-wider text-center mb-3" style={{ color: COLORS.vermilion }}>
          How It Works
        </p>
        <h2
          className="text-center mb-10"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
            lineHeight: 1.1,
            color: COLORS.burgundy,
          }}
        >
          Simple as 1, 2, 3
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <span
                className="block mb-3"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "3.5rem",
                  lineHeight: 1,
                  color: COLORS.lavender,
                }}
              >
                {step.number}
              </span>
              <h3 className="text-base font-medium mb-2" style={{ color: COLORS.burgundy }}>{step.title}</h3>
              <p className="text-sm" style={{ color: COLORS.text }}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// FEATURED PRODUCTS
// ============================================
function FeaturedProducts() {
  const { data: products, isLoading } = useQuery<SanityProduct[]>({
    queryKey: ["sanity", "featuredProducts"],
    queryFn: fetchFeaturedProducts,
  });

  const displayProducts = products?.slice(0, 4) || [];

  return (
    <section className="py-14 md:py-20" style={{ backgroundColor: COLORS.white }}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: COLORS.vermilion }}>
              Featured
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                lineHeight: 1.1,
                color: COLORS.burgundy,
              }}
            >
              Bestsellers
            </h2>
          </div>
          <Link href="/catalog" className="hidden md:flex items-center transition-colors hover:opacity-70" style={{ color: COLORS.burgundy }}>
            <span className="mr-2 text-xs uppercase tracking-wider">View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] mb-3" style={{ backgroundColor: COLORS.lavender }} />
                <div className="h-3 w-1/3 mb-2" style={{ backgroundColor: COLORS.lavender }} />
                <div className="h-4 w-2/3" style={{ backgroundColor: COLORS.lavender }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayProducts.map((product) => {
              const imageUrl = getProductImageUrl(product, { width: 300, height: 400 });
              return (
                <Link key={product._id} href={`/product/${product.slug}`}>
                  <div className="group">
                    <div className="aspect-[3/4] overflow-hidden mb-3" style={{ backgroundColor: COLORS.lavender }}>
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-10 h-10" style={{ color: COLORS.burgundy, opacity: 0.3 }} />
                        </div>
                      )}
                    </div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.vermilion }}>
                      {product.brand?.name}
                    </p>
                    <h3
                      className="text-sm group-hover:opacity-70 transition-opacity line-clamp-2"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif", color: COLORS.burgundy }}
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs mt-1" style={{ color: COLORS.text }}>RRP €{product.rrpPrice}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link href="/catalog">
            <button
              className="px-6 py-3 text-sm font-medium uppercase tracking-wider border-2 transition-all hover:opacity-80"
              style={{ borderColor: COLORS.burgundy, color: COLORS.burgundy }}
            >
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================
// CTA SECTION
// ============================================
function CTASection() {
  return (
    <section className="py-14 md:py-20" style={{ backgroundColor: COLORS.vermilion }}>
      <div className="container mx-auto px-4 md:px-8 text-center">
        <h2
          className="mb-4"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(1.75rem, 4vw, 3rem)",
            lineHeight: 1.1,
            color: COLORS.white,
          }}
        >
          Ready to start?
        </h2>
        <p className="text-sm md:text-base max-w-xl mx-auto mb-8" style={{ color: COLORS.white, opacity: 0.9 }}>
          Join hundreds of families who've discovered a smarter way to dress their little ones.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/catalog">
            <button
              className="px-8 py-3 text-sm font-medium uppercase tracking-wider transition-all hover:opacity-90"
              style={{ backgroundColor: COLORS.white, color: COLORS.vermilion }}
            >
              Start Your Subscription
            </button>
          </Link>
          <Link href="/brands">
            <button
              className="px-8 py-3 text-sm font-medium uppercase tracking-wider border-2 transition-all hover:opacity-80"
              style={{ borderColor: "rgba(255,255,255,0.4)", color: COLORS.white }}
            >
              Explore Brands
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================
// BRANDS SHOWCASE
// ============================================
function BrandsShowcase() {
  const { data: brands } = useQuery<SanityBrand[]>({
    queryKey: ["sanity", "brands"],
    queryFn: fetchBrands,
  });

  const displayBrands = brands?.slice(0, 3) || [];

  return (
    <section className="py-14 md:py-20" style={{ backgroundColor: COLORS.cream }}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-8">
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: COLORS.vermilion }}>
            Our Partners
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              lineHeight: 1.1,
              color: COLORS.burgundy,
            }}
          >
            Premium European brands
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {displayBrands.map((brand) => (
            <Link key={brand._id} href={`/catalog?brand=${encodeURIComponent(brand.name)}`}>
              <div
                className="p-6 md:p-8 text-center hover:shadow-md transition-shadow"
                style={{ backgroundColor: COLORS.white }}
              >
                <h3
                  className="mb-2"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "1.25rem",
                    color: COLORS.burgundy,
                  }}
                >
                  {brand.name}
                </h3>
                {brand.description && (
                  <p className="text-xs line-clamp-2 mb-3" style={{ color: COLORS.text }}>{brand.description}</p>
                )}
                <span className="text-xs uppercase tracking-wider" style={{ color: COLORS.vermilion }}>
                  Rent Collection →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/brands">
            <button
              className="px-6 py-3 text-sm font-medium uppercase tracking-wider border-2 transition-all hover:opacity-80"
              style={{ borderColor: COLORS.burgundy, color: COLORS.burgundy }}
            >
              View All Brands
            </button>
          </Link>
        </div>
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

  const displayPosts = posts?.slice(0, 3) || [];

  return (
    <section className="py-14 md:py-20" style={{ backgroundColor: COLORS.lavender }}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: COLORS.burgundy }}>
              From Our Blog
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                lineHeight: 1.1,
                color: COLORS.burgundy,
              }}
            >
              Stories & insights
            </h2>
          </div>
          <Link href="/blog" className="hidden md:flex items-center transition-colors hover:opacity-70" style={{ color: COLORS.burgundy }}>
            <span className="mr-2 text-xs uppercase tracking-wider">View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {displayPosts.map((post) => {
            const imageUrl = getPostImageUrl(post, { width: 300, height: 225 });
            return (
              <Link key={post._id} href={`/blog/${post.slug}`}>
                <article className="group" style={{ backgroundColor: COLORS.white }}>
                  <div className="aspect-[4/3] overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full" style={{ backgroundColor: COLORS.cream }} />
                    )}
                  </div>
                  <div className="p-4">
                    {post.publishedAt && (
                      <p className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.vermilion }}>
                        {format(new Date(post.publishedAt), "MMM d, yyyy")}
                      </p>
                    )}
                    <h3
                      className="group-hover:opacity-70 transition-opacity line-clamp-2 mb-1"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "1rem",
                        color: COLORS.burgundy,
                      }}
                    >
                      {post.title}
                    </h3>
                    <p className="text-xs line-clamp-2" style={{ color: COLORS.text }}>{post.excerpt}</p>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/blog">
            <button
              className="px-6 py-3 text-sm font-medium uppercase tracking-wider border-2 transition-all hover:opacity-80"
              style={{ borderColor: COLORS.burgundy, color: COLORS.burgundy }}
            >
              Read More
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================
// TESTIMONIALS
// ============================================
function Testimonials() {
  const testimonials = [
    { quote: "Finally, a sustainable option that doesn't compromise on style!", author: "Sarah M.", location: "Dublin" },
    { quote: "The quality is incredible and cleaning gives me peace of mind.", author: "Emma K.", location: "Cork" },
    { quote: "Designer clothes without the guilt of waste. Perfect!", author: "Lisa O.", location: "Galway" },
  ];

  return (
    <section className="py-14 md:py-20" style={{ backgroundColor: COLORS.white }}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-8">
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: COLORS.vermilion }}>
            What Parents Say
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              lineHeight: 1.1,
              color: COLORS.burgundy,
            }}
          >
            Loved by families
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <div key={index} className="text-center p-6" style={{ backgroundColor: COLORS.cream }}>
              <p
                className="mb-4 italic"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1rem",
                  lineHeight: 1.5,
                  color: COLORS.burgundy,
                }}
              >
                "{t.quote}"
              </p>
              <p className="text-sm font-medium" style={{ color: COLORS.text }}>{t.author}</p>
              <p className="text-xs opacity-60" style={{ color: COLORS.text }}>{t.location}</p>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-10 pt-10 border-t" style={{ borderColor: COLORS.lavender }}>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { value: "500+", label: "Happy Families" },
              { value: "2,500+", label: "Garments Circulated" },
              { value: "15+", label: "Premium Brands" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "2rem", color: COLORS.burgundy }}>
                  {stat.value}
                </p>
                <p className="text-xs" style={{ color: COLORS.text }}>{stat.label}</p>
              </div>
            ))}
          </div>
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
    <footer style={{ backgroundColor: COLORS.burgundy, color: COLORS.cream }}>
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Seasons
            </Link>
            <p className="mt-3 text-xs opacity-70 leading-relaxed">
              Premium European baby clothing rental. Sustainable fashion for conscious families.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-3 uppercase text-xs tracking-wider">Shop</h4>
            <ul className="space-y-2 text-xs opacity-70">
              <li><Link href="/catalog" className="hover:opacity-100">All Products</Link></li>
              <li><Link href="/brands" className="hover:opacity-100">Brands</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3 uppercase text-xs tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs opacity-70">
              <li><Link href="/about" className="hover:opacity-100">About Us</Link></li>
              <li><Link href="/blog" className="hover:opacity-100">Blog</Link></li>
              <li><Link href="/how-it-works" className="hover:opacity-100">How It Works</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3 uppercase text-xs tracking-wider">Support</h4>
            <ul className="space-y-2 text-xs opacity-70">
              <li><Link href="/faq" className="hover:opacity-100">FAQ</Link></li>
              <li><Link href="/contact" className="hover:opacity-100">Contact</Link></li>
              <li><Link href="/returns" className="hover:opacity-100">Returns</Link></li>
              <li><Link href="/sizing" className="hover:opacity-100">Sizing Guide</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="container mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs opacity-70">
            <p>© 2025 Seasons. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:opacity-100">Privacy</Link>
              <Link href="/terms" className="hover:opacity-100">Terms</Link>
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
export default function HomeV3() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.cream }}>
      <Navigation />
      <main>
        <HeroSection />
        <BenefitsBar />
        <PhilosophySection />
        <MarqueeBanner />
        <CleaningSection />
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
