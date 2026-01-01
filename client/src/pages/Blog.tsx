import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Calendar, Clock } from "lucide-react";

export default function Blog() {
  const posts = [
    {
      title: "The Rise of Circular Baby Fashion",
      excerpt: "Why rental is the future of sustainable parenting. Discover how the circular economy is transforming the way we think about baby clothing.",
      image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&h=800&fit=crop",
      date: "Dec 15, 2025",
      readTime: "5 min read",
      slug: "circular-baby-fashion",
      category: "Sustainability"
    },
    {
      title: "How Ozone Cleaning Works",
      excerpt: "The science behind our medical-grade sanitation process. Learn why ozone treatment is the safest way to clean baby clothing.",
      image: "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=1200&h=800&fit=crop",
      date: "Dec 10, 2025",
      readTime: "4 min read",
      slug: "ozone-cleaning-explained",
      category: "Safety"
    },
    {
      title: "Building a Capsule Wardrobe for Baby",
      excerpt: "5 essential pieces for every season. Simplify your baby's wardrobe with these timeless, versatile items.",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&h=800&fit=crop",
      date: "Dec 5, 2025",
      readTime: "6 min read",
      slug: "capsule-wardrobe-baby",
      category: "Style"
    },
    {
      title: "Luxury Brands We Love",
      excerpt: "Meet the designers in our collection. From Studio Koter to MORI, discover the craftsmanship behind each piece.",
      image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=1200&h=800&fit=crop",
      date: "Nov 28, 2025",
      readTime: "7 min read",
      slug: "luxury-brands-we-love",
      category: "Brands"
    },
    {
      title: "The True Cost of Fast Fashion",
      excerpt: "Understanding the environmental impact of disposable baby clothing and why rental makes sense.",
      image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=1200&h=800&fit=crop",
      date: "Nov 20, 2025",
      readTime: "8 min read",
      slug: "true-cost-fast-fashion",
      category: "Sustainability"
    },
    {
      title: "Seasonal Styling Tips",
      excerpt: "How to dress your baby for comfort and style in every season. Expert tips from our styling team.",
      image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=1200&h=800&fit=crop",
      date: "Nov 15, 2025",
      readTime: "5 min read",
      slug: "seasonal-styling-tips",
      category: "Style"
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Navigation */}
      <nav className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <img src="/seasons-logo-bold.png" alt="SEASONS" className="h-8" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/catalog" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors font-medium">
              Browse
            </Link>
            <Link href="/blog" className="text-sm text-neutral-900 font-semibold">
              Blog
            </Link>
            <Link href="/dashboard" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors font-medium">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h1 className="text-5xl font-bold text-neutral-900 mb-6">The Seasons Journal</h1>
          <p className="text-xl text-neutral-600">
            Stories, tips, and insights on sustainable parenting and luxury baby fashion
          </p>
        </div>
      </section>

      {/* Featured Post */}
      {posts[0] && (
        <section className="pb-12">
          <div className="container mx-auto px-6">
            <Link href={`/blog/${posts[0].slug}`}>
              <Card className="overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="aspect-[4/3] md:aspect-auto overflow-hidden bg-neutral-100">
                    <img 
                      src={posts[0].image}
                      alt={posts[0].title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-12 flex flex-col justify-center">
                    <span className="inline-block px-3 py-1 bg-[#F5E6D3] text-neutral-800 text-xs font-semibold rounded-full mb-4 w-fit">
                      {posts[0].category}
                    </span>
                    <h2 className="text-3xl font-bold text-neutral-900 mb-4">{posts[0].title}</h2>
                    <p className="text-neutral-600 mb-6 leading-relaxed">{posts[0].excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{posts[0].date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{posts[0].readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </section>
      )}

      {/* All Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {posts.slice(1).map((post, idx) => (
              <Link key={idx} href={`/blog/${post.slug}`}>
                <Card className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all h-full">
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                    <img 
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-[#F5E6D3] text-neutral-800 text-xs font-semibold rounded-full mb-3">
                      {post.category}
                    </span>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-3 group-hover:text-neutral-700 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="container mx-auto px-6 text-center">
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
    </div>
  );
}
