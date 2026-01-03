import { eq, and, sql, inArray, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  InsertUser,
  users,
  products,
  inventoryItems,
  subscriptions,
  boxes,
  boxItems,
  cartItems,
  swapItems,
  blogPosts,
  blogCategories,
  blogTags,
  postCategories,
  postTags,
  InsertProduct,
  InsertInventoryItem,
  InsertSubscription,
  InsertBox,
  InsertBlogPost,
  InsertBlogCategory,
  InsertBlogTag,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
let _client: ReturnType<typeof postgres> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _client = postgres(process.env.DATABASE_URL, {
        ssl: 'require',
        max: 1, // Serverless: limit connections
        idle_timeout: 20,
        connect_timeout: 10,
        prepare: false, // Disable prepared statements for pooler compatibility
      });
      _db = drizzle(_client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER MANAGEMENT ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.authId) {
    throw new Error("User authId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    // Check if user exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.authId, user.authId))
      .limit(1);

    if (existing.length > 0) {
      // Update existing user
      const updateData: Partial<InsertUser> = {
        updatedAt: new Date(),
      };

      if (user.name !== undefined) updateData.name = user.name;
      if (user.email !== undefined) updateData.email = user.email;
      if (user.avatarUrl !== undefined) updateData.avatarUrl = user.avatarUrl;
      if (user.shippingAddress !== undefined) updateData.shippingAddress = user.shippingAddress;
      if (user.phone !== undefined) updateData.phone = user.phone;
      if (user.lastSignedIn !== undefined) updateData.lastSignedIn = user.lastSignedIn;
      if (user.role !== undefined) updateData.role = user.role;

      await db.update(users).set(updateData).where(eq(users.authId, user.authId));
    } else {
      // Insert new user
      const insertData: InsertUser = {
        authId: user.authId,
        name: user.name ?? null,
        email: user.email ?? null,
        avatarUrl: user.avatarUrl ?? null,
        role: user.role ?? "user",
        lastSignedIn: user.lastSignedIn ?? new Date(),
      };

      // Check if this email is in the admin list
      if (user.email && ENV.adminEmails.includes(user.email)) {
        insertData.role = "admin";
      }

      await db.insert(users).values(insertData);
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByAuthId(authId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.authId, authId)).limit(1);
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

  await db
    .update(users)
    .set({ shippingAddress: address, updatedAt: new Date() })
    .where(eq(users.id, userId));
}

// ============ PRODUCTS ============

export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(products).orderBy(desc(products.createdAt));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(products).values(product).returning();
  return result[0];
}

export async function updateProduct(id: number, product: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(products)
    .set({ ...product, updatedAt: new Date() })
    .where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(products).where(eq(products.id, id));
}

// ============ INVENTORY ITEMS ============

export async function getAvailableInventoryCount(sanityProductSlug: string) {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(inventoryItems)
    .where(
      and(
        eq(inventoryItems.sanityProductSlug, sanityProductSlug),
        eq(inventoryItems.state, "available"),
        sql`(${inventoryItems.quarantineUntil} IS NULL OR ${inventoryItems.quarantineUntil} < CURRENT_DATE)`
      )
    );

  return Number(result[0]?.count) || 0;
}

export async function getAvailableInventoryCountBatch(slugs: string[]) {
  const db = await getDb();
  if (!db || slugs.length === 0) return {};

  const result = await db
    .select({
      slug: inventoryItems.sanityProductSlug,
      count: sql<number>`count(*)`
    })
    .from(inventoryItems)
    .where(
      and(
        inArray(inventoryItems.sanityProductSlug, slugs),
        eq(inventoryItems.state, "available"),
        sql`(${inventoryItems.quarantineUntil} IS NULL OR ${inventoryItems.quarantineUntil} < CURRENT_DATE)`
      )
    )
    .groupBy(inventoryItems.sanityProductSlug);

  const counts: Record<string, number> = {};
  result.forEach(row => {
    counts[row.slug] = Number(row.count) || 0;
  });
  return counts;
}

export async function getAllInventoryItems() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(inventoryItems).orderBy(desc(inventoryItems.createdAt));
}

export async function getInventoryItemsBySlug(sanityProductSlug: string) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(inventoryItems).where(eq(inventoryItems.sanityProductSlug, sanityProductSlug));
}

