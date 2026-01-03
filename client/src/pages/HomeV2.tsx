import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { fetchFeaturedProducts, fetchBrands, fetchFeaturedPosts, getProductImageUrl, getPostImageUrl, type SanityProduct, type SanityBrand, type SanityPost } from "@/lib/sanity";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { format } from "date-fns";
import Navigation from "@/components/Navigation";

// ============================================
// HERO SECTION - Pitch Style
// Large typography with product imagery
// ============================================
function HeroSection() {
  return (
    <section className="min-h-[90vh] bg-[#F9F5F0] relative overflow-hidden">
      {/* Main content */}
      <div className="container mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-0 items-center min-h-[70vh]">
          {/* Left - Typography */}
          <div className="relative z-10">
            <p className="text-[#E94E1B] text-sm font-medium uppercase tracking-wider mb-4">
              Premium Baby Clothing Rental
            </p>
            <h1
              className="text-[#6B2D2D] leading-[0.95]"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(3rem, 10vw, 7rem)",
                fontWeight: 400
              }}
            >
              Dress them<br />
              <span className="italic">beautifully</span>
            </h1>
            <p className="text-[#4A2C2C] text-lg md:text-xl mt-6 max-w-md leading-relaxed">
              Access Europe's finest baby brands through our sustainable rental subscription.
              €70/quarter for 5 designer pieces.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="/catalog">
                <button className="bg-[#E94E1B] text-white px-8 py-4 text-sm font-medium uppercase tracking-wider hover:bg-[#D14516] transition-colors">
                  Start Your Box
                </button>
              </Link>
              <Link href="/brands">
                <button className="border-2 border-[#4A2C2C] text-[#4A2C2C] px-8 py-4 text-sm font-medium uppercase tracking-wider hover:bg-[#4A2C2C] hover:text-white transition-colors">
                  Our Brands
                </button>
              </Link>
            </div>
          </div>

          {/* Right - Product Image */}
          <div className="relative">
            <div className="aspect-[4/5] md:aspect-square relative">
              <img
                src="https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&h=1000&fit=crop&auto=format"
                alt="Baby in designer clothing"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-4 -left-4 md:bottom-8 md:-left-12 bg-[#6B2D2D] text-white p-6 md:p-8">
              <p
                className="text-4xl md:text-5xl mb-1"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                5
              </p>
              <p className="text-sm opacity-80">pieces per quarter</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// PHILOSOPHY SECTION - Bento 50/50 Grid
// Lavender block + Image
// ============================================
function PhilosophySection() {
  return (
    <section className="grid md:grid-cols-2">
      {/* Left - Lavender text block */}
      <div className="bg-[#E8D7E8] p-8 md:p-16 lg:p-20 flex flex-col justify-center min-h-[400px] md:min-h-[600px]">
        <h2
          className="text-[#6B2D2D] mb-6"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            lineHeight: 1.1
          }}
        >
          Our philosophy
        </h2>
        <p className="text-[#4A2C2C] text-base md:text-lg leading-relaxed max-w-md">
          Fashion that actually cares for families. Made with only premium,
          carefully-selected garments from Europe's finest children's brands
          that keep your little ones looking beautiful.
        </p>
      </div>

      {/* Right - Image */}
      <div className="relative min-h-[400px] md:min-h-[600px]">
        <img
          src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=800&fit=crop&auto=format"
          alt="Happy baby in sustainable clothing"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </section>
  );
}

// ============================================
// MARQUEE BANNER - Scrolling text
// ============================================
function MarqueeBanner() {
  const items = [
    "OZONE CLEANED",
    "INSURANCE INCLUDED",
    "FREE SHIPPING",
    "PREMIUM BRANDS",
    "SUSTAINABLE",
    "FOR CONSCIOUS FAMILIES"
  ];

  return (
    <section className="bg-[#6B2D2D] py-4 overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((item, index) => (
          <span key={index} className="text-white text-sm font-medium uppercase tracking-wider mx-8">
            {item}
            <span className="mx-8 opacity-50">•</span>
          </span>
        ))}
      </div>
    </section>
  );
}

