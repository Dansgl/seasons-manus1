import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as fs from "fs";
import * as path from "path";
import { products, inventoryItems } from "../drizzle/schema";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const client = postgres(DATABASE_URL);
const db = drizzle(client);

// Category mapping from CSV to schema enum
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
  "Joggers": "joggers",
};

// Age range mapping - map CSV sizes to schema enum
function mapAgeRange(size: string): string {
  const normalized = size.toLowerCase().trim();

  if (normalized.includes("0-3m")) return "0-3m";
  if (normalized.includes("3-6m")) return "3-6m";
  if (normalized.includes("6-12m")) return "6-12m";
  if (normalized.includes("12-18m")) return "12-18m";
  if (normalized.includes("18-24m")) return "18-24m";

  // For older kid sizes, default to 18-24m
  return "18-24m";
}

async function importProducts() {
  const csvPath = "/Users/dan/seasons-import/new stock.csv1.csv";
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const lines = csvContent.split("\n").filter(line => line.trim());

  // Skip header
  const dataLines = lines.slice(1);

  // Group by handle (product)
  const productMap = new Map<string, any>();
  const inventoryData: any[] = [];

  for (const line of dataLines) {
    const cols = line.split(";");
    if (cols.length < 22) continue;

    const [
      handle, title, opt1Name, opt1Value, opt2Name, opt2Value,
      opt3Name, opt3Value, sku, hsCode, coo, location, bin,
      incoming, unavailable, committed, available, onHand,
      imageUrl, tags, vendor, type, category
    ] = cols;

    // Create product entry if not exists
    if (!productMap.has(handle)) {
      const mappedCategory = categoryMap[category] || "top";
      const ageRange = mapAgeRange(opt1Value);

      productMap.set(handle, {
        brand: vendor,
        name: title,
        description: `${title}. Tags: ${tags}`,
        category: mappedCategory,
        ageRange: ageRange,
        season: "all-season",
        rrpPrice: "49.99", // Default RRP
        imageUrl: imageUrl,
      });
    }

    // Add inventory item
    inventoryData.push({
      handle,
      sku,
      size: opt1Value,
      condition: opt2Value,
      available: parseInt(available) || 0,
    });
  }

  console.log(`Found ${productMap.size} unique products`);
  console.log(`Found ${inventoryData.length} inventory items`);

  // Insert products
  const productIds = new Map<string, number>();

  for (const [handle, productData] of productMap) {
    try {
      const result = await db.insert(products).values({
        brand: productData.brand,
        name: productData.name,
        description: productData.description,
        category: productData.category as any,
        ageRange: productData.ageRange as any,
        season: productData.season as any,
        rrpPrice: productData.rrpPrice,
        imageUrl: productData.imageUrl,
      }).returning({ id: products.id });

      productIds.set(handle, result[0].id);
      console.log(`Created product: ${productData.name} (ID: ${result[0].id})`);
    } catch (error) {
      console.error(`Error creating product ${handle}:`, error);
    }
  }

  // Insert inventory items
  for (const item of inventoryData) {
    const productId = productIds.get(item.handle);
    if (!productId) {
      console.error(`No product ID for handle: ${item.handle}`);
      continue;
    }

    try {
      await db.insert(inventoryItems).values({
        productId,
        sku: item.sku,
        state: item.available > 0 ? "available" : "retired",
        conditionNotes: `Size: ${item.size}, Condition: ${item.condition}`,
      });
      console.log(`Created inventory item: ${item.sku}`);
    } catch (error) {
      console.error(`Error creating inventory item ${item.sku}:`, error);
    }
  }

  console.log("\nImport complete!");
  await client.end();
}

importProducts().catch(console.error);
