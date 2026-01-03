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

// ============ ENUMS ============

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const categoryEnum = pgEnum("category", [
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

export const ageRangeEnum = pgEnum("age_range", [
  "0-3m",
  "3-6m",
  "6-12m",
  "12-18m",
  "18-24m"
]);

export const seasonEnum = pgEnum("season", ["summer", "winter", "all-season"]);

export const inventoryStateEnum = pgEnum("inventory_state", [
  "available",
  "active",
  "in_transit",
  "quarantine",
  "retired"
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "paused",
  "cancelled"
]);

export const boxStatusEnum = pgEnum("box_status", [
  "selecting",
  "confirmed",
  "shipped",
  "active",
  "swap_pending",
  "returned",
  "completed"
]);

export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "published",
  "archived"
]);

// ============ USERS ============

export const users = pgTable("users", {
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
  lastSignedIn: timestamp("last_signed_in", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============ PRODUCTS ============

export const products = pgTable("products", {
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
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// ============ INVENTORY ITEMS ============
// Physical inventory items - link to Sanity products via slug

export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  // Link to Sanity product by slug (primary way to identify product)
  sanityProductSlug: varchar("sanity_product_slug", { length: 255 }).notNull(),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  state: inventoryStateEnum("state").default("available").notNull(),
  conditionNotes: text("condition_notes"),
  quarantineUntil: date("quarantine_until"),
  retirementReason: text("retirement_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InsertInventoryItem = typeof inventoryItems.$inferInsert;

// ============ SUBSCRIPTIONS ============

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  status: subscriptionStatusEnum("status").default("active").notNull(),
  cycleStartDate: date("cycle_start_date").notNull(),
  cycleEndDate: date("cycle_end_date").notNull(),
  nextBillingDate: date("next_billing_date").notNull(),
  swapWindowOpen: boolean("swap_window_open").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

// ============ BOXES ============

export const boxes = pgTable("boxes", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscription_id").notNull().references(() => subscriptions.id),
  cycleNumber: integer("cycle_number").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  returnByDate: date("return_by_date").notNull(),
  status: boxStatusEnum("status").default("selecting").notNull(),
  shippingLabelUrl: varchar("shipping_label_url", { length: 500 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Box = typeof boxes.$inferSelect;
export type InsertBox = typeof boxes.$inferInsert;

// ============ BOX ITEMS ============

export const boxItems = pgTable("box_items", {
  id: serial("id").primaryKey(),
  boxId: integer("box_id").notNull().references(() => boxes.id),
  inventoryItemId: integer("inventory_item_id").notNull().references(() => inventoryItems.id),
  addedAt: timestamp("added_at", { withTimezone: true }).defaultNow().notNull(),
});

export type BoxItem = typeof boxItems.$inferSelect;
export type InsertBoxItem = typeof boxItems.$inferInsert;

// ============ CART ITEMS ============
// Cart now references Sanity products by slug (not PostgreSQL products)

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  // Reference to Sanity product by slug
  sanityProductSlug: varchar("sanity_product_slug", { length: 255 }).notNull(),
  addedAt: timestamp("added_at", { withTimezone: true }).defaultNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

// ============ SWAP ITEMS (for next box selection) ============

export const swapItems = pgTable("swap_items", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscription_id").notNull().references(() => subscriptions.id),
  sanityProductSlug: varchar("sanity_product_slug", { length: 255 }).notNull(),
  addedAt: timestamp("added_at", { withTimezone: true }).defaultNow().notNull(),
});

export type SwapItem = typeof swapItems.$inferSelect;
export type InsertSwapItem = typeof swapItems.$inferInsert;

// ============ BLOG POSTS ============

export const blogPosts = pgTable("blog_posts", {
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
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// ============ BLOG CATEGORIES ============

export const blogCategories = pgTable("blog_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type BlogCategory = typeof blogCategories.$inferSelect;
export type InsertBlogCategory = typeof blogCategories.$inferInsert;

// ============ BLOG TAGS ============

export const blogTags = pgTable("blog_tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type BlogTag = typeof blogTags.$inferSelect;
export type InsertBlogTag = typeof blogTags.$inferInsert;

// ============ POST CATEGORIES (Junction) ============

export const postCategories = pgTable("post_categories", {
  postId: integer("post_id").notNull().references(() => blogPosts.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").notNull().references(() => blogCategories.id, { onDelete: "cascade" }),
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.categoryId] }),
}));

export type PostCategory = typeof postCategories.$inferSelect;
export type InsertPostCategory = typeof postCategories.$inferInsert;

// ============ POST TAGS (Junction) ============

export const postTags = pgTable("post_tags", {
  postId: integer("post_id").notNull().references(() => blogPosts.id, { onDelete: "cascade" }),
  tagId: integer("tag_id").notNull().references(() => blogTags.id, { onDelete: "cascade" }),
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.tagId] }),
}));

export type PostTag = typeof postTags.$inferSelect;
export type InsertPostTag = typeof postTags.$inferInsert;
