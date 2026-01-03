const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'h83nldug',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

const blogPost = {
  _type: 'post',
  title: 'The Circular Economy Revolution: How Baby Clothing Rental is Transforming Parenthood',
  slug: {
    _type: 'slug',
    current: 'circular-economy-baby-clothing-rental-sustainable-parenting'
  },
  publishedAt: new Date().toISOString(),
  featured: true,
  excerpt: 'Discover how Seasons is leading the sustainable parenting movement through circular fashion. Learn why renting premium baby clothes saves money, reduces waste, and gives your child access to designer pieces.',
  externalImageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1200&h=630&fit=crop',
  seo: {
    metaTitle: 'Sustainable Baby Clothing Rental | Circular Fashion for Kids',
    metaDescription: 'Join the circular economy revolution. Rent premium baby clothes, save money, reduce waste. Sustainable parenting made simple with Seasons clothing subscription.'
  },
  body: [
    {
      _type: 'block',
      _key: 'intro1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'intro1-span',
          text: "Every parent knows the feeling: you buy an adorable outfit for your little one, and within weeks—sometimes days—they've outgrown it. That beautiful designer piece, worn perhaps twice, now sits in a drawer, waiting for a fate that too often ends in landfill. This wasteful cycle has defined children's fashion for generations. But at Seasons, we believe there's a better way.",
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'h2-1',
      style: 'h2',
      children: [
        {
          _type: 'span',
          _key: 'h2-1-span',
          text: 'The Hidden Cost of Fast Fashion for Babies',
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'p2',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'p2-span',
          text: "The statistics are staggering. The average baby goes through seven different clothing sizes in their first year alone. Parents in Europe spend an average of €800 annually on baby clothes, yet most garments are worn fewer than five times before being discarded. This isn't just a waste of money—it's a waste of precious resources, energy, and the skilled craftsmanship that went into creating each piece.",
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'p3',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'p3-span',
          text: "The environmental impact is equally concerning. The fashion industry produces 10% of global carbon emissions—more than international flights and maritime shipping combined. Children's clothing, with its rapid turnover and short usage cycles, contributes disproportionately to this crisis. Every year, millions of tonnes of perfectly good baby clothes end up in landfills across Europe, where synthetic fibers can take hundreds of years to decompose.",
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'h2-2',
      style: 'h2',
      children: [
        {
          _type: 'span',
          _key: 'h2-2-span',
          text: 'Our Circularity Mission: Redefining Baby Fashion',
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'p4',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'p4-span',
          text: "At Seasons, we've built our entire business model around one revolutionary principle: the best clothes are the ones that get worn. Our baby clothing rental service ensures that every piece in our collection lives its fullest life, passing from family to family, creating memories and reducing waste with each rotation.",
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'p5',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'p5-span',
          text: "Our circular economy approach addresses four critical areas of waste that have plagued traditional children's fashion: waste of space, waste of time, waste of money, and waste of natural resources.",
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'h3-1',
      style: 'h3',
      children: [
        {
          _type: 'span',
          _key: 'h3-1-span',
          text: 'Eliminating Waste of Space',
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'p6',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'p6-span',
          text: "Parents know the constant battle against clutter. Drawers overflow with clothes that no longer fit. Closets bulge with \"just in case\" outfits. Storage bins multiply in basements and attics. With Seasons' kids clothing subscription, you maintain a carefully curated wardrobe of just five premium pieces at any time—all perfectly sized for your child right now. When they're outgrown, simply return them and receive your next selection. No more storage stress, no more overwhelm, just the right clothes at the right time.",
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'h3-2',
      style: 'h3',
      children: [
        {
          _type: 'span',
          _key: 'h3-2-span',
          text: 'Eliminating Waste of Time',
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'p7',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'p7-span',
          text: "How many hours do parents spend shopping for baby clothes? Researching brands, comparing prices, reading reviews, visiting stores, making returns—it adds up to weeks of precious time that could be spent with your family. Our sustainable baby clothes rental service streamlines everything. Browse our curated collection of premium European designer brands from your phone, select your five favorites, and we deliver them to your door. When it's time for the next size, the swap process takes minutes, not hours.",
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'h3-3',
      style: 'h3',
      children: [
        {
          _type: 'span',
          _key: 'h3-3-span',
          text: 'Eliminating Waste of Money',
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'p8',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'p8-span',
          text: "Premium children's clothing comes with premium price tags. A single Studio Koter jacket might retail for €120. A Maru+Bo sweater for €85. The Happymess collection pieces parents love start at €60 each. Building a quality wardrobe through traditional purchasing quickly becomes a significant expense—one that repeats every few months as your child grows.",
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'p9',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'p9-span',
          text: "With our affordable baby clothing subscription at just €70 per month, you access the same designer pieces at a fraction of the cost. Over a year, families typically save 60-70% compared to buying equivalent quality items outright. That's money that can go toward experiences, education, or savings for your child's future.",
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'h3-4',
      style: 'h3',
      children: [
        {
          _type: 'span',
          _key: 'h3-4-span',
          text: 'Eliminating Waste of Resources',
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'p10',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'p10-span',
          text: "Every garment represents an investment of raw materials, water, energy, and human labor. A single cotton t-shirt requires 2,700 liters of water to produce—enough drinking water for one person for 2.5 years. When clothes go unworn, all those resources are wasted. Our eco-friendly children's clothing model ensures each piece achieves maximum use across multiple families, multiplying the value of every resource that went into its creation.",
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'h2-3',
      style: 'h2',
      children: [
        {
          _type: 'span',
          _key: 'h2-3-span',
          text: 'How Our Circular System Works',
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'p11',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'p11-span',
          text: "Our baby clothes rental service Romania and throughout Europe follows a carefully designed circular process. When you subscribe, you select five items from our collection of premium children's wear from brands like Studio Koter, Happymess, and Maru+Bo. These arrive at your door, professionally cleaned and quality-checked.",
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'p12',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'p12-span',
          text: "Your child wears and enjoys these clothes throughout their current size stage. When you're ready to swap—whether that's because they've grown or you simply want fresh styles—you return the items using our pre-paid, eco-friendly packaging. Each returned piece undergoes our rigorous cleaning and inspection process, including ozone sanitization that eliminates 99.9% of bacteria without harsh chemicals.",
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'p13',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'p13-span',
          text: "Items that pass inspection rejoin our active inventory, ready to delight another family. Those showing wear are either repaired by skilled craftspeople or responsibly recycled into new materials. Nothing goes to waste.",
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'h2-4',
      style: 'h2',
      children: [
        {
          _type: 'span',
          _key: 'h2-4-span',
          text: 'Why Premium Quality Matters for Circularity',
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'p14',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'p14-span',
          text: "Not all children's clothes are created equal. Fast fashion pieces, designed for minimal cost, often fall apart after a few washes. They can't survive the multiple cycles required for true circularity. That's why Seasons exclusively partners with premium European designers who prioritize durability, quality materials, and timeless aesthetics.",
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'p15',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'p15-span',
          text: "Our designer baby clothes rental collection features pieces made from organic cotton, responsibly-sourced wool, and other premium materials built to last. These garments maintain their beauty and integrity through dozens of wear cycles, making them perfect for the circular model. When you rent from Seasons, you're not getting compromised quality—you're accessing pieces that retail for €80-150, designed by some of Europe's most respected children's fashion houses.",
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'h2-5',
      style: 'h2',
      children: [
        {
          _type: 'span',
          _key: 'h2-5-span',
          text: 'Join the Sustainable Parenting Movement',
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'p16',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'p16-span',
          text: "The shift toward sustainable kids fashion isn't just a trend—it's a necessary evolution in how we think about consumption. Parents today are increasingly aware of the world they're leaving for their children. They want to make choices that align with their values without sacrificing quality or convenience.",
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'p17',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'p17-span',
          text: "Seasons makes sustainable parenting practical. Our children's clothing subscription service requires no sacrifice—in fact, it enhances your life. Better clothes. Less stress. More savings. Smaller environmental footprint. It's a rare case where doing good for the planet and doing good for your family are exactly the same choice.",
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'p18',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'p18-span',
          text: "We invite you to be part of this revolution. Browse our collection today and discover how circular fashion can transform your approach to dressing your little ones. Together, we can end the cycle of waste and create a better future—one beautifully dressed baby at a time.",
          marks: []
        }
      ],
      markDefs: []
    },
    {
      _type: 'block',
      _key: 'quote1',
      style: 'blockquote',
      children: [
        {
          _type: 'span',
          _key: 'quote1-span',
          text: "\"The most sustainable garment is the one that gets worn. At Seasons, we're making sure every piece lives its fullest life.\"",
          marks: ['em']
        }
      ],
      markDefs: []
    }
  ]
};

async function createPost() {
  try {
    const result = await client.create(blogPost);
    console.log('Blog post created successfully!');
    console.log('ID:', result._id);
    console.log('Slug:', result.slug.current);
    console.log('URL: https://babyseasons.ro/blog/' + result.slug.current);
  } catch (error) {
    console.error('Error creating post:', error.message);
  }
}

createPost();
