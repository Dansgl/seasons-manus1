import { createClient } from "@sanity/client";
import * as fs from "fs";

const sanityClient = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "h83nldug",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Category mapping
const categoryMap: Record<string, string> = {
  "Tops": "top",
  "Bottoms": "bottom",
  "Dungarees": "overall",
  "Dresses": "dress",
  "Outerwear": "outerwear",
  "Jackets": "jacket",
  "Cardigans": "cardigan",
  "Bodysuits": "bodysuit",
  "Sleepsuits": "sleepsuit",
  "Leggings": "bottom",
  "Joggers": "joggers",
  "Shirts": "top",
  "Sweaters": "top",
  "Jumpers": "top",
  "Coats": "outerwear",
  "Rompers": "bodysuit",
  "Sets": "overall",
};

// Age range mapping
function mapAgeRange(size: string): string {
  const normalized = size.toLowerCase().trim();
  if (normalized.includes("0-3m") || normalized.includes("0-3 m")) return "0-3m";
  if (normalized.includes("3-6m") || normalized.includes("3-6 m")) return "3-6m";
  if (normalized.includes("6-12m") || normalized.includes("6-12 m")) return "6-12m";
  if (normalized.includes("12-18m") || normalized.includes("12-18 m")) return "12-18m";
  if (normalized.includes("18-24m") || normalized.includes("18-24 m")) return "18-24m";
  return "18-24m"; // Default for older sizes
}

async function importProducts() {
  const csvPath = "/Users/dan/seasons-import/scraped_products_shopify.csv";
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const lines = csvContent.split("\n").filter(line => line.trim());
  const dataLines = lines.slice(1);

  // Group by handle
  const productMap = new Map<string, {
    handle: string;
    title: string;
    vendor: string;
    type: string;
    category: string;
    imageUrl: string;
    tags: string;
    sizes: string[];
    totalStock: number;
  }>();

  for (const line of dataLines) {
    const cols = line.split(",");
    if (cols.length < 23) continue;

    const handle = cols[0];
    const title = cols[1];
    const size = cols[3];
    const available = parseInt(cols[16]) || 0;
    const imageUrl = cols[19];
    const tags = cols[20];
    const vendor = cols[21];
    const type = cols[22];
    const category = cols[23]?.replace(/[\r\n]/g, "") || type;

    if (!productMap.has(handle)) {
      productMap.set(handle, {
        handle,
        title,
        vendor,
        type,
        category,
        imageUrl,
        tags,
        sizes: [],
        totalStock: 0,
      });
    }

    const product = productMap.get(handle)!;
    if (size && !product.sizes.includes(size)) {
      product.sizes.push(size);
    }
    product.totalStock += available;
  }

  console.log(`Found ${productMap.size} unique products to import`);

  // Get unique vendors for brands
  const vendors = [...new Set([...productMap.values()].map(p => p.vendor))];
  console.log(`Found ${vendors.length} unique brands`);

  // Create brands first
  const brandIds: Record<string, string> = {};
  for (const vendor of vendors) {
    if (!vendor) continue;
    const brandSlug = vendor.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const brandId = `brand-${brandSlug}`;

    try {
      await sanityClient.createOrReplace({
        _id: brandId,
        _type: "brand",
        name: vendor,
        slug: { _type: "slug", current: brandSlug },
        description: `${vendor} - Premium baby clothing brand`,
      });
      brandIds[vendor] = brandId;
      console.log(`✓ Brand: ${vendor}`);
    } catch (error: any) {
      console.error(`✗ Brand error ${vendor}:`, error.message);
    }
  }

  // Create products
  let created = 0;
  for (const [handle, product] of productMap) {
    const productSlug = handle.replace(/[^a-z0-9-]/g, "");
    const productId = `product-shopify-${productSlug}`.substring(0, 128);
    const mappedCategory = categoryMap[product.category] || categoryMap[product.type] || "top";
    const ageRange = product.sizes.length > 0 ? mapAgeRange(product.sizes[0]) : "6-12m";

    try {
      await sanityClient.createOrReplace({
        _id: productId,
        _type: "product",
        name: product.title,
        slug: { _type: "slug", current: productSlug },
        brand: product.vendor && brandIds[product.vendor] ? { _type: "reference", _ref: brandIds[product.vendor] } : undefined,
        description: `${product.title}. Tags: ${product.tags}`,
        category: mappedCategory,
        ageRange: ageRange,
        season: "all-season",
        sizes: product.sizes,
        rrpPrice: 49.99,
        stockQuantity: product.totalStock,
        inStock: product.totalStock > 0,
        featured: false,
        ozoneCleaned: true,
        insuranceIncluded: true,
      });
      created++;
      if (created % 20 === 0) {
        console.log(`Progress: ${created}/${productMap.size} products created`);
      }
    } catch (error: any) {
      console.error(`✗ Product error ${product.title}:`, error.message);
    }
  }

  console.log(`\n✅ Import complete! Created ${created} products`);
}

importProducts().catch(console.error);
