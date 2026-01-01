import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import tls from "tls";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Category mapping from CSV to database enum
const categoryMap = {
  "Tops": "top",
  "Bottoms": "bottom",
  "Bodysuits": "bodysuit",
  "Sleepsuits": "sleepsuit",
  "Dresses": "dress",
  "Outerwear": "outerwear",
  "Jackets": "jacket",
  "Cardigans": "cardigan",
  "Joggers": "joggers",
  "Swimwear": "swimwear",
  "Hats": "hat",
  "Shoes": "shoes",
  "PJs": "pjs",
  "Overalls": "overall"
};

async function importStock() {
  // Parse DATABASE_URL: mysql://user:password@host:port/database
  const dbUrl = process.env.DATABASE_URL || "";
  const urlMatch = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
  const dbName = urlMatch?.[5]?.split("?")[0] || "seasons";
  
  const connection = await mysql.createConnection({
    host: urlMatch?.[3] || "localhost",
    user: urlMatch?.[1] || "root",
    password: urlMatch?.[2] || "",
    port: parseInt(urlMatch?.[4] || "3306"),
    database: dbName,
    ssl: {},
  });

  try {
    // Read CSV file
    const csvPath = "/home/ubuntu/upload/newstock.csv.csv";
    const csvContent = fs.readFileSync(csvPath, "utf-8");
    const lines = csvContent.split("\n").filter(line => line.trim());

    // Parse header
    const headers = lines[0].split(";").map(h => h.trim());
    const handleIdx = headers.indexOf("Handle");
    const titleIdx = headers.indexOf("Title");
    const sizeIdx = headers.indexOf("Option1 Value");
    const skuIdx = headers.indexOf("SKU");
    const imageSrcIdx = headers.indexOf("Image Src");
    const vendorIdx = headers.indexOf("Vendor");
    const categoryIdx = headers.indexOf("Category");
    const availableIdx = headers.indexOf("Available");

    // Clear existing products and inventory (ignore errors if tables don't exist)
    try { await connection.query("DELETE FROM box_items"); } catch (e) {}
    try { await connection.query("DELETE FROM inventoryItems"); } catch (e) {}
    try { await connection.query("DELETE FROM products"); } catch (e) {}

    const processedProducts = new Map();
    let inventoryCount = 0;

    // Process each row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      // Parse CSV with proper quote handling
      const values = [];
      let current = "";
      let inQuotes = false;

      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ";" && !inQuotes) {
          values.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      const handle = values[handleIdx]?.trim() || "";
      const title = values[titleIdx]?.trim() || "";
      const size = values[sizeIdx]?.trim() || "One Size";
      const sku = values[skuIdx]?.trim() || `SKU-${i}`;
      let imageUrl = values[imageSrcIdx]?.trim() || "";
      const vendor = values[vendorIdx]?.trim() || "Unknown";
      let category = values[categoryIdx]?.trim() || "top";
      const available = parseInt(values[availableIdx] || "1");

      // Clean image URL - remove quotes and take first image if multiple
      imageUrl = imageUrl.replace(/^"|"$/g, "").split(";")[0]?.trim() || "";

      // Map category to enum values
      category = categoryMap[category] || "top";

      // Get or create product
      let productId;
      if (processedProducts.has(handle)) {
        productId = processedProducts.get(handle);
      } else {
        // Extract age range from size or title
        let ageRange = "0-3m";
        if (size.includes("18-24m")) ageRange = "18-24m";
        else if (size.includes("12-18m")) ageRange = "12-18m";
        else if (size.includes("6-12m")) ageRange = "6-12m";
        else if (size.includes("3-6m")) ageRange = "3-6m";
        else if (size.includes("0-3m")) ageRange = "0-3m";
        else if (size.includes("ADULT")) ageRange = "18-24m"; // Map adult sizes to 18-24m

        try {
          const [result] = await connection.query(
            `INSERT INTO products (name, brand, category, ageRange, season, rrpPrice, imageUrl, description)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, vendor, category, ageRange, "all-season", 50, imageUrl, `${title} - Size: ${size}`]
          );
          productId = result.insertId;
          processedProducts.set(handle, productId);
        } catch (e) {
          console.error(`Failed to insert product ${handle}:`, e.message);
          continue;
        }
      }

      // Add inventory item
      if (available > 0 && productId) {
        try {
          await connection.query(
            `INSERT INTO inventoryItems (productId, sku, state, conditionNotes)
             VALUES (?, ?, ?, ?)`,
            [productId, sku, "available", `${title} - ${size}`]
          );
          inventoryCount++;
        } catch (e) {
          console.error(`Failed to insert inventory for SKU ${sku}:`, e.message);
        }
      }
    }

    console.log(`✅ Import complete: ${processedProducts.size} products, ${inventoryCount} inventory items`);
    await connection.end();
  } catch (error) {
    console.error("❌ Import failed:", error);
    process.exit(1);
  }
}

importStock();
