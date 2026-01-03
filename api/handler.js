// api/handler.ts
import "dotenv/config";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

// server/_core/systemRouter.ts
import { z } from "zod";

// shared/const.ts
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  }))
});

// server/_core/supabase.ts
import { createClient } from "@supabase/supabase-js";

// server/_core/env.ts
var ENV = {
  // Supabase configuration
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  // Database
  databaseUrl: process.env.DATABASE_URL ?? "",
  // App configuration
  appUrl: process.env.APP_URL ?? "http://localhost:3000",
  isProduction: process.env.NODE_ENV === "production",
  // Admin configuration (comma-separated list of admin emails)
  adminEmails: (process.env.ADMIN_EMAILS ?? "").split(",").filter(Boolean),
  // Optional: OpenAI for AI features
  openaiApiKey: process.env.OPENAI_API_KEY ?? ""
};

// server/_core/supabase.ts
var supabaseAdmin = createClient(ENV.supabaseUrl, ENV.supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
async function uploadToStorage(bucket, path, file, contentType) {
  const { data, error } = await supabaseAdmin.storage.from(bucket).upload(path, file, {
    contentType,
    upsert: true
  });
  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }
  const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
  return urlData.publicUrl;
}

// server/routers.ts
import { z as z2 } from "zod";
import { TRPCError as TRPCError2 } from "@trpc/server";

// server/db.ts
import { eq, and, sql, inArray, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// drizzle/schema.ts
import {
  pgTable,
  pgEnum,
  serial,
  text,
  timestamp,
  varchar,
  numeric,
  boolean,
  date,
  integer,
  primaryKey
} from "drizzle-orm/pg-core";
var userRoleEnum = pgEnum("user_role", ["user", "admin"]);
var categoryEnum = pgEnum("category", [
  "bodysuit",
  "sleepsuit",
  "joggers",
  "jacket",
  "cardigan",
  "top",
  "bottom",
  "dress",
  "outerwear",
  "swimwear",
  "hat",
  "shoes",
  "pjs",
  "overall"
]);
var ageRangeEnum = pgEnum("age_range", [
  "0-3m",
  "3-6m",
  "6-12m",
  "12-18m",
  "18-24m"
]);
var seasonEnum = pgEnum("season", ["summer", "winter", "all-season"]);
var inventoryStateEnum = pgEnum("inventory_state", [
  "available",
  "active",
  "in_transit",
  "quarantine",
  "retired"
]);
var subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "paused",
  "cancelled"
]);
var boxStatusEnum = pgEnum("box_status", [
  "selecting",
  "confirmed",
  "shipped",
  "active",
  "swap_pending",
  "returned",
  "completed"
]);
var postStatusEnum = pgEnum("post_status", [
  "draft",
  "published",
  "archived"
]);
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  // Supabase auth user ID (UUID from auth.users)
  authId: varchar("auth_id", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").default("user").notNull(),
  // Shipping address stored as JSON string
  shippingAddress: text("shipping_address"),
  phone: varchar("phone", { length: 32 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in", { withTimezone: true }).defaultNow().notNull()
});
var products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }),
  brand: varchar("brand", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: categoryEnum("category").notNull(),
  ageRange: ageRangeEnum("age_range").notNull(),
  season: seasonEnum("season").notNull(),
  rrpPrice: numeric("rrp_price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  // Additional images stored as JSON array
  additionalImages: text("additional_images"),
  ozoneCleaned: boolean("ozone_cleaned").default(true).notNull(),
  insuranceIncluded: boolean("insurance_included").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});
var inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  // Link to Sanity product by slug (primary way to identify product)
  sanityProductSlug: varchar("sanity_product_slug", { length: 255 }).notNull(),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  state: inventoryStateEnum("state").default("available").notNull(),
  conditionNotes: text("condition_notes"),
  quarantineUntil: date("quarantine_until"),
  retirementReason: text("retirement_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});
var subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  status: subscriptionStatusEnum("status").default("active").notNull(),
  cycleStartDate: date("cycle_start_date").notNull(),
  cycleEndDate: date("cycle_end_date").notNull(),
  nextBillingDate: date("next_billing_date").notNull(),
  swapWindowOpen: boolean("swap_window_open").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});
