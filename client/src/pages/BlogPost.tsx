import { Button } from "@/components/ui/button";
import { Link, useParams } from "wouter";
import { Calendar, Clock, ArrowLeft } from "lucide-react";

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug;

  // Sample blog post data (in production, fetch from database)
  const posts: Record<string, any> = {
    "circular-baby-fashion": {
      title: "The Rise of Circular Baby Fashion",
      image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&h=800&fit=crop",
      date: "Dec 15, 2025",
      readTime: "5 min read",
      category: "Sustainability",
      content: `
        <p>The fashion industry is undergoing a profound transformation, and baby clothing is no exception. As parents become more conscious of their environmental impact, circular fashion models are emerging as the sustainable solution we've been waiting for.</p>

        <h2>What is Circular Fashion?</h2>
        <p>Circular fashion is a regenerative system where clothing is designed, produced, and used in ways that enable it to circulate in society for as long as possible. Instead of the traditional linear model of "take, make, dispose," circular fashion keeps garments in use through rental, resale, repair, and recycling.</p>

        <h2>Why It Matters for Baby Clothing</h2>
        <p>Babies outgrow their clothes at an astonishing rate—often within just a few months. This rapid turnover creates enormous waste. The average baby goes through seven clothing sizes in their first two years, resulting in hundreds of garments that are barely worn before being discarded.</p>

        <p>Traditional baby clothing production contributes to:</p>
        <ul>
          <li>Excessive water consumption in textile manufacturing</li>
          <li>Chemical pollution from dyes and treatments</li>
          <li>Carbon emissions from production and shipping</li>
          <li>Landfill waste from discarded garments</li>
        </ul>

        <h2>The Rental Revolution</h2>
        <p>Clothing rental offers a practical solution to this problem. By sharing high-quality garments among multiple families, we dramatically reduce the environmental footprint of each piece while making luxury brands accessible to more parents.</p>

        <p>At Seasons, we've designed our entire system around circularity:</p>
        <ul>
          <li><strong>Curated Selection:</strong> We choose durable, timeless pieces from luxury brands that are built to last</li>
          <li><strong>Medical-Grade Cleaning:</strong> Our Ozone treatment process ensures every item is perfectly sanitized between uses</li>
          <li><strong>Extended Lifecycle:</strong> Each garment circulates through multiple families, maximizing its useful life</li>
          <li><strong>Responsible Retirement:</strong> When items reach the end of their rental life, we explore recycling and upcycling options</li>
        </ul>

        <h2>The Future is Circular</h2>
        <p>As we look ahead, circular fashion isn't just a trend—it's becoming the new standard. Parents are realizing that sustainable choices don't require sacrifice. In fact, rental models often provide access to higher-quality clothing than traditional purchasing would allow.</p>

        <p>By choosing circular fashion for your baby, you're not just making a practical decision—you're investing in a more sustainable future for the next generation.</p>
      `
    },
    "ozone-cleaning-explained": {
      title: "How Ozone Cleaning Works",
      image: "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=1200&h=800&fit=crop",
      date: "Dec 10, 2025",
      readTime: "4 min read",
      category: "Safety",
      content: `
        <p>When it comes to baby clothing, safety and hygiene are paramount. That's why we use ozone treatment—a medical-grade sanitation process that's both effective and environmentally friendly.</p>

        <h2>What is Ozone?</h2>
        <p>Ozone (O₃) is a naturally occurring molecule made up of three oxygen atoms. It's a powerful oxidant that has been used for decades in medical facilities, water treatment plants, and food processing to eliminate bacteria, viruses, and odors.</p>

        <h2>How Does Ozone Cleaning Work?</h2>
        <p>Our ozone treatment process involves several carefully controlled steps:</p>

        <ol>
          <li><strong>Initial Inspection:</strong> Each returned item is inspected for damage and sorted by fabric type</li>
          <li><strong>Pre-Treatment:</strong> Items undergo gentle washing to remove visible soil</li>
          <li><strong>Ozone Chamber:</strong> Garments are placed in a sealed chamber where ozone gas is introduced</li>
          <li><strong>Oxidation:</strong> Ozone molecules penetrate fabric fibers, breaking down bacteria, viruses, and odor-causing compounds at a molecular level</li>
          <li><strong>Conversion:</strong> After treatment, ozone naturally converts back to regular oxygen (O₂), leaving no chemical residue</li>
          <li><strong>Quality Check:</strong> Items are inspected again before being marked as available for rental</li>
        </ol>

        <h2>Why Ozone Over Traditional Methods?</h2>
        <p>Compared to conventional laundry methods, ozone treatment offers several advantages:</p>

        <ul>
          <li><strong>No Harsh Chemicals:</strong> Unlike bleach or harsh detergents, ozone leaves no chemical residue on fabrics</li>
          <li><strong>Deeper Penetration:</strong> Ozone gas reaches areas that water and detergent cannot</li>
          <li><strong>Fabric Preservation:</strong> Gentler on delicate fibers, extending garment lifespan</li>
          <li><strong>Environmental Benefits:</strong> Uses less water and energy than traditional washing</li>
          <li><strong>Allergen Reduction:</strong> Effectively eliminates common allergens without introducing new ones</li>
        </ul>

        <h2>The 5-Day Quarantine</h2>
        <p>After ozone treatment, every item goes through a 5-day quarantine period. This ensures complete sanitation and allows us to conduct thorough quality checks before the item returns to circulation.</p>

        <h2>Safety for Your Baby</h2>
        <p>Ozone treatment is recognized by health authorities worldwide as safe and effective. It's the same technology used to sanitize medical equipment and purify drinking water. When you receive your Seasons box, you can be confident that every item has been treated to the highest hygiene standards.</p>
      `
    },
    "capsule-wardrobe-baby": {
      title: "Building a Capsule Wardrobe for Baby",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&h=800&fit=crop",
      date: "Dec 5, 2025",
      readTime: "6 min read",
      category: "Style",
      content: `
        <p>A capsule wardrobe isn't just for adults—it's a game-changing approach to dressing your baby with less stress and more style. By focusing on versatile, high-quality pieces that mix and match effortlessly, you can simplify your life while ensuring your little one always looks adorable.</p>

        <h2>What is a Baby Capsule Wardrobe?</h2>
        <p>A capsule wardrobe consists of a small collection of essential items that work together harmoniously. For babies, this typically means 5-7 key pieces that can be mixed, matched, and layered to create multiple outfits.</p>

        <h2>The 5 Essential Pieces</h2>

        <h3>1. The Perfect Bodysuit</h3>
        <p>A high-quality bodysuit in a neutral color is the foundation of any baby wardrobe. Look for soft, breathable fabrics like organic cotton. Envelope necklines make dressing easier, and snap closures at the bottom simplify diaper changes.</p>

        <h3>2. Versatile Bottoms</h3>
        <p>Choose comfortable joggers or leggings that pair well with everything. Elastic waistbands are essential for comfort and easy changes. Opt for neutral tones that complement your other pieces.</p>

        <h3>3. Layering Cardigan</h3>
        <p>A lightweight cardigan is perfect for temperature regulation. Choose a style that works for both casual and slightly dressy occasions. Neutral colors like cream, gray, or soft beige are most versatile.</p>

        <h3>4. Statement Sleepsuit</h3>
        <p>One beautiful sleepsuit in a subtle pattern or color adds personality to your capsule. This piece can serve double duty for both day and night, making it incredibly practical.</p>

        <h3>5. Outerwear</h3>
        <p>Depending on the season, choose either a lightweight jacket or a cozy coat. This is where you can introduce a pop of color or interesting texture while maintaining functionality.</p>

        <h2>Benefits of a Capsule Approach</h2>

        <ul>
          <li><strong>Simplified Decisions:</strong> Everything matches, so getting dressed is effortless</li>
          <li><strong>Quality Over Quantity:</strong> Invest in fewer, better-made pieces</li>
          <li><strong>Reduced Waste:</strong> Buy less, choose better, make it last</li>
          <li><strong>Travel-Friendly:</strong> Pack light knowing everything coordinates</li>
          <li><strong>Cost-Effective:</strong> Especially when renting luxury pieces through Seasons</li>
        </ul>

        <h2>Seasonal Adjustments</h2>
        <p>The beauty of the capsule wardrobe is its adaptability. As seasons change, simply swap out one or two pieces:</p>

        <ul>
          <li><strong>Summer:</strong> Replace the cardigan with a lightweight linen shirt</li>
          <li><strong>Winter:</strong> Add a warm knit sweater and thermal layers</li>
          <li><strong>Spring/Fall:</strong> Focus on layering pieces that work in fluctuating temperatures</li>
        </ul>

        <h2>The Seasons Advantage</h2>
        <p>With Seasons, building a capsule wardrobe is effortless. Our curated boxes are designed with the capsule concept in mind—each quarterly selection includes 5 pieces that work together beautifully. As your baby grows, simply swap for the next size without the commitment of purchasing.</p>

        <p>This approach combines the simplicity of a capsule wardrobe with the sustainability of rental fashion, giving you the best of both worlds.</p>
      `
    },
    "luxury-brands-we-love": {
      title: "Luxury Brands We Love",
      image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=1200&h=800&fit=crop",
      date: "Nov 28, 2025",
      readTime: "7 min read",
      category: "Brands",
      content: `
        <p>At Seasons, we're passionate about bringing you the finest baby clothing from brands that share our values of quality, sustainability, and timeless design. Let's explore the designers behind our collection.</p>

        <h2>Studio Koter</h2>
        <p>Founded in Amsterdam, Studio Koter creates clothing that celebrates childhood through thoughtful design and sustainable practices. Their pieces are characterized by:</p>

        <ul>
          <li>Organic, GOTS-certified fabrics</li>
          <li>Timeless silhouettes that transcend trends</li>
          <li>Attention to detail in every stitch</li>
          <li>Gender-neutral designs</li>
        </ul>

        <p>Studio Koter's philosophy aligns perfectly with our circular model—their garments are built to last and designed to be loved by multiple children over time.</p>

        <h2>MORI</h2>
        <p>British brand MORI has revolutionized baby basics with their signature bamboo and organic cotton blends. What sets MORI apart:</p>

        <ul>
          <li>Incredibly soft, temperature-regulating fabrics</li>
          <li>Clever design features like expandable necklines</li>
          <li>Commitment to sustainable sourcing</li>
          <li>Minimalist aesthetic that never goes out of style</li>
        </ul>

        <p>MORI's pieces are particularly well-suited to rental—they maintain their softness and shape even after multiple wears and washes.</p>

        <h2>Mini Rodini</h2>
        <p>Swedish brand Mini Rodini brings playful prints and bold colors to sustainable children's fashion. Their collection features:</p>

        <ul>
          <li>Whimsical, nature-inspired prints</li>
          <li>Organic and recycled materials</li>
          <li>Unisex designs that challenge gender norms</li>
          <li>Durability that stands up to active play</li>
        </ul>

        <p>Mini Rodini proves that sustainable fashion doesn't have to be boring—their pieces add joy and personality to any wardrobe.</p>

        <h2>Bonpoint</h2>
        <p>The epitome of French luxury for children, Bonpoint has been crafting exquisite pieces since 1975. What makes Bonpoint special:</p>

        <ul>
          <li>Impeccable craftsmanship and attention to detail</li>
          <li>Timeless designs inspired by Parisian elegance</li>
          <li>Premium natural fibers</li>
          <li>Heirloom quality that lasts for generations</li>
        </ul>

        <p>Bonpoint pieces are investment items that truly shine in a rental model—more families can experience this level of luxury without the prohibitive price tag.</p>

        <h2>Liewood</h2>
        <p>Danish brand Liewood combines Scandinavian simplicity with practical functionality. Their collection includes:</p>

        <ul>
          <li>Clean lines and muted color palettes</li>
          <li>Organic cotton and sustainable materials</li>
          <li>Versatile pieces that grow with your child</li>
          <li>Focus on comfort and ease of wear</li>
        </ul>

        <p>Liewood's minimalist aesthetic makes their pieces perfect for mixing and matching within a capsule wardrobe.</p>

        <h2>Why These Brands?</h2>
        <p>We've carefully selected brands that meet our strict criteria:</p>

        <ol>
          <li><strong>Quality:</strong> Garments must withstand multiple rental cycles</li>
          <li><strong>Sustainability:</strong> Commitment to ethical production and eco-friendly materials</li>
          <li><strong>Design:</strong> Timeless styles that won't look dated</li>
          <li><strong>Comfort:</strong> Soft, breathable fabrics suitable for sensitive baby skin</li>
          <li><strong>Values:</strong> Brands that align with our circular fashion mission</li>
        </ol>

        <p>By partnering with these exceptional brands, we're able to offer you a curated selection that combines luxury, sustainability, and practicality—the perfect combination for modern parents.</p>
      `
    }
  };

  const post = slug ? posts[slug] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Post Not Found</h1>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Navigation */}
      <nav className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <img src="/seasons-logo-bold.png" alt="SEASONS" className="h-8" />
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/catalog" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors font-bold tracking-wide uppercase">
              Browse
            </Link>
            <Link href="/blog" className="text-sm text-neutral-900 font-bold tracking-wide uppercase">
              Blog
            </Link>
            <Link href="/dashboard" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors font-bold tracking-wide uppercase">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="container mx-auto px-6 py-8">
        <Link href="/blog">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Hero Image */}
      <div className="container mx-auto px-6 mb-12">
        <div className="aspect-[21/9] overflow-hidden rounded-2xl bg-neutral-100">
          <img 
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-6 max-w-3xl pb-20">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-[#F5E6D3] text-neutral-800 text-xs font-semibold rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="text-5xl font-bold text-neutral-900 mb-6">{post.title}</h1>
          <div className="flex items-center gap-6 text-sm text-neutral-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        <div 
          className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-neutral-900 prose-p:text-neutral-700 prose-p:leading-relaxed prose-a:text-neutral-900 prose-strong:text-neutral-900 prose-ul:text-neutral-700 prose-ol:text-neutral-700"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div className="mt-16 p-8 bg-neutral-900 text-white rounded-2xl text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Experience Luxury Baby Fashion?</h3>
          <p className="text-neutral-300 mb-6">
            Start your sustainable journey with Seasons today
          </p>
          <Link href="/catalog">
            <span className="inline-block">
              <Button size="lg" className="bg-white text-black hover:bg-neutral-100 rounded-full px-8">
                Browse Collection
              </Button>
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}