// ============================================
// STANDARDS SECTION - Bento Grid (Image + Burgundy block)
// ============================================
function StandardsSection() {
  return (
    <section className="grid md:grid-cols-2">
      {/* Left - Image */}
      <div className="relative min-h-[400px] md:min-h-[600px] order-2 md:order-1">
        <img
          src="https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=800&h=800&fit=crop&auto=format"
          alt="Baby clothing quality"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Right - Burgundy text block */}
      <div className="bg-[#6B2D2D] p-8 md:p-16 lg:p-20 flex flex-col justify-center min-h-[400px] md:min-h-[600px] order-1 md:order-2">
        <h2
          className="text-[#F9F5F0] mb-6"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            lineHeight: 1.1
          }}
        >
          The Seasons standard
        </h2>
        <p className="text-[#F9F5F0] opacity-80 text-base md:text-lg leading-relaxed max-w-md">
          We set our standards high, and so should you. Every garment is
          professionally cleaned with medical-grade ozone technology and
          inspected for quality before reaching your door.
        </p>
        <Link href="/catalog" className="mt-8 inline-block">
          <button className="bg-white text-[#6B2D2D] px-8 py-4 text-sm font-medium uppercase tracking-wider hover:bg-[#F9F5F0] transition-colors">
            Browse Collection
          </button>
        </Link>
      </div>
    </section>
  );
}

// ============================================
// HOW IT WORKS - Simple 3 columns
// ============================================
function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Browse & Pick 5",
      description: "Choose any 5 pieces from our curated collection of premium European baby brands."
    },
    {
      number: "02",
      title: "Wear & Enjoy",
      description: "Dress your little one in luxury for 3 months. Spills and stains? We've got you covered."
    },
    {
      number: "03",
      title: "Return & Refresh",
      description: "Send back with our prepaid label, then pick 5 new pieces for the next season."
    }
  ];

  return (
    <section className="bg-[#F9F5F0] py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <p className="text-[#E94E1B] text-sm font-medium uppercase tracking-wider text-center mb-4">
          How It Works
        </p>
        <h2
          className="text-[#6B2D2D] text-center mb-16"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            lineHeight: 1.1
          }}
        >
          Simple as 1, 2, 3
        </h2>

        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <span
                className="text-[#E8D7E8] block mb-4"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "5rem",
                  lineHeight: 1
                }}
              >
                {step.number}
              </span>
              <h3 className="text-[#6B2D2D] text-xl font-medium mb-3">{step.title}</h3>
              <p className="text-[#4A2C2C] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// FEATURED PRODUCTS - Product Grid
// ============================================
function FeaturedProducts() {
  const { data: products, isLoading } = useQuery<SanityProduct[]>({
    queryKey: ["sanity", "featuredProducts"],
    queryFn: fetchFeaturedProducts,
  });

  const displayProducts = products?.slice(0, 4) || [];

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[#E94E1B] text-sm font-medium uppercase tracking-wider mb-4">
              Featured
            </p>
            <h2
              className="text-[#6B2D2D]"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                lineHeight: 1.1
              }}
            >
              Bestsellers
            </h2>
          </div>
          <Link href="/catalog" className="hidden md:flex items-center text-[#6B2D2D] hover:text-[#E94E1B] transition-colors">
            <span className="mr-2 text-sm uppercase tracking-wider">View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#E8D7E8] mb-4" />
                <div className="h-4 bg-[#E8D7E8] w-1/3 mb-2" />
                <div className="h-5 bg-[#E8D7E8] w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {displayProducts.map((product) => {
              const imageUrl = getProductImageUrl(product, { width: 400, height: 500 });
              return (
                <Link key={product._id} href={`/product/${product.slug}`}>
                  <div className="group">
                    <div className="aspect-[3/4] bg-[#F9F5F0] overflow-hidden mb-4">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-12 h-12 text-[#E8D7E8]" />
                        </div>
                      )}
                    </div>
                    <p className="text-[#E94E1B] text-xs uppercase tracking-wider mb-1">
                      {product.brand?.name}
                    </p>
                    <h3
                      className="text-[#6B2D2D] group-hover:text-[#E94E1B] transition-colors line-clamp-2"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {product.name}
                    </h3>
                    <p className="text-[#4A2C2C] text-sm mt-1">RRP €{product.rrpPrice}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-10 text-center md:hidden">
          <Link href="/catalog">
            <button className="border-2 border-[#6B2D2D] text-[#6B2D2D] px-8 py-4 text-sm font-medium uppercase tracking-wider hover:bg-[#6B2D2D] hover:text-white transition-colors">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================