export async function getFirstAvailableInventoryItem(sanityProductSlug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(inventoryItems)
    .where(
      and(
        eq(inventoryItems.sanityProductSlug, sanityProductSlug),
        eq(inventoryItems.state, "available"),
        sql`(${inventoryItems.quarantineUntil} IS NULL OR ${inventoryItems.quarantineUntil} < CURRENT_DATE)`
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
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
    updateData.quarantineUntil = quarantineDate.toISOString().split("T")[0];
  }

  if (notes) {
    updateData.conditionNotes = notes;
  }

  await db.update(inventoryItems).set(updateData).where(eq(inventoryItems.id, itemId));
}

export async function retireInventoryItem(itemId: number, reason: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(inventoryItems)
    .set({
      state: "retired",
      retirementReason: reason,
      updatedAt: new Date(),
    })
    .where(eq(inventoryItems.id, itemId));
}

export async function createInventoryItem(item: InsertInventoryItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(inventoryItems).values(item).returning();
  return result[0];
}

export async function bulkCreateInventoryItems(items: InsertInventoryItem[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(inventoryItems).values(items).returning();
  return result;
}

// ============ CART ============
// Cart now stores Sanity product slugs, not PostgreSQL product IDs

export async function getCartItems(userId: number) {
  const db = await getDb();
  if (!db) return [];

  // Returns cart items with sanityProductSlug (product details fetched from Sanity separately)
  return await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.userId, userId))
    .orderBy(desc(cartItems.addedAt));
}

export async function getCartSlugs(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const items = await db
    .select({ slug: cartItems.sanityProductSlug })
    .from(cartItems)
    .where(eq(cartItems.userId, userId));

  return items.map(item => item.slug);
}

export async function addToCart(userId: number, sanityProductSlug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if already in cart
  const existing = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.userId, userId), eq(cartItems.sanityProductSlug, sanityProductSlug)))
    .limit(1);

  if (existing.length > 0) {
    throw new Error("Product already in cart");
  }

  await db.insert(cartItems).values({ userId, sanityProductSlug });
}

export async function removeFromCart(userId: number, sanityProductSlug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(cartItems).where(
    and(eq(cartItems.userId, userId), eq(cartItems.sanityProductSlug, sanityProductSlug))
  );
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

  return Number(result[0]?.count) || 0;
}

export async function isInCart(userId: number, sanityProductSlug: string) {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.userId, userId), eq(cartItems.sanityProductSlug, sanityProductSlug)))
    .limit(1);

  return result.length > 0;
}

// ============ SWAP ITEMS ============
// For selecting next box items during swap window

export async function getSwapItems(subscriptionId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(swapItems)
    .where(eq(swapItems.subscriptionId, subscriptionId))
    .orderBy(desc(swapItems.addedAt));
}

export async function getSwapSlugs(subscriptionId: number) {
  const db = await getDb();
  if (!db) return [];

  const items = await db
    .select({ slug: swapItems.sanityProductSlug })
    .from(swapItems)
    .where(eq(swapItems.subscriptionId, subscriptionId));

  return items.map(item => item.slug);
}

export async function addToSwap(subscriptionId: number, sanityProductSlug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if already in swap selection
  const existing = await db
    .select()
    .from(swapItems)
    .where(and(eq(swapItems.subscriptionId, subscriptionId), eq(swapItems.sanityProductSlug, sanityProductSlug)))
    .limit(1);

  if (existing.length > 0) {
    throw new Error("Product already in swap selection");
  }

  await db.insert(swapItems).values({ subscriptionId, sanityProductSlug });
}

export async function removeFromSwap(subscriptionId: number, sanityProductSlug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(swapItems).where(
    and(eq(swapItems.subscriptionId, subscriptionId), eq(swapItems.sanityProductSlug, sanityProductSlug))
  );
}

export async function clearSwapItems(subscriptionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(swapItems).where(eq(swapItems.subscriptionId, subscriptionId));
}

export async function getSwapCount(subscriptionId: number) {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(swapItems)
    .where(eq(swapItems.subscriptionId, subscriptionId));

  return Number(result[0]?.count) || 0;
}

// ============ SUBSCRIPTIONS ============

export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createSubscription(subscription: InsertSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(subscriptions).values(subscription).returning();
  return result[0];
}

export async function updateSubscriptionStatus(subscriptionId: number, status: "active" | "paused" | "cancelled") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(subscriptions).set({ status, updatedAt: new Date() }).where(eq(subscriptions.id, subscriptionId));
}

export async function updateSwapWindowStatus(subscriptionId: number, isOpen: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(subscriptions)
    .set({ swapWindowOpen: isOpen, updatedAt: new Date() })
    .where(eq(subscriptions.id, subscriptionId));
}

// ============ BOXES ============

export async function createBox(box: InsertBox) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(boxes).values(box).returning();
  return result[0];
}

export async function getBoxesBySubscription(subscriptionId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(boxes).where(eq(boxes.subscriptionId, subscriptionId));
}