var boxes = pgTable("boxes", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscription_id").notNull().references(() => subscriptions.id),
  cycleNumber: integer("cycle_number").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  returnByDate: date("return_by_date").notNull(),
  status: boxStatusEnum("status").default("selecting").notNull(),
  shippingLabelUrl: varchar("shipping_label_url", { length: 500 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});
var boxItems = pgTable("box_items", {
  id: serial("id").primaryKey(),
  boxId: integer("box_id").notNull().references(() => boxes.id),
  inventoryItemId: integer("inventory_item_id").notNull().references(() => inventoryItems.id),
  addedAt: timestamp("added_at", { withTimezone: true }).defaultNow().notNull()
});
var cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  // Reference to Sanity product by slug
  sanityProductSlug: varchar("sanity_product_slug", { length: 255 }).notNull(),
  addedAt: timestamp("added_at", { withTimezone: true }).defaultNow().notNull()
});
var swapItems = pgTable("swap_items", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscription_id").notNull().references(() => subscriptions.id),
  sanityProductSlug: varchar("sanity_product_slug", { length: 255 }).notNull(),
  addedAt: timestamp("added_at", { withTimezone: true }).defaultNow().notNull()
});
var blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImage: varchar("featured_image", { length: 500 }),
  authorId: integer("author_id").references(() => users.id),
  status: postStatusEnum("status").default("draft").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  // SEO fields
  metaTitle: varchar("meta_title", { length: 70 }),
  metaDescription: varchar("meta_description", { length: 160 }),
  ogImage: varchar("og_image", { length: 500 }),
  canonicalUrl: varchar("canonical_url", { length: 500 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});
var blogCategories = pgTable("blog_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});
var blogTags = pgTable("blog_tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});
var postCategories = pgTable("post_categories", {
  postId: integer("post_id").notNull().references(() => blogPosts.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").notNull().references(() => blogCategories.id, { onDelete: "cascade" })
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.categoryId] })
}));
var postTags = pgTable("post_tags", {
  postId: integer("post_id").notNull().references(() => blogPosts.id, { onDelete: "cascade" }),
  tagId: integer("tag_id").notNull().references(() => blogTags.id, { onDelete: "cascade" })
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.tagId] })
}));