// CTA SECTION - Full-width burgundy
// ============================================
function CTASection() {
  return (
    <section className="bg-[#6B2D2D] py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <h2
          className="text-[#F9F5F0] mb-6"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2rem, 5vw, 4rem)",
            lineHeight: 1.1
          }}
        >
          Ready to start your subscription?
        </h2>
        <p className="text-[#F9F5F0] opacity-80 text-lg max-w-2xl mx-auto mb-10">
          Join hundreds of families who've discovered a smarter way to dress their little ones.
          €70/quarter for 5 premium pieces – delivered to your door.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/catalog">
            <button className="bg-[#E94E1B] text-white px-10 py-4 text-sm font-medium uppercase tracking-wider hover:bg-[#D14516] transition-colors">
              Start Your Subscription
            </button>
          </Link>
          <Link href="/brands">
            <button className="border-2 border-white/30 text-white px-10 py-4 text-sm font-medium uppercase tracking-wider hover:bg-white/10 transition-colors">
              Explore Brands
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================
// BRANDS SHOWCASE - Lavender background
// ============================================
function BrandsShowcase() {
  const { data: brands } = useQuery<SanityBrand[]>({
    queryKey: ["sanity", "brands"],
    queryFn: fetchBrands,
  });

  const displayBrands = brands?.slice(0, 3) || [];

  return (
    <section className="bg-[#E8D7E8] py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <p className="text-[#6B2D2D] text-sm font-medium uppercase tracking-wider mb-4">
            Our Partners
          </p>
          <h2
            className="text-[#6B2D2D]"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 1.1
            }}
          >
            Premium European brands
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {displayBrands.map((brand) => (
            <Link key={brand._id} href={`/catalog?brand=${encodeURIComponent(brand.name)}`}>
              <div className="bg-white p-8 md:p-12 text-center hover:shadow-lg transition-shadow">
                <h3
                  className="text-[#6B2D2D] mb-3"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "1.75rem"
                  }}
                >
                  {brand.name}
                </h3>
                {brand.description && (
                  <p className="text-[#4A2C2C] text-sm line-clamp-2 mb-4">{brand.description}</p>
                )}
                <span className="text-[#E94E1B] text-sm uppercase tracking-wider">
                  Shop Collection →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/brands">
            <button className="border-2 border-[#6B2D2D] text-[#6B2D2D] px-8 py-4 text-sm font-medium uppercase tracking-wider hover:bg-[#6B2D2D] hover:text-white transition-colors">
              View All Brands
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================
// BLOG PREVIEW - Cream background
// ============================================
function BlogPreview() {
  const { data: posts } = useQuery<SanityPost[]>({
    queryKey: ["sanity", "featuredPosts"],
    queryFn: fetchFeaturedPosts,
  });

  const displayPosts = posts?.slice(0, 3) || [];

  return (
    <section className="bg-[#F9F5F0] py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[#E94E1B] text-sm font-medium uppercase tracking-wider mb-4">
              From Our Blog
            </p>
            <h2
              className="text-[#6B2D2D]"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                lineHeight: 1.1
              }}
            >
              Stories & insights
            </h2>
          </div>
          <Link href="/blog" className="hidden md:flex items-center text-[#6B2D2D] hover:text-[#E94E1B] transition-colors">
            <span className="mr-2 text-sm uppercase tracking-wider">View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {displayPosts.map((post) => {
            const imageUrl = getPostImageUrl(post, { width: 400, height: 300 });
            return (
              <Link key={post._id} href={`/blog/${post.slug}`}>
                <article className="group">
                  <div className="aspect-[4/3] bg-[#E8D7E8] overflow-hidden mb-4">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                  {post.publishedAt && (
                    <p className="text-[#E94E1B] text-xs uppercase tracking-wider mb-2">
                      {format(new Date(post.publishedAt), "MMM d, yyyy")}
                    </p>
                  )}
                  <h3
                    className="text-[#6B2D2D] group-hover:text-[#E94E1B] transition-colors line-clamp-2 mb-2"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "1.25rem"
                    }}
                  >
                    {post.title}
                  </h3>
                  <p className="text-[#4A2C2C] text-sm line-clamp-2">{post.excerpt}</p>
                </article>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link href="/blog">
            <button className="border-2 border-[#6B2D2D] text-[#6B2D2D] px-8 py-4 text-sm font-medium uppercase tracking-wider hover:bg-[#6B2D2D] hover:text-white transition-colors">
              Read More
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================
// TESTIMONIALS - Simple grid
// ============================================
function Testimonials() {
  const testimonials = [
    {
      quote: "Finally, a sustainable option that doesn't compromise on style. My daughter looks amazing!",
      author: "Sarah M.",
      location: "Dublin"
    },
    {
      quote: "The quality is incredible and the ozone cleaning gives me total peace of mind.",
      author: "Emma K.",
      location: "Cork"
    },
    {
      quote: "Love that I can dress my son in designer clothes without the guilt of waste.",
      author: "Lisa O.",
      location: "Galway"
    }
  ];

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <p className="text-[#E94E1B] text-sm font-medium uppercase tracking-wider mb-4">
            What Parents Say
          </p>
          <h2
            className="text-[#6B2D2D]"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 1.1
            }}
          >
            Loved by families
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="text-center">
              <p
                className="text-[#6B2D2D] mb-6 italic"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.25rem",
                  lineHeight: 1.5
                }}
              >
                "{testimonial.quote}"
              </p>
              <p className="text-[#4A2C2C] font-medium">{testimonial.author}</p>
              <p className="text-[#4A2C2C] text-sm opacity-60">{testimonial.location}</p>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 pt-16 border-t border-[#E8D7E8]">
          <div className="flex flex-wrap justify-center gap-12 md:gap-20">
            <div className="text-center">
              <p
                className="text-[#6B2D2D]"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "2.5rem"
                }}
              >
                500+
              </p>
              <p className="text-[#4A2C2C] text-sm">Happy Families</p>
            </div>
            <div className="text-center">
              <p
                className="text-[#6B2D2D]"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "2.5rem"
                }}
              >
                2,500+
              </p>
              <p className="text-[#4A2C2C] text-sm">Garments Circulated</p>
            </div>
            <div className="text-center">
              <p
                className="text-[#6B2D2D]"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "2.5rem"
                }}
              >
                15+
              </p>
              <p className="text-[#4A2C2C] text-sm">Premium Brands</p>
            </div>
            <div className="text-center">
              <p
                className="text-[#6B2D2D]"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "2.5rem"
                }}
              >
                4.9/5
              </p>
              <p className="text-[#4A2C2C] text-sm">Customer Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FAQ PREVIEW - Accordion style
