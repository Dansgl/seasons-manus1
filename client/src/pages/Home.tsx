import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { 
  Leaf, Shield, Package, RefreshCw, Heart, ChevronDown, Mail,
  Sparkles, Clock, Truck
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Fetch 6 products for preview
  const { data: products } = trpc.products.list.useQuery({});

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thanks for subscribing!");
      setEmail("");
    }
  };

  const benefits = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Circular Fashion",
      description: "Sustainable luxury through rental and reuse"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Ozone Cleaned",
      description: "Medical-grade sanitation for every item"
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Curated Boxes",
      description: "5 premium pieces every 3 months"
    },
    {
      icon: <RefreshCw className="w-8 h-8" />,
      title: "Easy Swaps",
      description: "Refresh your wardrobe quarterly"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Mess No Stress",
      description: "Wear, tear & stains included"
    },
  ];

  const brands = [
    {
      name: "Studio Koter",
      image: "https://medias.eventsunited.net/uploads/product/801180_large_dwXU7ZuoIY2tJz1Gg8eT.jpg",
      filter: "Studio Koter"
    },
    {
      name: "MORI",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop",
      filter: "MORI"
    },
    {
      name: "Mini Rodini",
      image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&h=600&fit=crop",
      filter: "Mini Rodini"
    },
  ];

  const blogPosts = [
    {
      title: "The Rise of Circular Baby Fashion",
      excerpt: "Why rental is the future of sustainable parenting",
      image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=600&fit=crop",
      date: "Dec 15, 2025",
      slug: "circular-baby-fashion"
    },
    {
      title: "How Ozone Cleaning Works",
      excerpt: "The science behind our medical-grade sanitation",
      image: "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=800&h=600&fit=crop",
      date: "Dec 10, 2025",
      slug: "ozone-cleaning-explained"
    },
    {
      title: "Building a Capsule Wardrobe for Baby",
      excerpt: "5 essential pieces for every season",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop",
      date: "Dec 5, 2025",
      slug: "capsule-wardrobe-baby"
    },
    {
      title: "Luxury Brands We Love",
      excerpt: "Meet the designers in our collection",
      image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&h=600&fit=crop",
      date: "Nov 28, 2025",
      slug: "luxury-brands-we-love"
    },
  ];

  const faqs = [
    {
      question: "How does the subscription work?",
      answer: "Select 5 items, pay €70 quarterly, wear for 3 months, then swap for new pieces. Return shipping is included."
    },
    {
      question: "What if my baby damages an item?",
      answer: "Wear, tear, and stains are completely covered. We account for it in our pricing model—no extra charges."
    },
    {
      question: "How are items cleaned?",
      answer: "Every returned item goes through a 5-day Ozone treatment process, providing medical-grade sanitation without harsh chemicals."
    },
    {
      question: "Can I pause my subscription?",
      answer: "Yes! Pause anytime from your dashboard. Resume when you're ready."
    },
    {
      question: "What brands do you carry?",
      answer: "We feature luxury brands like Studio Koter, MORI, Mini Rodini, Bonpoint, Liewood, and more."
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 border-b border-white/20 bg-transparent backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <img src="/seasons-logo-bold.png" alt="SEASONS" className="h-8" />
          </Link>
                  <div className="flex items-center gap-8">
            <Link href="/catalog" className="text-sm text-white hover:text-white/80 transition-colors font-bold tracking-wide uppercase">
              Browse
            </Link>
            <Link href="/blog" className="text-sm text-white hover:text-white/80 transition-colors font-bold tracking-wide uppercase">
              Blog
            </Link>
            {user ? (
              <Link href="/dashboard" className="text-sm text-white hover:text-white/80 transition-colors font-bold tracking-wide uppercase">
                Dashboard
              </Link>
            ) : (
              <Link href="/catalog">
                <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full font-bold">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Opacity Image with Text Highlight */}
      <section className="relative h-[80vh] overflow-hidden">
        <img 
          src="https://medias.eventsunited.net/uploads/product/801180_large_dwXU7ZuoIY2tJz1Gg8eT.jpg"
          alt="Luxury baby clothing"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="inline-block bg-black text-white px-6 py-3 mb-2">
                Luxury Baby Clothing,
              </span>
              <br />
              <span className="inline-block bg-black text-white px-6 py-3 italic font-light">
                Sustainably Yours
              </span>
            </h1>
            <Link href="/catalog">
              <span className="inline-block">
                <Button size="lg" className="bg-white text-black hover:bg-neutral-100 text-lg px-12 py-6 rounded-full font-semibold">
                  SHOP NOW
                </Button>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F5E6D3] text-neutral-800 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-neutral-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - 3x2 Grid */}
      <section className="py-20 bg-[#FDFBF7]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Featured Collection</h2>
            <p className="text-neutral-600">Discover our curated selection of luxury baby clothing</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {products?.slice(0, 6).map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300">
                  <div className="aspect-square overflow-hidden bg-neutral-100">
                    <img 
                      src={product.imageUrl || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=800&fit=crop"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">{product.brand}</p>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-neutral-600 mb-3">{product.category}</p>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <Clock className="w-4 h-4" />
                      <span>Available for rental</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link href="/catalog">
              <span className="inline-block">
                <Button size="lg" variant="outline" className="rounded-full px-12">
                  View All Products
                </Button>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-[#F5E6D3]">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <Mail className="w-12 h-12 mx-auto mb-6 text-neutral-800" />
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Join Our Community</h2>
          <p className="text-neutral-700 mb-8">
            Get styling tips, sustainability insights, and exclusive early access to new collections
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-3 max-w-md mx-auto">
            <Input 
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white"
              required
            />
            <Button type="submit" className="bg-neutral-900 text-white hover:bg-neutral-800">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* Brand Showcase - 3x1 Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Shop by Brand</h2>
            <p className="text-neutral-600">Explore our luxury brand partners</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {brands.map((brand, idx) => (
              <Link key={idx} href={`/catalog?brand=${encodeURIComponent(brand.filter)}`}>
                <div className="relative h-80 overflow-hidden rounded-lg group cursor-pointer">
                  <img 
                    src={brand.image}
                    alt={brand.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-3xl font-bold text-white mb-2">{brand.name}</h3>
                    <p className="text-white/90 text-sm">Explore Collection →</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview - 4 Articles */}
      <section className="py-20 bg-[#FDFBF7]">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-neutral-900 mb-2">From Our Blog</h2>
              <p className="text-neutral-600">Stories, tips, and insights on sustainable parenting</p>
            </div>
            <Link href="/blog">
              <span className="inline-block">
                <Button variant="outline" className="rounded-full">
                  View All Posts
                </Button>
              </span>
            </Link>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {blogPosts.map((post, idx) => (
              <Link key={idx} href={`/blog/${post.slug}`}>
                <Card className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all">
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                    <img 
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-neutral-500 mb-2">{post.date}</p>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-neutral-700 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-neutral-600">{post.excerpt}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-neutral-600">Everything you need to know about Seasons</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card 
                key={idx} 
                className="p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-neutral-900">{faq.question}</h3>
                  <ChevronDown 
                    className={`w-5 h-5 text-neutral-500 transition-transform ${
                      expandedFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {expandedFaq === idx && (
                  <p className="mt-4 text-neutral-600 leading-relaxed">{faq.answer}</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-neutral-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of parents choosing sustainable luxury for their little ones
          </p>
          <Link href="/catalog">
            <span className="inline-block">
              <Button size="lg" className="bg-white text-black hover:bg-neutral-100 text-lg px-12 py-6 rounded-full font-semibold">
                Browse Collection
              </Button>
            </span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white border-t border-neutral-800 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SEASONS</h3>
              <p className="text-neutral-400 text-sm">
                Luxury baby clothing, sustainably yours.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link href="/catalog" className="hover:text-white transition-colors">All Products</Link></li>
                <li><Link href="/catalog?category=Tops" className="hover:text-white transition-colors">Tops</Link></li>
                <li><Link href="/catalog?category=Bottoms" className="hover:text-white transition-colors">Bottoms</Link></li>
                <li><Link href="/catalog?category=Outerwear" className="hover:text-white transition-colors">Outerwear</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">My Account</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-sm text-neutral-400">
            <p>&copy; 2026 Seasons. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