// server/db.ts
var _db = null;
var _client = null;
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _client = postgres(process.env.DATABASE_URL, {
        ssl: "require",
        max: 1,
        // Serverless: limit connections
        idle_timeout: 20,
        connect_timeout: 10
      });
      _db = drizzle(_client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function updateUserShippingAddress(userId, address) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set({ shippingAddress: address, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, userId));
}
async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(products).orderBy(desc(products.createdAt));
}
async function getProductById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getProductBySlug(slug) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createProduct(product) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(products).values(product).returning();
  return result[0];
}
async function updateProduct(id, product) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(products).set({ ...product, updatedAt: /* @__PURE__ */ new Date() }).where(eq(products.id, id));
}
async function deleteProduct(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(products).where(eq(products.id, id));
}
async function getAvailableInventoryCount(sanityProductSlug) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql`count(*)` }).from(inventoryItems).where(
    and(
      eq(inventoryItems.sanityProductSlug, sanityProductSlug),
      eq(inventoryItems.state, "available"),
      sql`(${inventoryItems.quarantineUntil} IS NULL OR ${inventoryItems.quarantineUntil} < CURRENT_DATE)`
    )
  );
  return Number(result[0]?.count) || 0;
}
async function getAvailableInventoryCountBatch(slugs) {
  const db = await getDb();
  if (!db || slugs.length === 0) return {};
  const result = await db.select({
    slug: inventoryItems.sanityProductSlug,
    count: sql`count(*)`
  }).from(inventoryItems).where(
    and(
      inArray(inventoryItems.sanityProductSlug, slugs),
      eq(inventoryItems.state, "available"),
      sql`(${inventoryItems.quarantineUntil} IS NULL OR ${inventoryItems.quarantineUntil} < CURRENT_DATE)`
    )
  ).groupBy(inventoryItems.sanityProductSlug);
  const counts = {};
  result.forEach((row) => {
    counts[row.slug] = Number(row.count) || 0;
  });
  return counts;
}
async function getAllInventoryItems() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(inventoryItems).orderBy(desc(inventoryItems.createdAt));
}
async function getFirstAvailableInventoryItem(sanityProductSlug) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(inventoryItems).where(
    and(
      eq(inventoryItems.sanityProductSlug, sanityProductSlug),
      eq(inventoryItems.state, "available"),
      sql`(${inventoryItems.quarantineUntil} IS NULL OR ${inventoryItems.quarantineUntil} < CURRENT_DATE)`
    )
  ).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function updateInventoryItemState(itemId, state, notes) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData = { state, updatedAt: /* @__PURE__ */ new Date() };
  if (state === "quarantine") {
    const quarantineDate = /* @__PURE__ */ new Date();
    quarantineDate.setDate(quarantineDate.getDate() + 5);
    updateData.quarantineUntil = quarantineDate.toISOString().split("T")[0];
  }
  if (notes) {
    updateData.conditionNotes = notes;
  }
  await db.update(inventoryItems).set(updateData).where(eq(inventoryItems.id, itemId));
}
async function retireInventoryItem(itemId, reason) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(inventoryItems).set({
    state: "retired",
    retirementReason: reason,
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq(inventoryItems.id, itemId));
}
async function createInventoryItem(item) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(inventoryItems).values(item).returning();
  return result[0];
}
async function bulkCreateInventoryItems(items) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(inventoryItems).values(items).returning();
  return result;
}
async function getCartSlugs(userId) {
  const db = await getDb();
  if (!db) return [];
  const items = await db.select({ slug: cartItems.sanityProductSlug }).from(cartItems).where(eq(cartItems.userId, userId));
  return items.map((item) => item.slug);
}
async function addToCart(userId, sanityProductSlug) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(cartItems).where(and(eq(cartItems.userId, userId), eq(cartItems.sanityProductSlug, sanityProductSlug))).limit(1);
  if (existing.length > 0) {
    throw new Error("Product already in cart");
  }
  await db.insert(cartItems).values({ userId, sanityProductSlug });
}
async function removeFromCart(userId, sanityProductSlug) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(cartItems).where(
    and(eq(cartItems.userId, userId), eq(cartItems.sanityProductSlug, sanityProductSlug))
  );
}
async function clearCart(userId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(cartItems).where(eq(cartItems.userId, userId));
}
async function getCartCount(userId) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql`count(*)` }).from(cartItems).where(eq(cartItems.userId, userId));
  return Number(result[0]?.count) || 0;
}
async function isInCart(userId, sanityProductSlug) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(cartItems).where(and(eq(cartItems.userId, userId), eq(cartItems.sanityProductSlug, sanityProductSlug))).limit(1);
  return result.length > 0;
}
async function getSwapSlugs(subscriptionId) {
  const db = await getDb();
  if (!db) return [];
  const items = await db.select({ slug: swapItems.sanityProductSlug }).from(swapItems).where(eq(swapItems.subscriptionId, subscriptionId));
  return items.map((item) => item.slug);
}
async function addToSwap(subscriptionId, sanityProductSlug) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(swapItems).where(and(eq(swapItems.subscriptionId, subscriptionId), eq(swapItems.sanityProductSlug, sanityProductSlug))).limit(1);
  if (existing.length > 0) {
    throw new Error("Product already in swap selection");
  }
  await db.insert(swapItems).values({ subscriptionId, sanityProductSlug });
}
async function removeFromSwap(subscriptionId, sanityProductSlug) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(swapItems).where(
    and(eq(swapItems.subscriptionId, subscriptionId), eq(swapItems.sanityProductSlug, sanityProductSlug))
  );
}
async function clearSwapItems(subscriptionId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(swapItems).where(eq(swapItems.subscriptionId, subscriptionId));
}
async function getSwapCount(subscriptionId) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql`count(*)` }).from(swapItems).where(eq(swapItems.subscriptionId, subscriptionId));
  return Number(result[0]?.count) || 0;
}
async function getUserSubscription(userId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createSubscription(subscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(subscriptions).values(subscription).returning();
  return result[0];
}
async function updateSubscriptionStatus(subscriptionId, status) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(subscriptions).set({ status, updatedAt: /* @__PURE__ */ new Date() }).where(eq(subscriptions.id, subscriptionId));
}
async function createBox(box) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(boxes).values(box).returning();
  return result[0];
}
async function getBoxesBySubscription(subscriptionId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(boxes).where(eq(boxes.subscriptionId, subscriptionId));
}
async function getCurrentBox(subscriptionId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(boxes).where(
    and(eq(boxes.subscriptionId, subscriptionId), inArray(boxes.status, ["active", "shipped", "selecting", "confirmed"]))
  ).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function addItemToBox(boxId, inventoryItemId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(boxItems).values({ boxId, inventoryItemId });
}
async function getBoxItems(boxId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select({
    boxItem: boxItems,
    inventoryItem: inventoryItems
  }).from(boxItems).leftJoin(inventoryItems, eq(boxItems.inventoryItemId, inventoryItems.id)).where(eq(boxItems.boxId, boxId));
}
async function getAllSubscriptions() {
  const db = await getDb();
  if (!db) return [];
  return await db.select({
    subscription: subscriptions,
    user: users
  }).from(subscriptions).leftJoin(users, eq(subscriptions.userId, users.id));
}
async function getInventoryStats() {
  const db = await getDb();
  if (!db)
    return {
      total: 0,
      available: 0,
      active: 0,
      inTransit: 0,
      quarantine: 0,
      retired: 0
    };
  const result = await db.select({
    state: inventoryItems.state,
    count: sql`count(*)`
  }).from(inventoryItems).groupBy(inventoryItems.state);
  const stats = {
    total: 0,
    available: 0,
    active: 0,
    inTransit: 0,
    quarantine: 0,
    retired: 0
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
async function getAllBlogPosts(options) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(blogPosts);
  if (options?.status) {
    query = query.where(eq(blogPosts.status, options.status));
  }
  return await query.orderBy(desc(blogPosts.publishedAt)).limit(options?.limit ?? 100);
}
async function getPublishedBlogPosts(limit) {
  return getAllBlogPosts({ status: "published", limit });
}
async function getBlogPostBySlug(slug) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getBlogPostById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createBlogPost(post) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(blogPosts).values(post).returning();
  return result[0];
}
async function updateBlogPost(id, post) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(blogPosts).set({ ...post, updatedAt: /* @__PURE__ */ new Date() }).where(eq(blogPosts.id, id));
}
async function deleteBlogPost(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}
async function getAllBlogCategories() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(blogCategories).orderBy(asc(blogCategories.name));
}
async function createBlogCategory(category) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(blogCategories).values(category).returning();
  return result[0];
}
async function deleteBlogCategory(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(blogCategories).where(eq(blogCategories.id, id));
}
async function getAllBlogTags() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(blogTags).orderBy(asc(blogTags.name));
}
async function createBlogTag(tag) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(blogTags).values(tag).returning();
  return result[0];
}
async function deleteBlogTag(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(blogTags).where(eq(blogTags.id, id));
}
async function setPostCategories(postId, categoryIds) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(postCategories).where(eq(postCategories.postId, postId));
  if (categoryIds.length > 0) {
    await db.insert(postCategories).values(categoryIds.map((categoryId) => ({ postId, categoryId })));
  }
}
async function getPostCategories(postId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select({ category: blogCategories }).from(postCategories).innerJoin(blogCategories, eq(postCategories.categoryId, blogCategories.id)).where(eq(postCategories.postId, postId));
}
async function setPostTags(postId, tagIds) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(postTags).where(eq(postTags.postId, postId));
  if (tagIds.length > 0) {
    await db.insert(postTags).values(tagIds.map((tagId) => ({ postId, tagId })));
  }
}
async function getPostTags(postId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select({ tag: blogTags }).from(postTags).innerJoin(blogTags, eq(postTags.tagId, blogTags.id)).where(eq(postTags.postId, postId));
}
async function bulkCreateProducts(productList) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(products).values(productList).returning();
  return result;
}

