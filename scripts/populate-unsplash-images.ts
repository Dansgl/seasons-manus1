/**
 * Script to populate Sanity products with Unsplash images
 * Run with: npx tsx scripts/populate-unsplash-images.ts
 */

import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: "h83nldug",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Curated Unsplash baby clothing images by category
// Using Unsplash Source URLs which auto-resize
const unsplashImages: Record<string, string[]> = {
  bodysuit: [
    "https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80",
    "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80",
    "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80",
    "https://images.unsplash.com/photo-1565462905097-5e701c31de8c?q=80",
  ],
  sleepsuit: [
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80",
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80",
    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80",
  ],
  joggers: [
    "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80",
    "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80",
    "https://images.unsplash.com/photo-1544776193-352d25ca82cd?q=80",
    "https://images.unsplash.com/photo-1607453998774-d533f65dac99?q=80",
  ],
  jacket: [
    "https://images.unsplash.com/photo-1566206091558-7f218b696731?q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80",
    "https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?q=80",
    "https://images.unsplash.com/photo-1602407294553-6ac9170b3ed0?q=80",
  ],
  cardigan: [
    "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80",
    "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80",
    "https://images.unsplash.com/photo-1544776193-352d25ca82cd?q=80",
    "https://images.unsplash.com/photo-1607453998774-d533f65dac99?q=80",
  ],
  top: [
    "https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80",
    "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80",
    "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80",
    "https://images.unsplash.com/photo-1607453998774-d533f65dac99?q=80",
  ],
  bottom: [
    "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80",
    "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80",
    "https://images.unsplash.com/photo-1544776193-352d25ca82cd?q=80",
    "https://images.unsplash.com/photo-1607453998774-d533f65dac99?q=80",
  ],
  dress: [
    "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80",
    "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80",
    "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80",
  ],
  outerwear: [
    "https://images.unsplash.com/photo-1566206091558-7f218b696731?q=80",
    "https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?q=80",
    "https://images.unsplash.com/photo-1602407294553-6ac9170b3ed0?q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80",
  ],
  swimwear: [
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80",
    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80",
    "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80",
  ],
  hat: [
    "https://images.unsplash.com/photo-1517256673644-36ad11246d21?q=80",
    "https://images.unsplash.com/photo-1503919005314-30d93d07d823?q=80",
    "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80",
    "https://images.unsplash.com/photo-1559526323-cb2f2fe2591b?q=80",
  ],
  shoes: [
    "https://images.unsplash.com/photo-1555048235-86c7c8fa5f35?q=80",
    "https://images.unsplash.com/photo-1594150878496-a921e4e37f16?q=80",
    "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80",
    "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80",
  ],
  pjs: [
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80",
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80",
    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80",
  ],
  overall: [
    "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80",
    "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80",
    "https://images.unsplash.com/photo-1544776193-352d25ca82cd?q=80",
    "https://images.unsplash.com/photo-1607453998774-d533f65dac99?q=80",
  ],
};

// Default fallback images if category not matched
const defaultImages = [
  "https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80",
  "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80",
  "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80",
  "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80",
  "https://images.unsplash.com/photo-1544776193-352d25ca82cd?q=80",
  "https://images.unsplash.com/photo-1607453998774-d533f65dac99?q=80",
];

interface Product {
  _id: string;
  name: string;
  category: string;
  mainImage?: unknown;
  externalImageUrl?: string;
}

// Track used images to avoid duplicates
const usedImages = new Set<string>();

function getImageForCategory(category: string): string {
  const categoryImages = unsplashImages[category] || defaultImages;

  // Find an unused image
  for (const img of categoryImages) {
    if (!usedImages.has(img)) {
      usedImages.add(img);
      return img;
    }
  }

  // If all category images used, pick from defaults
  for (const img of defaultImages) {
    if (!usedImages.has(img)) {
      usedImages.add(img);
      return img;
    }
  }

  // If everything is used, just cycle through (will have some duplicates)
  const index = usedImages.size % categoryImages.length;
  return categoryImages[index];
}

async function main() {
  console.log("Fetching products without images from Sanity...\n");

  // Fetch all products that don't have a mainImage or externalImageUrl
  const products = await sanityClient.fetch<Product[]>(`
    *[_type == "product" && !defined(mainImage) && !defined(externalImageUrl)] {
      _id,
      name,
      category
    }
  `);

  console.log(`Found ${products.length} products needing images\n`);

  if (products.length === 0) {
    console.log("All products already have images!");
    return;
  }

  // Update each product
  let updated = 0;
  let failed = 0;

  for (const product of products) {
    const imageUrl = getImageForCategory(product.category);

    try {
      await sanityClient
        .patch(product._id)
        .set({ externalImageUrl: imageUrl })
        .commit();

      console.log(`✓ ${product.name} (${product.category}) -> assigned image`);
      updated++;
    } catch (error) {
      console.error(`✗ Failed to update ${product.name}:`, error);
      failed++;
    }
  }

  console.log(`\n========================================`);
  console.log(`Updated: ${updated}`);
  console.log(`Failed: ${failed}`);
  console.log(`========================================`);
}

main().catch(console.error);
