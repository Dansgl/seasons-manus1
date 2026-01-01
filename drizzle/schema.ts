import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, date } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // Shipping address stored as JSON
  shippingAddress: text("shippingAddress"),
  phone: varchar("phone", { length: 32 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Products table - represents the catalog of luxury baby clothing items
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  brand: varchar("brand", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", [
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
  ]).notNull(),
  ageRange: mysqlEnum("ageRange", [
    "0-3m",
    "3-6m",
    "6-12m",
    "12-18m",
    "18-24m"
  ]).notNull(),
  season: mysqlEnum("season", ["summer", "winter", "all-season"]).notNull(),
  rrpPrice: decimal("rrpPrice", { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }),
  ozoneCleaned: boolean("ozoneCleaned").default(true).notNull(),
  insuranceIncluded: boolean("insuranceIncluded").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Inventory Items - individual physical items that can be rented
 * Each product can have multiple inventory items (different SKUs)
 * State machine: available → active → in_transit → quarantine → available
 */
export const inventoryItems = mysqlTable("inventoryItems", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  state: mysqlEnum("state", ["available", "active", "in_transit", "quarantine", "retired"]).default("available").notNull(),
  conditionNotes: text("conditionNotes"),
  quarantineUntil: date("quarantineUntil"),
  retirementReason: text("retirementReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InsertInventoryItem = typeof inventoryItems.$inferInsert;

/**
 * Subscriptions - user's quarterly subscription
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  status: mysqlEnum("status", ["active", "paused", "cancelled"]).default("active").notNull(),
  cycleStartDate: date("cycleStartDate").notNull(),
  cycleEndDate: date("cycleEndDate").notNull(),
  nextBillingDate: date("nextBillingDate").notNull(),
  swapWindowOpen: boolean("swapWindowOpen").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Boxes - represents a rental cycle (3 months)
 */
export const boxes = mysqlTable("boxes", {
  id: int("id").autoincrement().primaryKey(),
  subscriptionId: int("subscriptionId").notNull(),
  cycleNumber: int("cycleNumber").notNull(),
  startDate: date("startDate").notNull(),
  endDate: date("endDate").notNull(),
  returnByDate: date("returnByDate").notNull(),
  status: mysqlEnum("status", [
    "selecting",
    "confirmed",
    "shipped",
    "active",
    "swap_pending",
    "returned",
    "completed"
  ]).default("selecting").notNull(),
  shippingLabelUrl: varchar("shippingLabelUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Box = typeof boxes.$inferSelect;
export type InsertBox = typeof boxes.$inferInsert;

/**
 * Box Items - junction table linking boxes to inventory items
 */
export const boxItems = mysqlTable("boxItems", {
  id: int("id").autoincrement().primaryKey(),
  boxId: int("boxId").notNull(),
  inventoryItemId: int("inventoryItemId").notNull(),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
});

export type BoxItem = typeof boxItems.$inferSelect;
export type InsertBoxItem = typeof boxItems.$inferInsert;

/**
 * Cart - temporary storage for user's current selection (before checkout)
 */
export const cartItems = mysqlTable("cartItems", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;
