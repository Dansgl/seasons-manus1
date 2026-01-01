import { drizzle } from "drizzle-orm/mysql2";
import { products, inventoryItems } from "../drizzle/schema.js";
import * as dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

const luxuryProducts = [
  // MORI Brand
  {
    brand: "MORI",
    name: "Mustard Stripe Wrap Bodysuit",
    description: "Soft organic cotton wrap bodysuit with mustard stripes. Perfect for newborns with easy wrap design.",
    category: "bodysuit",
    ageRange: "0-3m",
    season: "all-season",
    rrpPrice: "22.00",
    imageUrl: "/products/mori-mustard-wrap.jpg"
  },
  {
    brand: "MORI",
    name: "Mustard Stripe Zip Sleepsuit",
    description: "Cozy zip-up sleepsuit in soft organic cotton with mustard stripes.",
    category: "sleepsuit",
    ageRange: "0-3m",
    season: "all-season",
    rrpPrice: "32.50",
    imageUrl: "/products/mori-mustard-sleepsuit.jpg"
  },
  {
    brand: "MORI",
    name: "Ruby Stripe Zip Sleepsuit",
    description: "Beautiful ruby striped sleepsuit with convenient zip closure.",
    category: "sleepsuit",
    ageRange: "0-3m",
    season: "all-season",
    rrpPrice: "32.50",
    imageUrl: "/products/mori-ruby-sleepsuit.jpg"
  },
  {
    brand: "MORI",
    name: "Cloud Blue Zip Sleepsuit",
    description: "Soft cloud blue sleepsuit perfect for peaceful sleep.",
    category: "sleepsuit",
    ageRange: "3-6m",
    season: "all-season",
    rrpPrice: "34.00",
    imageUrl: "/products/mori-cloud-blue.jpg"
  },
  {
    brand: "MORI",
    name: "Sage Green Wrap Bodysuit",
    description: "Gentle sage green wrap bodysuit in organic bamboo cotton.",
    category: "bodysuit",
    ageRange: "0-3m",
    season: "all-season",
    rrpPrice: "24.00",
    imageUrl: "/products/mori-sage-wrap.jpg"
  },

  // Mini Rodini Brand
  {
    brand: "Mini Rodini",
    name: "Green Piping Joggers",
    description: "Comfortable organic cotton joggers with contrast piping detail.",
    category: "joggers",
    ageRange: "12-18m",
    season: "all-season",
    rrpPrice: "46.00",
    imageUrl: "/products/mini-rodini-joggers.jpg"
  },
  {
    brand: "Mini Rodini",
    name: "Tiger Stripe Sweatshirt",
    description: "Playful tiger stripe pattern sweatshirt in soft organic cotton.",
    category: "top",
    ageRange: "12-18m",
    season: "winter",
    rrpPrice: "52.00",
    imageUrl: "/products/mini-rodini-tiger.jpg"
  },
  {
    brand: "Mini Rodini",
    name: "Panda Print Bodysuit",
    description: "Adorable panda print bodysuit with snap closures.",
    category: "bodysuit",
    ageRange: "6-12m",
    season: "all-season",
    rrpPrice: "38.00",
    imageUrl: "/products/mini-rodini-panda.jpg"
  },

  // Liewood Brand
  {
    brand: "Liewood",
    name: "Colourblock Thermo Jacket",
    description: "Warm quilted jacket with colorblock design. Perfect for cold days.",
    category: "jacket",
    ageRange: "12-18m",
    season: "winter",
    rrpPrice: "63.00",
    imageUrl: "/products/liewood-jacket.jpg"
  },
  {
    brand: "Liewood",
    name: "Denim Embroidered Overshirt",
    description: "Stylish denim overshirt with cute embroidered details.",
    category: "jacket",
    ageRange: "12-18m",
    season: "all-season",
    rrpPrice: "67.00",
    imageUrl: "/products/liewood-denim.jpg"
  },
  {
    brand: "Liewood",
    name: "Stripe Knit Cardigan",
    description: "Soft knitted cardigan with classic stripe pattern.",
    category: "cardigan",
    ageRange: "6-12m",
    season: "winter",
    rrpPrice: "54.00",
    imageUrl: "/products/liewood-cardigan.jpg"
  },

  // Petit Bateau Brand
  {
    brand: "Petit Bateau",
    name: "Sailor Stripe Bodysuit",
    description: "Classic French sailor stripe bodysuit in soft cotton.",
    category: "bodysuit",
    ageRange: "3-6m",
    season: "all-season",
    rrpPrice: "28.00",
    imageUrl: "/products/petit-bateau-sailor.jpg"
  },
  {
    brand: "Petit Bateau",
    name: "Navy Zip Sleepsuit",
    description: "Comfortable navy sleepsuit with easy zip closure.",
    category: "sleepsuit",
    ageRange: "6-12m",
    season: "all-season",
    rrpPrice: "35.00",
    imageUrl: "/products/petit-bateau-navy.jpg"
  },

  // Bonpoint Brand
  {
    brand: "Bonpoint",
    name: "Liberty Print Dress",
    description: "Exquisite Liberty print dress with delicate details.",
    category: "dress",
    ageRange: "12-18m",
    season: "summer",
    rrpPrice: "98.00",
    imageUrl: "/products/bonpoint-liberty.jpg"
  },
  {
    brand: "Bonpoint",
    name: "Cashmere Cardigan",
    description: "Luxurious cashmere cardigan for special occasions.",
    category: "cardigan",
    ageRange: "6-12m",
    season: "winter",
    rrpPrice: "145.00",
    imageUrl: "/products/bonpoint-cashmere.jpg"
  },

  // Organic Zoo Brand
  {
    brand: "Organic Zoo",
    name: "Olive Ribbed Bodysuit",
    description: "Minimalist ribbed bodysuit in organic cotton.",
    category: "bodysuit",
    ageRange: "0-3m",
    season: "all-season",
    rrpPrice: "26.00",
    imageUrl: "/products/organic-zoo-olive.jpg"
  },
  {
    brand: "Organic Zoo",
    name: "Clay Knit Romper",
    description: "Beautiful hand-knitted romper in clay color.",
    category: "overall",
    ageRange: "3-6m",
    season: "all-season",
    rrpPrice: "58.00",
    imageUrl: "/products/organic-zoo-clay.jpg"
  },

  // Gray Label Brand
  {
    brand: "Gray Label",
    name: "Cream Ribbed Leggings",
    description: "Soft ribbed leggings in neutral cream.",
    category: "bottom",
    ageRange: "6-12m",
    season: "all-season",
    rrpPrice: "32.00",
    imageUrl: "/products/gray-label-leggings.jpg"
  },
  {
    brand: "Gray Label",
    name: "Vintage Pink Sweatshirt",
    description: "Cozy sweatshirt in vintage pink shade.",
    category: "top",
    ageRange: "12-18m",
    season: "winter",
    rrpPrice: "44.00",
    imageUrl: "/products/gray-label-pink.jpg"
  },

  // Konges Sløjd Brand
  {
    brand: "Konges Sløjd",
    name: "Lemon Print Sunsuit",
    description: "Adorable lemon print sunsuit for summer days.",
    category: "overall",
    ageRange: "6-12m",
    season: "summer",
    rrpPrice: "48.00",
    imageUrl: "/products/konges-lemon.jpg"
  },
  {
    brand: "Konges Sløjd",
    name: "Quilted Jacket Terracotta",
    description: "Warm quilted jacket in beautiful terracotta shade.",
    category: "jacket",
    ageRange: "12-18m",
    season: "winter",
    rrpPrice: "72.00",
    imageUrl: "/products/konges-terracotta.jpg"
  },
];

async function seed() {
  console.log("Starting seed...");

  for (const product of luxuryProducts) {
    const result = await db.insert(products).values(product);
    const productId = Number(result[0].insertId);
    
    // Create 3-5 inventory items for each product
    const inventoryCount = Math.floor(Math.random() * 3) + 3; // 3-5 items
    
    for (let i = 0; i < inventoryCount; i++) {
      const sku = `${product.brand.toUpperCase().replace(/\s+/g, '')}-${productId}-${i + 1}`;
      await db.insert(inventoryItems).values({
        productId,
        sku,
        state: 'available',
      });
    }
    
    console.log(`Created ${product.brand} - ${product.name} with ${inventoryCount} inventory items`);
  }

  console.log("Seed completed!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
