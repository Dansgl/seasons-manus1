import { eq, and, sql, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  products,
  inventoryItems,
  subscriptions,
  boxes,
  boxItems,
  cartItems,
  InsertProduct,
  InsertInventoryItem,
  InsertSubscription,
  InsertBox,
  InsertBoxItem,
  InsertCartItem
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER MANAGEMENT ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "shippingAddress", "phone"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserShippingAddress(userId: number, address: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users)
    .set({ shippingAddress: address, updatedAt: new Date() })
    .where(eq(users.id, userId));
}

// ============ PRODUCTS ============

export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(products);
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(products).values(product);
  return result;
}

// ============ INVENTORY ITEMS ============

export async function getAvailableInventoryCount(productId: number) {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(inventoryItems)
    .where(
      and(
        eq(inventoryItems.productId, productId),
        eq(inventoryItems.state, "available"),
        sql`(${inventoryItems.quarantineUntil} IS NULL OR ${inventoryItems.quarantineUntil} < CURDATE())`
      )
    );

  return result[0]?.count || 0;
}

export async function getAllInventoryItems() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(inventoryItems);
}

export async function getInventoryItemsByProductId(productId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(inventoryItems).where(eq(inventoryItems.productId, productId));
}

export async function updateInventoryItemState(
  itemId: number, 
  state: "available" | "active" | "in_transit" | "quarantine" | "retired",
  notes?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = { state, updatedAt: new Date() };
  
  if (state === "quarantine") {
    // Set quarantine until 5 days from now
    const quarantineDate = new Date();
    quarantineDate.setDate(quarantineDate.getDate() + 5);
    updateData.quarantineUntil = quarantineDate.toISOString().split('T')[0];
  }
  
  if (notes) {
    updateData.conditionNotes = notes;
  }

  await db.update(inventoryItems)
    .set(updateData)
    .where(eq(inventoryItems.id, itemId));
}

export async function retireInventoryItem(itemId: number, reason: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(inventoryItems)
    .set({ 
      state: "retired", 
      retirementReason: reason,
      updatedAt: new Date()
    })
    .where(eq(inventoryItems.id, itemId));
}

export async function createInventoryItem(item: InsertInventoryItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(inventoryItems).values(item);
  return result;
}

// ============ CART ============

export async function getCartItems(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      cartItem: cartItems,
      product: products
    })
    .from(cartItems)
    .leftJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId));
}

export async function addToCart(userId: number, productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(cartItems).values({ userId, productId });
}

export async function removeFromCart(userId: number, productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(cartItems)
    .where(and(
      eq(cartItems.userId, userId),
      eq(cartItems.productId, productId)
    ));
}

export async function clearCart(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(cartItems).where(eq(cartItems.userId, userId));
}

export async function getCartCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(cartItems)
    .where(eq(cartItems.userId, userId));

  return result[0]?.count || 0;
}

// ============ SUBSCRIPTIONS ============

export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createSubscription(subscription: InsertSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(subscriptions).values(subscription);
  return result;
}

export async function updateSubscriptionStatus(
  subscriptionId: number, 
  status: "active" | "paused" | "cancelled"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(subscriptions)
    .set({ status, updatedAt: new Date() })
    .where(eq(subscriptions.id, subscriptionId));
}

export async function updateSwapWindowStatus(subscriptionId: number, isOpen: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(subscriptions)
    .set({ swapWindowOpen: isOpen, updatedAt: new Date() })
    .where(eq(subscriptions.id, subscriptionId));
}

// ============ BOXES ============

export async function createBox(box: InsertBox) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(boxes).values(box);
  return result;
}

export async function getBoxesBySubscription(subscriptionId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(boxes)
    .where(eq(boxes.subscriptionId, subscriptionId));
}

export async function getCurrentBox(subscriptionId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(boxes)
    .where(
      and(
        eq(boxes.subscriptionId, subscriptionId),
        inArray(boxes.status, ["active", "shipped", "selecting", "confirmed"])
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function updateBoxStatus(
  boxId: number, 
  status: "selecting" | "confirmed" | "shipped" | "active" | "swap_pending" | "returned" | "completed"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(boxes)
    .set({ status, updatedAt: new Date() })
    .where(eq(boxes.id, boxId));
}

// ============ BOX ITEMS ============

export async function addItemToBox(boxId: number, inventoryItemId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(boxItems).values({ boxId, inventoryItemId });
}

export async function getBoxItems(boxId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      boxItem: boxItems,
      inventoryItem: inventoryItems,
      product: products
    })
    .from(boxItems)
    .leftJoin(inventoryItems, eq(boxItems.inventoryItemId, inventoryItems.id))
    .leftJoin(products, eq(inventoryItems.productId, products.id))
    .where(eq(boxItems.boxId, boxId));
}

export async function getBoxItemCount(boxId: number) {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(boxItems)
    .where(eq(boxItems.boxId, boxId));

  return result[0]?.count || 0;
}

// ============ ADMIN QUERIES ============

export async function getAllSubscriptions() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      subscription: subscriptions,
      user: users
    })
    .from(subscriptions)
    .leftJoin(users, eq(subscriptions.userId, users.id));
}

export async function getInventoryStats() {
  const db = await getDb();
  if (!db) return {
    total: 0,
    available: 0,
    active: 0,
    inTransit: 0,
    quarantine: 0,
    retired: 0
  };

  const result = await db
    .select({
      state: inventoryItems.state,
      count: sql<number>`count(*)`
    })
    .from(inventoryItems)
    .groupBy(inventoryItems.state);

  const stats = {
    total: 0,
    available: 0,
    active: 0,
    inTransit: 0,
    quarantine: 0,
    retired: 0
  };

  result.forEach(row => {
    stats.total += row.count;
    if (row.state === "available") stats.available = row.count;
    if (row.state === "active") stats.active = row.count;
    if (row.state === "in_transit") stats.inTransit = row.count;
    if (row.state === "quarantine") stats.quarantine = row.count;
    if (row.state === "retired") stats.retired = row.count;
  });

  return stats;
}