export async function getCurrentBox(subscriptionId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(boxes)
    .where(
      and(eq(boxes.subscriptionId, subscriptionId), inArray(boxes.status, ["active", "shipped", "selecting", "confirmed"]))
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

  await db.update(boxes).set({ status, updatedAt: new Date() }).where(eq(boxes.id, boxId));
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

  // We no longer join with products table since product data comes from Sanity
  // Frontend will match inventoryItem.sanityProductSlug with Sanity products
  return await db
    .select({
      boxItem: boxItems,
      inventoryItem: inventoryItems,
    })
    .from(boxItems)
    .leftJoin(inventoryItems, eq(boxItems.inventoryItemId, inventoryItems.id))
    .where(eq(boxItems.boxId, boxId));
}

export async function getBoxItemCount(boxId: number) {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(boxItems)
    .where(eq(boxItems.boxId, boxId));

  return Number(result[0]?.count) || 0;
}

// ============ ADMIN QUERIES ============

export async function getAllSubscriptions() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      subscription: subscriptions,
      user: users,
    })
    .from(subscriptions)
    .leftJoin(users, eq(subscriptions.userId, users.id));
}

export async function getInventoryStats() {
  const db = await getDb();
  if (!db)
    return {
      total: 0,
      available: 0,
      active: 0,
      inTransit: 0,
      quarantine: 0,
      retired: 0,
    };

  const result = await db
    .select({
      state: inventoryItems.state,
      count: sql<number>`count(*)`,
    })
    .from(inventoryItems)
    .groupBy(inventoryItems.state);

  const stats = {
    total: 0,
    available: 0,
    active: 0,
    inTransit: 0,
    quarantine: 0,
    retired: 0,
  };

  result.forEach((row) => {
    const count = Number(row.count);
    stats.total += count;
    if (row.state === "available") stats.available = count;
    if (row.state === "active") stats.active = count;
    if (row.state === "in_transit") stats.inTransit = count;
    if (row.state === "quarantine") stats.quarantine = count;
    if (row.state === "retired") stats.retired = count;
  });

  return stats;
}

// ============ BLOG POSTS ============

export async function getAllBlogPosts(options?: { status?: "draft" | "published" | "archived"; limit?: number }) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(blogPosts);

  if (options?.status) {
    query = query.where(eq(blogPosts.status, options.status)) as any;
  }

  return await query.orderBy(desc(blogPosts.publishedAt)).limit(options?.limit ?? 100);
}

export async function getPublishedBlogPosts(limit?: number) {
  return getAllBlogPosts({ status: "published", limit });
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getBlogPostById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createBlogPost(post: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(blogPosts).values(post).returning();
  return result[0];
}

export async function updateBlogPost(id: number, post: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(blogPosts)
    .set({ ...post, updatedAt: new Date() })
    .where(eq(blogPosts.id, id));
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

// ============ BLOG CATEGORIES ============

export async function getAllBlogCategories() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(blogCategories).orderBy(asc(blogCategories.name));
}

export async function getBlogCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(blogCategories).where(eq(blogCategories.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createBlogCategory(category: InsertBlogCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(blogCategories).values(category).returning();
  return result[0];
}

export async function updateBlogCategory(id: number, category: Partial<InsertBlogCategory>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(blogCategories).set(category).where(eq(blogCategories.id, id));
}

export async function deleteBlogCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(blogCategories).where(eq(blogCategories.id, id));
}

// ============ BLOG TAGS ============

export async function getAllBlogTags() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(blogTags).orderBy(asc(blogTags.name));
}

export async function getBlogTagBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(blogTags).where(eq(blogTags.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createBlogTag(tag: InsertBlogTag) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(blogTags).values(tag).returning();
  return result[0];
}

export async function deleteBlogTag(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(blogTags).where(eq(blogTags.id, id));
}

// ============ POST-CATEGORY RELATIONS ============

export async function setPostCategories(postId: number, categoryIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Remove existing categories
  await db.delete(postCategories).where(eq(postCategories.postId, postId));

  // Add new categories
  if (categoryIds.length > 0) {
    await db.insert(postCategories).values(categoryIds.map((categoryId) => ({ postId, categoryId })));
  }
}

export async function getPostCategories(postId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({ category: blogCategories })
    .from(postCategories)
    .innerJoin(blogCategories, eq(postCategories.categoryId, blogCategories.id))
    .where(eq(postCategories.postId, postId));
}

// ============ POST-TAG RELATIONS ============

export async function setPostTags(postId: number, tagIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Remove existing tags
  await db.delete(postTags).where(eq(postTags.postId, postId));

  // Add new tags
  if (tagIds.length > 0) {
    await db.insert(postTags).values(tagIds.map((tagId) => ({ postId, tagId })));
  }
}

export async function getPostTags(postId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({ tag: blogTags })
    .from(postTags)
    .innerJoin(blogTags, eq(postTags.tagId, blogTags.id))
    .where(eq(postTags.postId, postId));
}

// ============ BULK IMPORT ============

export async function bulkCreateProducts(productList: InsertProduct[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(products).values(productList).returning();
  return result;
}
