/**
 * Script to create blog posts in Sanity
 * Run with: SANITY_API_TOKEN="..." npx tsx scripts/create-blog-posts.ts
 */

import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: "h83nldug",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// First create an author
const author = {
  _type: "author",
  _id: "author-seasons-team",
  name: "Seasons Team",
  slug: { _type: "slug", current: "seasons-team" },
  bio: "The team behind Seasons - passionate about sustainable baby fashion and circular economy.",
};

// Blog posts to create
const blogPosts = [
  {
    _type: "post",
    title: "The Rise of Circular Baby Fashion",
    slug: { _type: "slug", current: "rise-of-circular-baby-fashion" },
    publishedAt: "2025-12-15T10:00:00Z",
    excerpt: "Why rental is the future of sustainable parenting",
    externalImageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80",
    featured: true,
    body: [
      {
        _type: "block",
        _key: "block1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "span1",
            text: "The fashion industry is one of the world's largest polluters, and baby clothing is no exception. With infants outgrowing their wardrobes every few months, the traditional model of buying new clothes creates enormous waste. Enter circular fashion – a revolutionary approach that's transforming how parents dress their little ones.",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "block2",
        style: "h2",
        children: [
          {
            _type: "span",
            _key: "span2",
            text: "What is Circular Fashion?",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "block3",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "span3",
            text: "Circular fashion is a system where clothes are designed, produced, and distributed with their entire lifecycle in mind. Instead of the linear 'take-make-dispose' model, circular fashion focuses on extending the life of garments through rental, resale, repair, and recycling.",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "block4",
        style: "h2",
        children: [
          {
            _type: "span",
            _key: "span4",
            text: "Why It Matters for Baby Clothes",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "block5",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "span5",
            text: "Babies grow incredibly fast – the average infant will go through seven different sizes in their first year alone. This rapid growth means that many baby clothes are worn only a handful of times before being outgrown. By renting premium baby clothes, parents can access high-quality, stylish garments without contributing to textile waste.",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "block6",
        style: "h2",
        children: [
          {
            _type: "span",
            _key: "span6",
            text: "The Environmental Impact",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "block7",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "span7",
            text: "By participating in clothing rental, each family can reduce their carbon footprint significantly. A single garment that passes through multiple families can offset the production of dozens of new items. At Seasons, we're proud to be part of this movement, offering premium European brands in a sustainable, circular model.",
          },
        ],
        markDefs: [],
      },
    ],
  },
  {
    _type: "post",
    title: "How Ozone Cleaning Works",
    slug: { _type: "slug", current: "how-ozone-cleaning-works" },
    publishedAt: "2025-12-10T10:00:00Z",
    excerpt: "The science behind our medical-grade sanitation",
    externalImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80",
    featured: true,
    body: [
      {
        _type: "block",
        _key: "block1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "span1",
            text: "At Seasons, we take the cleanliness of every garment seriously. That's why we use medical-grade ozone cleaning technology – the same sanitization method trusted by hospitals and laboratories worldwide.",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "block2",
        style: "h2",
        children: [
          {
            _type: "span",
            _key: "span2",
            text: "What is Ozone?",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "block3",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "span3",
            text: "Ozone (O3) is a naturally occurring molecule made up of three oxygen atoms. While you might recognize it from the ozone layer protecting Earth from UV rays, controlled ozone has powerful sanitizing properties. It's one of nature's strongest oxidizers, capable of destroying bacteria, viruses, and odors on contact.",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "block4",
        style: "h2",
        children: [
          {
            _type: "span",
            _key: "span4",
            text: "The Cleaning Process",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "block5",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "span5",
            text: "Every garment that returns to Seasons goes through our comprehensive cleaning process: First, items are inspected for stains and damage. Then, they're washed with eco-friendly detergents. Finally, they enter our ozone chamber where concentrated ozone gas penetrates the fabric fibers, eliminating 99.9% of bacteria, viruses, and allergens.",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "block6",
        style: "h2",
        children: [
          {
            _type: "span",
            _key: "span6",
            text: "Safe for Sensitive Skin",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "block7",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "span7",
            text: "Unlike harsh chemical sanitizers, ozone leaves no residue. After treatment, ozone naturally converts back to regular oxygen (O2), leaving clothes fresh, clean, and completely safe for your baby's delicate skin. This makes it ideal for families concerned about chemical sensitivities or allergies.",
          },
        ],
        markDefs: [],
      },
    ],
  },
  {
    _type: "post",
    title: "Building a Capsule Wardrobe for Baby",
    slug: { _type: "slug", current: "building-capsule-wardrobe-baby" },
    publishedAt: "2025-12-05T10:00:00Z",
    excerpt: "5 essential pieces for every season",
    externalImageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80",
    featured: true,
    body: [
      {
        _type: "block",
        _key: "block1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "span1",
            text: "The capsule wardrobe concept – having a curated collection of versatile, high-quality pieces – isn't just for adults. In fact, it makes even more sense for babies, whose rapidly changing sizes mean clothes need to work hard during their brief window of use.",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "block2",
        style: "h2",
        children: [
          {
            _type: "span",
            _key: "span2",
            text: "The 5 Essential Pieces",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "block3",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "span3",
            text: "1. Quality Bodysuits – The foundation of any baby wardrobe. Look for organic cotton with envelope necks for easy changes. 2. Comfortable Joggers – Soft, stretchy pants that move with your baby. 3. Layering Cardigan – Perfect for temperature regulation. 4. All-Weather Outerwear – A good jacket that works in mild to cool conditions. 5. Cozy Sleepsuit – For restful nights and lazy mornings.",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "block4",
        style: "h2",
        children: [
          {
            _type: "span",
            _key: "span4",
            text: "Why Renting Makes Sense",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "block5",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "span5",
            text: "With Seasons, you can build the perfect capsule wardrobe without the commitment of purchasing. Our quarterly boxes let you select 5 pieces that work together, then swap them out as your baby grows or seasons change. It's the ultimate in practical, sustainable baby fashion.",
          },
        ],
        markDefs: [],
      },
    ],
  },
  {
    _type: "post",
    title: "Luxury Brands We Love",
    slug: { _type: "slug", current: "luxury-brands-we-love" },
    publishedAt: "2025-11-28T10:00:00Z",
    excerpt: "Meet the designers in our collection",
    externalImageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80",
    featured: true,
    body: [
      {
        _type: "block",
        _key: "block1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "span1",
            text: "At Seasons, we're passionate about curating the finest European baby fashion. Every brand in our collection is handpicked for their commitment to quality, sustainability, and timeless design. Here are some of our favorites.",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "block2",
        style: "h2",
        children: [
          {
            _type: "span",
            _key: "span2",
            text: "Happymess",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "block3",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "span3",
            text: "Founded in Berlin, Happymess creates playful, colorful pieces that celebrate childhood joy. Their use of organic materials and eco-friendly dyes makes them a perfect fit for conscious parents who don't want to compromise on style.",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "block4",
        style: "h2",
        children: [
          {
            _type: "span",
            _key: "span4",
            text: "Studio Koter",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "block5",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "span5",
            text: "This Dutch brand combines Scandinavian minimalism with functional design. Known for their neutral palettes and thoughtful details, Studio Koter pieces are made to last and transition beautifully between seasons.",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "block6",
        style: "h2",
        children: [
          {
            _type: "span",
            _key: "span6",
            text: "Maru+Bo",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "block7",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "span7",
            text: "A Portuguese label specializing in premium knitwear and elevated basics. Maru+Bo is beloved for their exceptional craftsmanship and attention to detail. Each piece tells a story of traditional European textile heritage reimagined for modern families.",
          },
        ],
        markDefs: [],
      },
    ],
  },
];

async function main() {
  console.log("Creating author...");

  try {
    await sanityClient.createOrReplace(author);
    console.log("✓ Author created: Seasons Team");
  } catch (error) {
    console.error("Failed to create author:", error);
  }

  console.log("\nCreating blog posts...\n");

  for (const post of blogPosts) {
    try {
      // Add author reference
      const postWithAuthor = {
        ...post,
        author: {
          _type: "reference",
          _ref: "author-seasons-team",
        },
      };

      const result = await sanityClient.create(postWithAuthor);
      console.log(`✓ Created: "${post.title}"`);
    } catch (error) {
      console.error(`✗ Failed to create "${post.title}":`, error);
    }
  }

  console.log("\n========================================");
  console.log("Blog posts created successfully!");
  console.log("========================================");
}

main().catch(console.error);