// server/routers.ts
import slugify from "slugify";
import { parse } from "csv-parse/sync";
var adminProcedure2 = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError2({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: protectedProcedure.mutation(async () => {
      return { success: true };
    })
  }),
  // Legacy products router - products now come from Sanity
  // This endpoint is deprecated, use catalog.availability instead
  products: router({
    list: publicProcedure.input(
      z2.object({
        brand: z2.string().optional(),
        category: z2.string().optional(),
        ageRange: z2.string().optional(),
        season: z2.string().optional()
      }).optional()
    ).query(async ({ input }) => {
      const allProducts = await getAllProducts();
      const productsWithAvailability = await Promise.all(
        allProducts.map(async (product) => {
          const availableCount = product.slug ? await getAvailableInventoryCount(product.slug) : 0;
          return {
            ...product,
            availableCount,
            lowStock: availableCount > 0 && availableCount < 3
          };
        })
      );
      let filtered = productsWithAvailability;
      if (input?.brand) {
        filtered = filtered.filter((p) => p.brand === input.brand);
      }
      if (input?.category) {
        filtered = filtered.filter((p) => p.category === input.category);
      }
      if (input?.ageRange) {
        filtered = filtered.filter((p) => p.ageRange === input.ageRange);
      }
      if (input?.season) {
        filtered = filtered.filter((p) => p.season === input.season);
      }
      return filtered;
    }),
    getById: publicProcedure.input(z2.object({ id: z2.number() })).query(async ({ input }) => {
      const product = await getProductById(input.id);
      if (!product) {
        throw new TRPCError2({ code: "NOT_FOUND", message: "Product not found" });
      }
      const availableCount = product.slug ? await getAvailableInventoryCount(product.slug) : 0;
      return {
        ...product,
        availableCount,
        lowStock: availableCount > 0 && availableCount < 3
      };
    }),
    getBySlug: publicProcedure.input(z2.object({ slug: z2.string() })).query(async ({ input }) => {
      const product = await getProductBySlug(input.slug);
      if (!product) {
        throw new TRPCError2({ code: "NOT_FOUND", message: "Product not found" });
      }
      const availableCount = await getAvailableInventoryCount(input.slug);
      return {
        ...product,
        availableCount,
        lowStock: availableCount > 0 && availableCount < 3
      };
    }),
    getBrands: publicProcedure.query(async () => {
      const products2 = await getAllProducts();
      const brandSet = new Set(products2.map((p) => p.brand));
      const brands = Array.from(brandSet);
      return brands.sort();
    })
  }),
  // Catalog endpoints for Sanity products with PostgreSQL availability
  catalog: router({
    // Get availability counts for multiple products by slug
    availability: publicProcedure.input(z2.object({ slugs: z2.array(z2.string()) })).query(async ({ input }) => {
      return await getAvailableInventoryCountBatch(input.slugs);
    })
  }),
  // Cart now uses Sanity product slugs
  cart: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const slugs = await getCartSlugs(ctx.user.id);
      return slugs;
    }),
    add: protectedProcedure.input(z2.object({ slug: z2.string() })).mutation(async ({ ctx, input }) => {
      const currentCount = await getCartCount(ctx.user.id);
      if (currentCount >= 5) {
        throw new TRPCError2({
          code: "BAD_REQUEST",
          message: "Cart is full. You can only select 5 items."
        });
      }
      const availableCount = await getAvailableInventoryCount(input.slug);
      if (availableCount === 0) {
        throw new TRPCError2({
          code: "BAD_REQUEST",
          message: "This item is currently out of stock."
        });
      }
      try {
        await addToCart(ctx.user.id, input.slug);
      } catch (error) {
        if (error.message === "Product already in cart") {
          throw new TRPCError2({
            code: "BAD_REQUEST",
            message: "This item is already in your box."
          });
        }
        throw error;
      }
      return { success: true };
    }),
    remove: protectedProcedure.input(z2.object({ slug: z2.string() })).mutation(async ({ ctx, input }) => {
      await removeFromCart(ctx.user.id, input.slug);
      return { success: true };
    }),
    clear: protectedProcedure.mutation(async ({ ctx }) => {
      await clearCart(ctx.user.id);
      return { success: true };
    }),
    count: protectedProcedure.query(async ({ ctx }) => {
      return await getCartCount(ctx.user.id);
    }),
    isInCart: protectedProcedure.input(z2.object({ slug: z2.string() })).query(async ({ ctx, input }) => {
      return await isInCart(ctx.user.id, input.slug);
    })
  }),
  // Swap items for next box selection
  swap: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const subscription = await getUserSubscription(ctx.user.id);
      if (!subscription) return [];
      return await getSwapSlugs(subscription.id);
    }),
    add: protectedProcedure.input(z2.object({ slug: z2.string() })).mutation(async ({ ctx, input }) => {
      const subscription = await getUserSubscription(ctx.user.id);
      if (!subscription) {
        throw new TRPCError2({ code: "NOT_FOUND", message: "No subscription found." });
      }
      const cycleEnd = new Date(subscription.cycleEndDate);
      const today = /* @__PURE__ */ new Date();
      const daysRemaining = Math.ceil((cycleEnd.getTime() - today.getTime()) / (1e3 * 60 * 60 * 24));
      if (daysRemaining > 10) {
        throw new TRPCError2({
          code: "BAD_REQUEST",
          message: "Swap window is not open yet."
        });
      }
      const currentCount = await getSwapCount(subscription.id);
      if (currentCount >= 5) {
        throw new TRPCError2({
          code: "BAD_REQUEST",
          message: "You've already selected 5 items for your next box."
        });
      }
      const availableCount = await getAvailableInventoryCount(input.slug);
      if (availableCount === 0) {
        throw new TRPCError2({
          code: "BAD_REQUEST",
          message: "This item is currently out of stock."
        });
      }
      await addToSwap(subscription.id, input.slug);
      return { success: true };
    }),
    remove: protectedProcedure.input(z2.object({ slug: z2.string() })).mutation(async ({ ctx, input }) => {
      const subscription = await getUserSubscription(ctx.user.id);
      if (!subscription) {
        throw new TRPCError2({ code: "NOT_FOUND", message: "No subscription found." });
      }
      await removeFromSwap(subscription.id, input.slug);
      return { success: true };
    }),
    count: protectedProcedure.query(async ({ ctx }) => {
      const subscription = await getUserSubscription(ctx.user.id);
      if (!subscription) return 0;
      return await getSwapCount(subscription.id);
    }),
    confirm: protectedProcedure.mutation(async ({ ctx }) => {
      const subscription = await getUserSubscription(ctx.user.id);
      if (!subscription) {
        throw new TRPCError2({ code: "NOT_FOUND", message: "No subscription found." });
      }
      const swapCount = await getSwapCount(subscription.id);
      if (swapCount !== 5) {
        throw new TRPCError2({
          code: "BAD_REQUEST",
          message: "You must select exactly 5 items for your next box."
        });
      }
      const swapSlugs = await getSwapSlugs(subscription.id);
      const startDate = new Date(subscription.cycleEndDate);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 3);
      const returnByDate = new Date(endDate);
      returnByDate.setDate(returnByDate.getDate() + 7);
      const existingBoxes = await getBoxesBySubscription(subscription.id);
      const cycleNumber = existingBoxes.length + 1;
      const box = await createBox({
        subscriptionId: subscription.id,
        cycleNumber,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        returnByDate: returnByDate.toISOString().split("T")[0],
        status: "confirmed"
      });
      for (const slug of swapSlugs) {
        const inventoryItem = await getFirstAvailableInventoryItem(slug);
        if (inventoryItem) {
          await addItemToBox(box.id, inventoryItem.id);
          await updateInventoryItemState(inventoryItem.id, "active");
        }
      }
      await clearSwapItems(subscription.id);
      return { success: true, boxId: box.id };
    })
  }),
  subscription: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const subscription = await getUserSubscription(ctx.user.id);
      return subscription;
    }),
    create: protectedProcedure.input(
      z2.object({
        shippingAddress: z2.string(),
        phone: z2.string().optional()
      })
    ).mutation(async ({ ctx, input }) => {
      const existing = await getUserSubscription(ctx.user.id);
      if (existing && existing.status === "active") {
        throw new TRPCError2({
          code: "BAD_REQUEST",
          message: "You already have an active subscription."
        });
      }
      const cartCount = await getCartCount(ctx.user.id);
      if (cartCount !== 5) {
        throw new TRPCError2({
          code: "BAD_REQUEST",
          message: "You must select exactly 5 items to subscribe."
        });
      }
      await updateUserShippingAddress(ctx.user.id, input.shippingAddress);
      const startDate = /* @__PURE__ */ new Date();
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 3);
      const nextBillingDate = new Date(endDate);
      const subscription = await createSubscription({
        userId: ctx.user.id,
        status: "active",
        cycleStartDate: startDate.toISOString().split("T")[0],
        cycleEndDate: endDate.toISOString().split("T")[0],
        nextBillingDate: nextBillingDate.toISOString().split("T")[0],
        swapWindowOpen: false
      });
      const returnByDate = new Date(endDate);
      returnByDate.setDate(returnByDate.getDate() + 7);
      const box = await createBox({
        subscriptionId: subscription.id,
        cycleNumber: 1,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        returnByDate: returnByDate.toISOString().split("T")[0],
        status: "confirmed"
      });
      const cartSlugs = await getCartSlugs(ctx.user.id);
      for (const slug of cartSlugs) {
        const inventoryItem = await getFirstAvailableInventoryItem(slug);
        if (inventoryItem) {
          await addItemToBox(box.id, inventoryItem.id);
          await updateInventoryItemState(inventoryItem.id, "active");
        }
      }
      await clearCart(ctx.user.id);
      return {
        success: true,
        subscriptionId: subscription.id,
        boxId: box.id
      };
    }),
    pause: protectedProcedure.mutation(async ({ ctx }) => {
      const subscription = await getUserSubscription(ctx.user.id);
      if (!subscription) {
        throw new TRPCError2({ code: "NOT_FOUND", message: "No subscription found." });
      }
      await updateSubscriptionStatus(subscription.id, "paused");
      return { success: true };
    }),
    cancel: protectedProcedure.mutation(async ({ ctx }) => {
      const subscription = await getUserSubscription(ctx.user.id);
      if (!subscription) {
        throw new TRPCError2({ code: "NOT_FOUND", message: "No subscription found." });
      }
      await updateSubscriptionStatus(subscription.id, "cancelled");
      return { success: true };
    })
  }),
  box: router({
    current: protectedProcedure.query(async ({ ctx }) => {
      const subscription = await getUserSubscription(ctx.user.id);
      if (!subscription) return null;
      const box = await getCurrentBox(subscription.id);
      if (!box) return null;
      const items = await getBoxItems(box.id);
      return {
        ...box,
        items
      };
    }),
    history: protectedProcedure.query(async ({ ctx }) => {
      const subscription = await getUserSubscription(ctx.user.id);
      if (!subscription) return [];
      const boxes2 = await getBoxesBySubscription(subscription.id);
      return boxes2;
    })
  }),
  // ============ BLOG ============
  blog: router({
    // Public blog endpoints
    posts: publicProcedure.input(
      z2.object({
        limit: z2.number().optional()
      }).optional()
    ).query(async ({ input }) => {
      const posts = await getPublishedBlogPosts(input?.limit);
      return posts;
    }),
    postBySlug: publicProcedure.input(z2.object({ slug: z2.string() })).query(async ({ input }) => {
      const post = await getBlogPostBySlug(input.slug);
      if (!post || post.status !== "published") {
        throw new TRPCError2({ code: "NOT_FOUND", message: "Blog post not found" });
      }
      const categories = await getPostCategories(post.id);
      const tags = await getPostTags(post.id);
      return {
        ...post,
        categories: categories.map((c) => c.category),
        tags: tags.map((t2) => t2.tag)
      };
    }),
    categories: publicProcedure.query(async () => {
      return await getAllBlogCategories();
    }),
    tags: publicProcedure.query(async () => {
      return await getAllBlogTags();
    })
  }),
  // ============ ADMIN ============
  admin: router({
    // ---- Inventory Management ----
    inventory: router({
      list: adminProcedure2.query(async () => {
        return await getAllInventoryItems();
      }),
      updateState: adminProcedure2.input(
        z2.object({
          itemId: z2.number(),
          state: z2.enum(["available", "active", "in_transit", "quarantine", "retired"]),
          notes: z2.string().optional()
        })
      ).mutation(async ({ input }) => {
        await updateInventoryItemState(input.itemId, input.state, input.notes);
        return { success: true };
      }),
      retire: adminProcedure2.input(
        z2.object({
          itemId: z2.number(),
          reason: z2.string()
        })
      ).mutation(async ({ input }) => {
        await retireInventoryItem(input.itemId, input.reason);
        return { success: true };
      }),
      stats: adminProcedure2.query(async () => {
        return await getInventoryStats();
      }),
      create: adminProcedure2.input(
        z2.object({
          sanityProductSlug: z2.string(),
          sku: z2.string()
        })
      ).mutation(async ({ input }) => {
        await createInventoryItem({
          sanityProductSlug: input.sanityProductSlug,
          sku: input.sku,
          state: "available"
        });
        return { success: true };
      }),
      bulkCreate: adminProcedure2.input(
        z2.object({
          items: z2.array(
            z2.object({
              sanityProductSlug: z2.string(),
              sku: z2.string()
            })
          )
        })
      ).mutation(async ({ input }) => {
        await bulkCreateInventoryItems(
          input.items.map((item) => ({
            sanityProductSlug: item.sanityProductSlug,
            sku: item.sku,
            state: "available"
          }))
        );
        return { success: true, count: input.items.length };
      })
    }),
    // ---- Subscription Management ----
    subscriptions: router({
      list: adminProcedure2.query(async () => {
        return await getAllSubscriptions();
      })
    }),
    // ---- Product Management ----
    products: router({
      list: adminProcedure2.query(async () => {
        return await getAllProducts();
      }),
      create: adminProcedure2.input(
        z2.object({
          brand: z2.string(),
          name: z2.string(),
          description: z2.string(),
          category: z2.enum([
            "bodysuit",
            "sleepsuit",
            "joggers",
            "jacket",
            "cardigan",
            "top",
            "bottom",
            "dress",
            "outerwear",
            "swimwear",
            "hat",
            "shoes",
            "pjs",
            "overall"
          ]),
          ageRange: z2.enum(["0-3m", "3-6m", "6-12m", "12-18m", "18-24m"]),
          season: z2.enum(["summer", "winter", "all-season"]),
          rrpPrice: z2.string(),
          imageUrl: z2.string().optional()
        })
      ).mutation(async ({ input }) => {
        const product = await createProduct({
          brand: input.brand,
          name: input.name,
          description: input.description,
          category: input.category,
          ageRange: input.ageRange,
          season: input.season,
          rrpPrice: input.rrpPrice,
          imageUrl: input.imageUrl,
          ozoneCleaned: true,
          insuranceIncluded: true
        });
        return { success: true, product };
      }),
      update: adminProcedure2.input(
        z2.object({
          id: z2.number(),
          brand: z2.string().optional(),
          name: z2.string().optional(),
          description: z2.string().optional(),
          category: z2.enum([
            "bodysuit",
            "sleepsuit",
            "joggers",
            "jacket",
            "cardigan",
            "top",
            "bottom",
            "dress",
            "outerwear",
            "swimwear",
            "hat",
            "shoes",
            "pjs",
            "overall"
          ]).optional(),
          ageRange: z2.enum(["0-3m", "3-6m", "6-12m", "12-18m", "18-24m"]).optional(),
          season: z2.enum(["summer", "winter", "all-season"]).optional(),
          rrpPrice: z2.string().optional(),
          imageUrl: z2.string().optional()
        })
      ).mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateProduct(id, data);
        return { success: true };
      }),
      delete: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
        await deleteProduct(input.id);
        return { success: true };
      }),
      uploadImage: adminProcedure2.input(
        z2.object({
          fileName: z2.string(),
          fileData: z2.string(),
          // Base64 encoded
          contentType: z2.string()
        })
      ).mutation(async ({ input }) => {
        const buffer = Buffer.from(input.fileData, "base64");
        const path = `products/${Date.now()}-${input.fileName}`;
        const url = await uploadToStorage("product-images", path, buffer, input.contentType);
        return { success: true, url };
      }),
      bulkImport: adminProcedure2.input(
        z2.object({
          csvData: z2.string()
        })
      ).mutation(async ({ input }) => {
        const records = parse(input.csvData, {
          columns: true,
          skip_empty_lines: true,
          trim: true
        });
        const products2 = records.map((record) => ({
          brand: record.brand,
          name: record.name,
          description: record.description,
          category: record.category,
          ageRange: record.ageRange,
          season: record.season,
          rrpPrice: record.rrpPrice,
          imageUrl: record.imageUrl || null,
          ozoneCleaned: true,
          insuranceIncluded: true
        }));
        const result = await bulkCreateProducts(products2);
        return { success: true, count: result.length };
      })
    }),
    // ---- Blog Management ----
    blog: router({
      posts: adminProcedure2.query(async () => {
        return await getAllBlogPosts();
      }),
      getPost: adminProcedure2.input(z2.object({ id: z2.number() })).query(async ({ input }) => {
        const post = await getBlogPostById(input.id);
        if (!post) {
          throw new TRPCError2({ code: "NOT_FOUND", message: "Post not found" });
        }
        const categories = await getPostCategories(post.id);
        const tags = await getPostTags(post.id);
        return {
          ...post,
          categoryIds: categories.map((c) => c.category.id),
          tagIds: tags.map((t2) => t2.tag.id)
        };
      }),
      createPost: adminProcedure2.input(
        z2.object({
          title: z2.string(),
          content: z2.string(),
          excerpt: z2.string().optional(),
          featuredImage: z2.string().optional(),
          status: z2.enum(["draft", "published", "archived"]).default("draft"),
          metaTitle: z2.string().optional(),
          metaDescription: z2.string().optional(),
          ogImage: z2.string().optional(),
          categoryIds: z2.array(z2.number()).optional(),
          tagIds: z2.array(z2.number()).optional()
        })
      ).mutation(async ({ ctx, input }) => {
        const slug = slugify(input.title, { lower: true, strict: true });
        const existing = await getBlogPostBySlug(slug);
        const finalSlug = existing ? `${slug}-${Date.now()}` : slug;
        const post = await createBlogPost({
          slug: finalSlug,
          title: input.title,
          content: input.content,
          excerpt: input.excerpt,
          featuredImage: input.featuredImage,
          authorId: ctx.user.id,
          status: input.status,
          publishedAt: input.status === "published" ? /* @__PURE__ */ new Date() : null,
          metaTitle: input.metaTitle,
          metaDescription: input.metaDescription,
          ogImage: input.ogImage
        });
        if (input.categoryIds?.length) {
          await setPostCategories(post.id, input.categoryIds);
        }
        if (input.tagIds?.length) {
          await setPostTags(post.id, input.tagIds);
        }
        return { success: true, post };
      }),
      updatePost: adminProcedure2.input(
        z2.object({
          id: z2.number(),
          title: z2.string().optional(),
          content: z2.string().optional(),
          excerpt: z2.string().optional(),
          featuredImage: z2.string().optional(),
          status: z2.enum(["draft", "published", "archived"]).optional(),
          metaTitle: z2.string().optional(),
          metaDescription: z2.string().optional(),
          ogImage: z2.string().optional(),
          categoryIds: z2.array(z2.number()).optional(),
          tagIds: z2.array(z2.number()).optional()
        })
      ).mutation(async ({ input }) => {
        const { id, categoryIds, tagIds, ...data } = input;
        if (data.status === "published") {
          const existing = await getBlogPostById(id);
          if (existing && !existing.publishedAt) {
            data.publishedAt = /* @__PURE__ */ new Date();
          }
        }
        await updateBlogPost(id, data);
        if (categoryIds !== void 0) {
          await setPostCategories(id, categoryIds);
        }
        if (tagIds !== void 0) {
          await setPostTags(id, tagIds);
        }
        return { success: true };
      }),
      deletePost: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
        await deleteBlogPost(input.id);
        return { success: true };
      }),
      // Categories
      categories: adminProcedure2.query(async () => {
        return await getAllBlogCategories();
      }),
      createCategory: adminProcedure2.input(
        z2.object({
          name: z2.string(),
          description: z2.string().optional()
        })
      ).mutation(async ({ input }) => {
        const slug = slugify(input.name, { lower: true, strict: true });
        const category = await createBlogCategory({
          name: input.name,
          slug,
          description: input.description
        });
        return { success: true, category };
      }),
      deleteCategory: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
        await deleteBlogCategory(input.id);
        return { success: true };
      }),
      // Tags
      tags: adminProcedure2.query(async () => {
        return await getAllBlogTags();
      }),
      createTag: adminProcedure2.input(z2.object({ name: z2.string() })).mutation(async ({ input }) => {
        const slug = slugify(input.name, { lower: true, strict: true });
        const tag = await createBlogTag({
          name: input.name,
          slug
        });
        return { success: true, tag };
      }),
      deleteTag: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
        await deleteBlogTag(input.id);
        return { success: true };
      }),
      uploadImage: adminProcedure2.input(
        z2.object({
          fileName: z2.string(),
          fileData: z2.string(),
          // Base64 encoded
          contentType: z2.string()
        })
      ).mutation(async ({ input }) => {
        const buffer = Buffer.from(input.fileData, "base64");
        const path = `blog/${Date.now()}-${input.fileName}`;
        const url = await uploadToStorage("blog-images", path, buffer, input.contentType);
        return { success: true, url };
      })
    })
  })
});

// api/handler.ts
async function handler(req, res) {
  if (req.url?.includes("/api/health")) {
    res.status(200).json({ ok: true });
    return;
  }
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
    res.status(200).end();
    return;
  }
  if (req.url?.includes("/api/trpc")) {
    try {
      const protocol = req.headers["x-forwarded-proto"] || "https";
      const host = req.headers.host || "localhost";
      const url = `${protocol}://${host}${req.url}`;
      const body = req.method !== "GET" && req.body ? JSON.stringify(req.body) : void 0;
      const fetchReq = new Request(url, {
        method: req.method || "GET",
        headers: Object.fromEntries(
          Object.entries(req.headers).filter(([_, v]) => v !== void 0)
        ),
        body
      });
      const response = await fetchRequestHandler({
        endpoint: "/api/trpc",
        req: fetchReq,
        router: appRouter,
        createContext: async () => ({
          req,
          res,
          user: null
        })
      });
      res.setHeader("Access-Control-Allow-Origin", "*");
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      const responseBody = await response.text();
      res.status(response.status).send(responseBody);
    } catch (error) {
      console.error("tRPC error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
    return;
  }
  res.status(404).json({ error: "Not found" });
}
export {
  handler as default
};
