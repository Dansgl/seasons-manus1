import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(role: "user" | "admin" = "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@seasons.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("Products API", () => {
  it("should list all products", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const products = await caller.products.list();

    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it("should filter products by brand", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const products = await caller.products.list({ brand: "MORI" });

    expect(products).toBeDefined();
    expect(products.every(p => p.brand === "MORI")).toBe(true);
  });

  it("should get product by id with availability", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const products = await caller.products.list();
    const firstProduct = products[0];

    if (firstProduct) {
      const product = await caller.products.getById({ id: firstProduct.id });

      expect(product).toBeDefined();
      expect(product.id).toBe(firstProduct.id);
      expect(product).toHaveProperty("availableCount");
    }
  });

  it("should get list of brands", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const brands = await caller.products.getBrands();

    expect(brands).toBeDefined();
    expect(Array.isArray(brands)).toBe(true);
    expect(brands.length).toBeGreaterThan(0);
  });
});

describe("Cart API", () => {
  it("should add product to cart", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Clear cart first
    await caller.cart.clear();

    const products = await caller.products.list();
    const availableProduct = products.find(p => p.availableCount > 0);

    if (availableProduct) {
      const result = await caller.cart.add({ productId: availableProduct.id });

      expect(result.success).toBe(true);

      const cartCount = await caller.cart.count();
      expect(cartCount).toBeGreaterThan(0);
    }
  });

  it("should enforce 5-item cart limit", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Clear cart first
    await caller.cart.clear();

    const products = await caller.products.list();
    const availableProducts = products.filter(p => p.availableCount > 0).slice(0, 6);

    // Add 5 items successfully
    for (let i = 0; i < 5; i++) {
      if (availableProducts[i]) {
        await caller.cart.add({ productId: availableProducts[i].id });
      }
    }

    const cartCount = await caller.cart.count();
    expect(cartCount).toBe(5);

    // Try to add 6th item - should fail
    if (availableProducts[5]) {
      await expect(
        caller.cart.add({ productId: availableProducts[5].id })
      ).rejects.toThrow("Cart is full");
    }
  });

  it("should remove product from cart", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await caller.cart.clear();

    const products = await caller.products.list();
    const availableProduct = products.find(p => p.availableCount > 0);

    if (availableProduct) {
      await caller.cart.add({ productId: availableProduct.id });
      
      const result = await caller.cart.remove({ productId: availableProduct.id });
      expect(result.success).toBe(true);

      const cartCount = await caller.cart.count();
      expect(cartCount).toBe(0);
    }
  });

  it("should get cart items", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await caller.cart.clear();

    const products = await caller.products.list();
    const availableProduct = products.find(p => p.availableCount > 0);

    if (availableProduct) {
      await caller.cart.add({ productId: availableProduct.id });
      
      const cartItems = await caller.cart.get();
      expect(cartItems).toBeDefined();
      expect(Array.isArray(cartItems)).toBe(true);
      expect(cartItems.length).toBeGreaterThan(0);
    }
  });
});

describe("Subscription API", () => {
  it("should require exactly 5 items to create subscription", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await caller.cart.clear();

    // Try with less than 5 items
    await expect(
      caller.subscription.create({
        shippingAddress: "123 Test St, Test City, 12345",
        phone: "+1234567890",
      })
    ).rejects.toThrow("exactly 5 items");
  });

  it("should get user subscription", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const subscription = await caller.subscription.get();
    
    // May be null or undefined if no subscription exists
    expect(subscription === null || subscription === undefined || typeof subscription === "object").toBe(true);
  });
});

describe("Admin API", () => {
  it("should require admin role for inventory access", async () => {
    const ctx = createAuthContext("user"); // Regular user
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.admin.inventory.list()
    ).rejects.toThrow("Admin access required");
  });

  it("should allow admin to list inventory", async () => {
    const ctx = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const inventory = await caller.admin.inventory.list();

    expect(inventory).toBeDefined();
    expect(Array.isArray(inventory)).toBe(true);
  });

  it("should allow admin to get inventory stats", async () => {
    const ctx = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.admin.inventory.stats();

    expect(stats).toBeDefined();
    expect(stats).toHaveProperty("total");
    expect(stats).toHaveProperty("available");
    expect(stats).toHaveProperty("active");
    expect(stats).toHaveProperty("quarantine");
  });

  it("should allow admin to update inventory state", async () => {
    const ctx = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const inventory = await caller.admin.inventory.list();
    const firstItem = inventory[0];

    if (firstItem) {
      const result = await caller.admin.inventory.updateState({
        itemId: firstItem.id,
        state: "quarantine",
        notes: "Test quarantine",
      });

      expect(result.success).toBe(true);
    }
  });

  it("should allow admin to list subscriptions", async () => {
    const ctx = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const subscriptions = await caller.admin.subscriptions.list();

    expect(subscriptions).toBeDefined();
    expect(Array.isArray(subscriptions)).toBe(true);
  });
});

describe("Box API", () => {
  it("should get current box for user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const currentBox = await caller.box.current();
    
    // May be null if no active box
    expect(currentBox === null || typeof currentBox === "object").toBe(true);
  });

  it("should get box history", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const history = await caller.box.history();

    expect(history).toBeDefined();
    expect(Array.isArray(history)).toBe(true);
  });
});

describe("Database Helpers", () => {
  it("should calculate available inventory count correctly", async () => {
    const products = await db.getAllProducts();
    const firstProduct = products[0];

    if (firstProduct) {
      const count = await db.getAvailableInventoryCount(firstProduct.id);
      expect(typeof count).toBe("number");
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  it("should get inventory stats", async () => {
    const stats = await db.getInventoryStats();

    expect(stats).toBeDefined();
    expect(stats.total).toBeGreaterThanOrEqual(0);
    expect(stats.available).toBeGreaterThanOrEqual(0);
    expect(stats.active).toBeGreaterThanOrEqual(0);
  });
});
