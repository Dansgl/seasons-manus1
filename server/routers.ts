import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  products: router({
    list: publicProcedure
      .input(z.object({
        brand: z.string().optional(),
        category: z.string().optional(),
        ageRange: z.string().optional(),
        season: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        const allProducts = await db.getAllProducts();
        
        // Get availability counts for each product
        const productsWithAvailability = await Promise.all(
          allProducts.map(async (product) => {
            const availableCount = await db.getAvailableInventoryCount(product.id);
            return {
              ...product,
              availableCount,
              lowStock: availableCount > 0 && availableCount < 3,
            };
          })
        );

        // Apply filters
        let filtered = productsWithAvailability;
        
        if (input?.brand) {
          filtered = filtered.filter(p => p.brand === input.brand);
        }
        if (input?.category) {
          filtered = filtered.filter(p => p.category === input.category);
        }
        if (input?.ageRange) {
          filtered = filtered.filter(p => p.ageRange === input.ageRange);
        }
        if (input?.season) {
          filtered = filtered.filter(p => p.season === input.season);
        }

        return filtered;
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const product = await db.getProductById(input.id);
        if (!product) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
        }
        
        const availableCount = await db.getAvailableInventoryCount(product.id);
        
        return {
          ...product,
          availableCount,
          lowStock: availableCount > 0 && availableCount < 3,
        };
      }),

    getBrands: publicProcedure.query(async () => {
      const products = await db.getAllProducts();
      const brandSet = new Set(products.map(p => p.brand));
      const brands = Array.from(brandSet);
      return brands.sort();
    }),
  }),

  cart: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const items = await db.getCartItems(ctx.user.id);
      return items;
    }),

    add: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // Check if cart already has 5 items
        const currentCount = await db.getCartCount(ctx.user.id);
        if (currentCount >= 5) {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'Cart is full. You can only select 5 items.' 
          });
        }

        // Check if product is available
        const availableCount = await db.getAvailableInventoryCount(input.productId);
        if (availableCount === 0) {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'This item is currently out of stock.' 
          });
        }

        await db.addToCart(ctx.user.id, input.productId);
        return { success: true };
      }),

    remove: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.removeFromCart(ctx.user.id, input.productId);
        return { success: true };
      }),

    clear: protectedProcedure.mutation(async ({ ctx }) => {
      await db.clearCart(ctx.user.id);
      return { success: true };
    }),

    count: protectedProcedure.query(async ({ ctx }) => {
      const count = await db.getCartCount(ctx.user.id);
      return count;
    }),
  }),

  subscription: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const subscription = await db.getUserSubscription(ctx.user.id);
      return subscription;
    }),

    create: protectedProcedure
      .input(z.object({
        shippingAddress: z.string(),
        phone: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if user already has a subscription
        const existing = await db.getUserSubscription(ctx.user.id);
        if (existing && existing.status === 'active') {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'You already have an active subscription.' 
          });
        }

        // Check if cart has exactly 5 items
        const cartCount = await db.getCartCount(ctx.user.id);
        if (cartCount !== 5) {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'You must select exactly 5 items to subscribe.' 
          });
        }

        // Update user's shipping address
        await db.updateUserShippingAddress(ctx.user.id, input.shippingAddress);

        // Calculate dates
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 3); // 3 months later
        
        const nextBillingDate = new Date(endDate);

        // Create subscription
        const subscriptionResult = await db.createSubscription({
          userId: ctx.user.id,
          status: 'active',
          cycleStartDate: startDate.toISOString().split('T')[0] as any,
          cycleEndDate: endDate.toISOString().split('T')[0] as any,
          nextBillingDate: nextBillingDate.toISOString().split('T')[0] as any,
          swapWindowOpen: false,
        });

        const subscriptionId = Number((subscriptionResult as any).insertId);

        // Create first box
        const returnByDate = new Date(endDate);
        returnByDate.setDate(returnByDate.getDate() + 7); // 7 days after cycle end

        const boxResult = await db.createBox({
          subscriptionId,
          cycleNumber: 1,
          startDate: startDate.toISOString().split('T')[0] as any,
          endDate: endDate.toISOString().split('T')[0] as any,
          returnByDate: returnByDate.toISOString().split('T')[0] as any,
          status: 'confirmed',
        });

        const boxId = Number((boxResult as any).insertId);

        // Get cart items and reserve inventory
        const cartItems = await db.getCartItems(ctx.user.id);
        
        for (const item of cartItems) {
          if (!item.product) continue;
          
          // Find available inventory item for this product
          const inventoryItems = await db.getInventoryItemsByProductId(item.product.id);
          const availableItem = inventoryItems.find(inv => inv.state === 'available');
          
          if (availableItem) {
            // Add to box
            await db.addItemToBox(boxId, availableItem.id);
            // Mark as active
            await db.updateInventoryItemState(availableItem.id, 'active');
          }
        }

        // Clear cart
        await db.clearCart(ctx.user.id);

        return { 
          success: true, 
          subscriptionId,
          boxId 
        };
      }),

    pause: protectedProcedure.mutation(async ({ ctx }) => {
      const subscription = await db.getUserSubscription(ctx.user.id);
      if (!subscription) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'No subscription found.' });
      }

      await db.updateSubscriptionStatus(subscription.id, 'paused');
      return { success: true };
    }),

    cancel: protectedProcedure.mutation(async ({ ctx }) => {
      const subscription = await db.getUserSubscription(ctx.user.id);
      if (!subscription) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'No subscription found.' });
      }

      await db.updateSubscriptionStatus(subscription.id, 'cancelled');
      return { success: true };
    }),
  }),

  box: router({
    current: protectedProcedure.query(async ({ ctx }) => {
      const subscription = await db.getUserSubscription(ctx.user.id);
      if (!subscription) return null;

      const box = await db.getCurrentBox(subscription.id);
      if (!box) return null;

      const items = await db.getBoxItems(box.id);
      
      return {
        ...box,
        items,
      };
    }),

    history: protectedProcedure.query(async ({ ctx }) => {
      const subscription = await db.getUserSubscription(ctx.user.id);
      if (!subscription) return [];

      const boxes = await db.getBoxesBySubscription(subscription.id);
      return boxes;
    }),
  }),

  admin: router({
    inventory: router({
      list: adminProcedure.query(async () => {
        const items = await db.getAllInventoryItems();
        
        // Enrich with product details
        const enriched = await Promise.all(
          items.map(async (item) => {
            const product = await db.getProductById(item.productId);
            return {
              ...item,
              product,
            };
          })
        );

        return enriched;
      }),

      updateState: adminProcedure
        .input(z.object({
          itemId: z.number(),
          state: z.enum(['available', 'active', 'in_transit', 'quarantine', 'retired']),
          notes: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
          await db.updateInventoryItemState(input.itemId, input.state, input.notes);
          return { success: true };
        }),

      retire: adminProcedure
        .input(z.object({
          itemId: z.number(),
          reason: z.string(),
        }))
        .mutation(async ({ input }) => {
          await db.retireInventoryItem(input.itemId, input.reason);
          return { success: true };
        }),

      stats: adminProcedure.query(async () => {
        return await db.getInventoryStats();
      }),

      create: adminProcedure
        .input(z.object({
          productId: z.number(),
          sku: z.string(),
        }))
        .mutation(async ({ input }) => {
          await db.createInventoryItem({
            productId: input.productId,
            sku: input.sku,
            state: 'available',
          });
          return { success: true };
        }),
    }),

    subscriptions: router({
      list: adminProcedure.query(async () => {
        return await db.getAllSubscriptions();
      }),
    }),

    products: router({
      create: adminProcedure
        .input(z.object({
          brand: z.string(),
          name: z.string(),
          description: z.string(),
          category: z.string(),
          ageRange: z.string(),
          season: z.string(),
          rrpPrice: z.string(),
          imageUrl: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
          await db.createProduct({
            brand: input.brand,
            name: input.name,
            description: input.description,
            category: input.category as any,
            ageRange: input.ageRange as any,
            season: input.season as any,
            rrpPrice: input.rrpPrice,
            imageUrl: input.imageUrl,
            ozoneCleaned: true,
            insuranceIncluded: true,
          });
          return { success: true };
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