// ============================================
function FAQSection() {
  const faqs = [
    {
      question: "How does the cleaning process work?",
      answer: "Every garment is professionally cleaned using medical-grade ozone technology – the same method trusted by hospitals. This eliminates 99.9% of bacteria, viruses, and allergens without harsh chemicals."
    },
    {
      question: "What if my baby stains or damages clothing?",
      answer: "Normal wear and tear is completely covered by our insurance. Spit-ups, food stains, and minor damage are all part of being a baby. We've got you covered!"
    },
    {
      question: "How does sizing work?",
      answer: "You select your baby's current age range when browsing. Our clothes are sized generously, and we include detailed measurements for each item."
    }
  ];

  return (
    <section className="bg-[#F9F5F0] py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-[#E94E1B] text-sm font-medium uppercase tracking-wider mb-4">
            FAQ
          </p>
          <h2
            className="text-[#6B2D2D]"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 1.1
            }}
          >
            Common questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group bg-white">
              <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                <span
                  className="text-[#6B2D2D] pr-4"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {faq.question}
                </span>
                <span className="text-[#E94E1B] text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="text-[#4A2C2C]">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-[#4A2C2C] mb-4">Have more questions?</p>
          <Link href="mailto:hello@seasons.ie">
            <button className="border-2 border-[#6B2D2D] text-[#6B2D2D] px-8 py-4 text-sm font-medium uppercase tracking-wider hover:bg-[#6B2D2D] hover:text-white transition-colors">
              Contact Us
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FOOTER - Burgundy background
// ============================================
function Footer() {
  return (
    <footer className="bg-[#6B2D2D] text-[#F9F5F0]">
      {/* Main Footer */}
      <div className="container mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="text-2xl tracking-wide"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Seasons
            </Link>
            <p className="mt-4 text-sm opacity-70 leading-relaxed">
              Premium European baby clothing rental. Sustainable fashion for conscious families.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-medium mb-4 uppercase text-sm tracking-wider">Shop</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li><Link href="/catalog" className="hover:opacity-100 transition-opacity">Browse Collection</Link></li>
              <li><Link href="/brands" className="hover:opacity-100 transition-opacity">Our Brands</Link></li>
              <li><Link href="/catalog?category=bodysuit" className="hover:opacity-100 transition-opacity">Bodysuits</Link></li>
              <li><Link href="/catalog?category=outerwear" className="hover:opacity-100 transition-opacity">Outerwear</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-medium mb-4 uppercase text-sm tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li><Link href="/about" className="hover:opacity-100 transition-opacity">About Us</Link></li>
              <li><Link href="/blog" className="hover:opacity-100 transition-opacity">Blog</Link></li>
              <li><Link href="/sustainability" className="hover:opacity-100 transition-opacity">Sustainability</Link></li>
              <li><Link href="/careers" className="hover:opacity-100 transition-opacity">Careers</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-medium mb-4 uppercase text-sm tracking-wider">Support</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li><Link href="/faq" className="hover:opacity-100 transition-opacity">FAQ</Link></li>
              <li><Link href="/contact" className="hover:opacity-100 transition-opacity">Contact</Link></li>
              <li><Link href="/returns" className="hover:opacity-100 transition-opacity">Returns</Link></li>
              <li><Link href="/sizing" className="hover:opacity-100 transition-opacity">Sizing Guide</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-70">
            <p>© 2025 Seasons. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:opacity-100 transition-opacity">Privacy</Link>
              <Link href="/terms" className="hover:opacity-100 transition-opacity">Terms</Link>
              <Link href="/cookies" className="hover:opacity-100 transition-opacity">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// MAIN HOME PAGE COMPONENT
// ============================================
export default function HomeV2() {
  return (
    <div className="min-h-screen bg-[#F9F5F0]">
      <Navigation />

      <main>
        <HeroSection />
        <PhilosophySection />
        <MarqueeBanner />
        <StandardsSection />
        <HowItWorks />
        <FeaturedProducts />
        <CTASection />
        <BrandsShowcase />
        <BlogPreview />
        <Testimonials />
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}
