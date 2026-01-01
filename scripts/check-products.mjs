import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema.ts';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const products = await db.select().from(schema.products);
const inventoryItems = await db.select().from(schema.inventoryItems);

console.log('Total products:', products.length);
console.log('Total inventory items:', inventoryItems.length);
console.log('\nProducts:');
products.forEach(p => {
  const itemCount = inventoryItems.filter(i => i.productId === p.id).length;
  console.log(`- ${p.title} (ID: ${p.id}): ${itemCount} inventory items`);
});

await connection.end();
