const { createClient } = require('@sanity/client');

const SUPABASE_URL = 'https://shwtbcqgbveidcxwhnyi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNod3RiY3FnYnZlaWRjeHdobnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyODc4MjQsImV4cCI6MjA4Mjg2MzgyNH0.ypDKzOl_8-WMiJGSsu9cGMnBS9sVQZ3axcBE2EfnpA8';

const sanity = createClient({
  projectId: 'h83nldug',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false
});

async function syncProducts() {
  // Get all products from Sanity
  const sanityProducts = await sanity.fetch('*[_type=="product"]{name, "slug": slug.current, category, rrpPrice, ageRange, season, "brandName": brand->name}');
  console.log('Found', sanityProducts.length, 'products in Sanity');

  // Get existing products from Supabase
  const existingRes = await fetch(SUPABASE_URL + '/rest/v1/products?select=slug', {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
  });
  const existing = await existingRes.json();
  const existingSlugs = new Set(existing.map(p => p.slug));
  console.log('Already have', existingSlugs.size, 'products in Supabase');

  // Filter new products
  const newProducts = sanityProducts
    .filter(p => !existingSlugs.has(p.slug))
    .map(p => ({
      name: p.name,
      slug: p.slug,
      brand: p.brandName || 'Unknown',
      category: p.category || 'Uncategorized',
      age_range: p.ageRange || '0-12 months',
      season: p.season || 'all-season',
      rrp_price: p.rrpPrice || 0
    }));

  if (newProducts.length === 0) {
    console.log('No new products to add');
    return;
  }

  console.log('Adding', newProducts.length, 'new products...');

  const response = await fetch(SUPABASE_URL + '/rest/v1/products', {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(newProducts)
  });

  if (response.ok) {
    console.log('Done! Added', newProducts.length, 'products');
  } else {
    console.error('Error:', response.status, await response.text());
  }
}

async function createInventory() {
  // Get all products from Supabase
  const productsRes = await fetch(SUPABASE_URL + '/rest/v1/products?select=id,slug', {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
  });
  const products = await productsRes.json();
  console.log('Found', products.length, 'products in DB');

  // Get existing inventory
  const invRes = await fetch(SUPABASE_URL + '/rest/v1/inventory_items?select=product_id', {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
  });
  const existingInv = await invRes.json();
  const existingProductIds = new Set(existingInv.map(i => i.product_id));

  // Create 3 inventory items per product that doesn't have any
  const inventoryItems = [];
  let skuCounter = 2000;

  for (const product of products) {
    if (!existingProductIds.has(product.id)) {
      for (let i = 0; i < 3; i++) {
        inventoryItems.push({
          product_id: product.id,
          sku: 'INV-' + String(skuCounter++).padStart(4, '0'),
          sanity_product_slug: product.slug,
          state: 'available'
        });
      }
    }
  }

  if (inventoryItems.length === 0) {
    console.log('All products already have inventory');
    return;
  }

  console.log('Creating', inventoryItems.length, 'inventory items...');

  const response = await fetch(SUPABASE_URL + '/rest/v1/inventory_items', {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(inventoryItems)
  });

  if (response.ok) {
    console.log('Done! Created', inventoryItems.length, 'inventory items');
  } else {
    console.error('Error:', response.status, await response.text());
  }
}

async function main() {
  await syncProducts();
  await createInventory();
}

main().catch(console.error);
