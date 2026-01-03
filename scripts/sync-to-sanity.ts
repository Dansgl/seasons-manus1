import { createClient } from "@sanity/client";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { products, inventoryItems } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Sanity client with write access
const sanityClient = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "h83nldug",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Supabase/PostgreSQL connection
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const client = postgres(DATABASE_URL);
const db = drizzle(client);

// Map database category to Sanity category
const categoryMap: Record<string, string> = {
  "top": "top",
  "bottom": "bottom",
  "overall": "overall",
  "dress": "dress",
  "outerwear": "outerwear",
  "jacket": "jacket",
  "cardigan": "cardigan",
  "bodysuit": "bodysuit",
  "sleepsuit": "sleepsuit",
  "joggers": "joggers",
};

async function syncToSanity() {
  console.log("Fetching products from Supabase...");

  // Get all products from Supabase
  const supabaseProducts = await db.select().from(products);
  console.log(`Found ${supabaseProducts.length} products in Supabase`);

  // Get unique brands
  const brands = [...new Set(supabaseProducts.map(p => p.brand))];
  console.log(`Found ${brands.length} unique brands: ${brands.join(", ")}`);

  // Create brands in Sanity first
  console.log("\nCreating brands in Sanity...");
  const brandIds: Record<string, string> = {};

  for (const brandName of brands) {
    const brandSlug = brandName.toLowerCase().replace(/\s+/g, "-");
    const brandId = `brand-${brandSlug}`;

    try {
      await sanityClient.createOrReplace({
        _id: brandId,
        _type: "brand",
        name: brandName,
        slug: { _type: "slug", current: brandSlug },
        description: `${brandName} - Premium baby clothing brand`,
      });
      brandIds[brandName] = brandId;
      console.log(`✓ Created brand: ${brandName}`);
    } catch (error: any) {
      console.error(`✗ Error creating brand ${brandName}:`, error.message);
    }
  }

  // Create products in Sanity
  console.log("\nCreating products in Sanity...");

  for (const product of supabaseProducts) {
    const productSlug = product.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Get inventory count for this product
    const inventory = await db.select()
      .from(inventoryItems)
      .where(eq(inventoryItems.productId, product.id));

    const availableCount = inventory.filter(i => i.state === "available").length;
    const sizes = [...new Set(inventory.map(i => {
      const match = i.conditionNotes?.match(/Size: ([^,]+)/);
      return match ? match[1] : null;
    }).filter(Boolean))];

    try {
      await sanityClient.createOrReplace({
        _id: `product-${product.id}`,
        _type: "product",
        name: product.name,
        slug: { _type: "slug", current: productSlug },
        brand: { _type: "reference", _ref: brandIds[product.brand] },
        description: product.description || `${product.name} from ${product.brand}`,
        category: product.category,
        ageRange: product.ageRange,
        season: product.season,
        sizes: sizes,
        rrpPrice: parseFloat(product.rrpPrice),
        stockQuantity: availableCount,
        available: availableCount > 0,
        featured: false,
        // Image from Supabase
        ...(product.imageUrl && {
          mainImage: {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: await uploadImageToSanity(product.imageUrl, product.name),
            },
          },
        }),
      });
      console.log(`✓ Created product: ${product.name} (${availableCount} in stock, sizes: ${sizes.join(", ")})`);
    } catch (error: any) {
      // If image upload fails, create without image
      if (error.message?.includes("image")) {
        try {
          await sanityClient.createOrReplace({
            _id: `product-${product.id}`,
            _type: "product",
            name: product.name,
            slug: { _type: "slug", current: productSlug },
            brand: { _type: "reference", _ref: brandIds[product.brand] },
            description: product.description || `${product.name} from ${product.brand}`,
            category: product.category,
            ageRange: product.ageRange,
            season: product.season,
            sizes: sizes,
            rrpPrice: parseFloat(product.rrpPrice),
            stockQuantity: availableCount,
            available: availableCount > 0,
            featured: false,
          });
          console.log(`✓ Created product (no image): ${product.name}`);
        } catch (err: any) {
          console.error(`✗ Error creating product ${product.name}:`, err.message);
        }
      } else {
        console.error(`✗ Error creating product ${product.name}:`, error.message);
      }
    }
  }

  console.log("\n✅ Sync complete!");
  await client.end();
}

async function uploadImageToSanity(imageUrl: string, altText: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.log(`  ⚠ Could not fetch image: ${imageUrl}`);
      return null;
    }

    const buffer = await response.arrayBuffer();
    const asset = await sanityClient.assets.upload("image", Buffer.from(buffer), {
      filename: `${altText.replace(/\s+/g, "-")}.jpg`,
    });

    return asset._id;
  } catch (error) {
    console.log(`  ⚠ Image upload failed for ${altText}`);
    return null;
  }
}

syncToSanity().catch(console.error);
