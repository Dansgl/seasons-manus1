import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { uploadToStorage } from "./_core/supabase";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import slugify from "slugify";
import { parse } from "csv-parse/sync";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: protectedProcedure.mutation(async () => {
      // Client-side handles the actual Supabase signOut
      // This endpoint just confirms the logout action
      return { success: true };
    }),
  }),

  // Legacy products router - products now come from Sanity
  // This endpoint is deprecated, use catalog.availability instead
  products: router({
    list: publicProcedure
      .input(
        z
          .object({
            brand: z.string().optional(),
            category: z.string().optional(),
            ageRange: z.string().optional(),
            season: z.string().optional(),
          })
          .optional()
      )
      .query(async ({ input }) => {
        const allProducts = await db.getAllProducts();

        // Get availability counts for each product by slug
        const productsWithAvailability = await Promise.all(
          allProducts.map(async (product) => {
            // Use slug instead of id for availability lookup
            const availableCount = product.slug
              ? await db.getAvailableInventoryCount(product.slug)
              : 0;
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

    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const product = await db.getProductById(input.id);
      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }

      // Use slug for availability lookup
      const availableCount = product.slug
        ? await db.getAvailableInventoryCount(product.slug)
        : 0;

      return {
        ...product,
        availableCount,
        lowStock: availableCount > 0 && availableCount < 3,
      };
    }),

    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      const product = await db.getProductBySlug(input.slug);
      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }

      // Use slug for availability lookup
      const availableCount = await db.getAvailableInventoryCount(input.slug);

      return {
        ...product,
        availableCount,
        lowStock: availableCount > 0 && availableCount < 3,
      };
    }),

    getBrands: publicProcedure.query(async () => {
      const products = await db.getAllProducts();
      const brandSet = new Set(products.map((p) => p.brand));
      const brands = Array.from(brandSet);
      return brands.sort();
    }),
  }),

  // Catalog endpoints for Sanity products with PostgreSQL availability
  catalog: router({
    // Get availability counts for multiple products by slug
    availability: publicProcedure
      .input(z.object({ slugs: z.array(z.string()) }))
      .query(async ({ input }) => {
        return await db.getAvailableInventoryCountBatch(input.slugs);
      }),
  }),

  // Cart now uses Sanity product slugs
  cart: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      // Returns slugs - frontend fetches product details from Sanity
      const slugs = await db.getCartSlugs(ctx.user.id);
      return slugs;
    }),

    add: protectedProcedure
      .input(z.object({ slug: z.string() }))
      .mutation(async ({ ctx, input }) => {
        // Check if cart already has 5 items
        const currentCount = await db.getCartCount(ctx.user.id);
        if (currentCount >= 5) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cart is full. You can only select 5 items.",
          });
        }

        // Check if product has available inventory
        const availableCount = await db.getAvailableInventoryCount(input.slug);
        if (availableCount === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This item is currently out of stock.",
          });
        }

        try {
          await db.addToCart(ctx.user.id, input.slug);
        } catch (error: any) {
          if (error.message === "Product already in cart") {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "This item is already in your box.",
            });
          }
          throw error;
        }
        return { success: true };
      }),

    remove: protectedProcedure
      .input(z.object({ slug: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await db.removeFromCart(ctx.user.id, input.slug);
        return { success: true };
      }),

    clear: protectedProcedure.mutation(async ({ ctx }) => {
      await db.clearCart(ctx.user.id);
      return { success: true };
    }),

    count: protectedProcedure.query(async ({ ctx }) => {
      return await db.getCartCount(ctx.user.id);
    }),

    isInCart: protectedProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ ctx, input }) => {
        return await db.isInCart(ctx.user.id, input.slug);
      }),
  }),

  // Swap items for next box selection
  swap: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const subscription = await db.getUserSubscription(ctx.user.id);
      if (!subscription) return [];
      return await db.getSwapSlugs(subscription.id);
    }),

    add: protectedProcedure
      .input(z.object({ slug: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const subscription = await db.getUserSubscription(ctx.user.id);
        if (!subscription) {
          throw new TRPCError({ code: "NOT_FOUND", message: "No subscription found." });
        }

        // Check swap window is open
        const cycleEnd = new Date(subscription.cycleEndDate);
        const today = new Date();
        const daysRemaining = Math.ceil((cycleEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (daysRemaining > 10) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Swap window is not open yet.",
          });
        }

        // Check if already has 5 items
        const currentCount = await db.getSwapCount(subscription.id);
        if (currentCount >= 5) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You've already selected 5 items for your next box.",
          });
        }

        // Check availability
        const availableCount = await db.getAvailableInventoryCount(input.slug);
        if (availableCount === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This item is currently out of stock.",
          });
        }

        await db.addToSwap(subscription.id, input.slug);
        return { success: true };
      }),

    remove: protectedProcedure
      .input(z.object({ slug: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const subscription = await db.getUserSubscription(ctx.user.id);
        if (!subscription) {
          throw new TRPCError({ code: "NOT_FOUND", message: "No subscription found." });
        }
        await db.removeFromSwap(subscription.id, input.slug);
        return { success: true };
      }),

    count: protectedProcedure.query(async ({ ctx }) => {
      const subscription = await db.getUserSubscription(ctx.user.id);
      if (!subscription) return 0;
      return await db.getSwapCount(subscription.id);
    }),

    confirm: protectedProcedure.mutation(async ({ ctx }) => {
      const subscription = await db.getUserSubscription(ctx.user.id);
      if (!subscription) {
        throw new TRPCError({ code: "NOT_FOUND", message: "No subscription found." });
      }

      // Check we have exactly 5 items
      const swapCount = await db.getSwapCount(subscription.id);
      if (swapCount !== 5) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You must select exactly 5 items for your next box.",
        });
      }

      // Get swap items
      const swapSlugs = await db.getSwapSlugs(subscription.id);

      // Calculate new cycle dates
      const startDate = new Date(subscription.cycleEndDate);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 3);
      const returnByDate = new Date(endDate);
      returnByDate.setDate(returnByDate.getDate() + 7);

      // Get current box count
      const existingBoxes = await db.getBoxesBySubscription(subscription.id);
      const cycleNumber = existingBoxes.length + 1;

      // Create new box
      const box = await db.createBox({
        subscriptionId: subscription.id,
        cycleNumber,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        returnByDate: returnByDate.toISOString().split("T")[0],
        status: "confirmed",
      });

      // Reserve inventory for each swap item
      for (const slug of swapSlugs) {
        const inventoryItem = await db.getFirstAvailableInventoryItem(slug);
        if (inventoryItem) {
          await db.addItemToBox(box.id, inventoryItem.id);
          await db.updateInventoryItemState(inventoryItem.id, "active");
        }
      }

      // Clear swap items
      await db.clearSwapItems(subscription.id);

      return { success: true, boxId: box.id };
    }),
  }),

  subscription: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const subscription = await db.getUserSubscription(ctx.user.id);
      return subscription;
    }),

    create: protectedProcedure
      .input(
        z.object({
          shippingAddress: z.string(),
          phone: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Check if user already has a subscription
        const existing = await db.getUserSubscription(ctx.user.id);
        if (existing && existing.status === "active") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You already have an active subscription.",
          });
        }

        // Check if cart has exactly 5 items
        const cartCount = await db.getCartCount(ctx.user.id);
        if (cartCount !== 5) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You must select exactly 5 items to subscribe.",
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
        const subscription = await db.createSubscription({
          userId: ctx.user.id,
          status: "active",
          cycleStartDate: startDate.toISOString().split("T")[0],
          cycleEndDate: endDate.toISOString().split("T")[0],
          nextBillingDate: nextBillingDate.toISOString().split("T")[0],
          swapWindowOpen: false,
        });

        // Create first box
        const returnByDate = new Date(endDate);
        returnByDate.setDate(returnByDate.getDate() + 7); // 7 days after cycle end

        const box = await db.createBox({
          subscriptionId: subscription.id,
          cycleNumber: 1,
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          returnByDate: returnByDate.toISOString().split("T")[0],
          status: "confirmed",
        });

        // Get cart items (slugs) and reserve inventory
        const cartSlugs = await db.getCartSlugs(ctx.user.id);

        for (const slug of cartSlugs) {
          // Find available inventory item for this product
          const inventoryItem = await db.getFirstAvailableInventoryItem(slug);

          if (inventoryItem) {
            // Add to box
            await db.addItemToBox(box.id, inventoryItem.id);
            // Mark as active
            await db.updateInventoryItemState(inventoryItem.id, "active");
          }
        }

        // Clear cart
        await db.clearCart(ctx.user.id);

        return {
          success: true,
          subscriptionId: subscription.id,
          boxId: box.id,
        };
      }),

    pause: protectedProcedure.mutation(async ({ ctx }) => {
      const subscription = await db.getUserSubscription(ctx.user.id);
      if (!subscription) {
        throw new TRPCError({ code: "NOT_FOUND", message: "No subscription found." });
      }

      await db.updateSubscriptionStatus(subscription.id, "paused");
      return { success: true };
    }),

    cancel: protectedProcedure.mutation(async ({ ctx }) => {
      const subscription = await db.getUserSubscription(ctx.user.id);
      if (!subscription) {
        throw new TRPCError({ code: "NOT_FOUND", message: "No subscription found." });
      }

      await db.updateSubscriptionStatus(subscription.id, "cancelled");
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

  // ============ BLOG ============

  blog: router({
    // Public blog endpoints
    posts: publicProcedure
      .input(
        z
          .object({
            limit: z.number().optional(),
          })
          .optional()
      )
      .query(async ({ input }) => {
        const posts = await db.getPublishedBlogPosts(input?.limit);
        return posts;
      }),

    postBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      const post = await db.getBlogPostBySlug(input.slug);
      if (!post || post.status !== "published") {
        throw new TRPCError({ code: "NOT_FOUND", message: "Blog post not found" });
      }

      // Get categories and tags
      const categories = await db.getPostCategories(post.id);
      const tags = await db.getPostTags(post.id);

      return {
        ...post,
        categories: categories.map((c) => c.category),
        tags: tags.map((t) => t.tag),
      };
    }),

    categories: publicProcedure.query(async () => {
      return await db.getAllBlogCategories();
    }),

    tags: publicProcedure.query(async () => {
      return await db.getAllBlogTags();
    }),
  }),

  // ============ ADMIN ============

  admin: router({
    // ---- Inventory Management ----
    inventory: router({
      list: adminProcedure.query(async () => {
        // Returns inventory items with sanityProductSlug
        // Frontend fetches product details from Sanity separately
        return await db.getAllInventoryItems();
      }),

      updateState: adminProcedure
        .input(
          z.object({
            itemId: z.number(),
            state: z.enum(["available", "active", "in_transit", "quarantine", "retired"]),
            notes: z.string().optional(),
          })
        )
        .mutation(async ({ input }) => {
          await db.updateInventoryItemState(input.itemId, input.state, input.notes);
          return { success: true };
        }),

      retire: adminProcedure
        .input(
          z.object({
            itemId: z.number(),
            reason: z.string(),
          })
        )
        .mutation(async ({ input }) => {
          await db.retireInventoryItem(input.itemId, input.reason);
          return { success: true };
        }),

      stats: adminProcedure.query(async () => {
        return await db.getInventoryStats();
      }),

      create: adminProcedure
        .input(
          z.object({
            sanityProductSlug: z.string(),
            sku: z.string(),
          })
        )
        .mutation(async ({ input }) => {
          await db.createInventoryItem({
            sanityProductSlug: input.sanityProductSlug,
            sku: input.sku,
            state: "available",
          });
          return { success: true };
        }),

      bulkCreate: adminProcedure
        .input(
          z.object({
            items: z.array(
              z.object({
                sanityProductSlug: z.string(),
                sku: z.string(),
              })
            ),
          })
        )
        .mutation(async ({ input }) => {
          await db.bulkCreateInventoryItems(
            input.items.map((item) => ({
              sanityProductSlug: item.sanityProductSlug,
              sku: item.sku,
              state: "available" as const,
            }))
          );
          return { success: true, count: input.items.length };
        }),
    }),

    // ---- Subscription Management ----
    subscriptions: router({
      list: adminProcedure.query(async () => {
        return await db.getAllSubscriptions();
      }),
    }),

    // ---- Product Management ----
    products: router({
      list: adminProcedure.query(async () => {
        return await db.getAllProducts();
      }),

      create: adminProcedure
        .input(
          z.object({
            brand: z.string(),
            name: z.string(),
            description: z.string(),
            category: z.enum([
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
              "overall",
            ]),
            ageRange: z.enum(["0-3m", "3-6m", "6-12m", "12-18m", "18-24m"]),
            season: z.enum(["summer", "winter", "all-season"]),
            rrpPrice: z.string(),
            imageUrl: z.string().optional(),
          })
        )
        .mutation(async ({ input }) => {
          const product = await db.createProduct({
            brand: input.brand,
            name: input.name,
            description: input.description,
            category: input.category,
            ageRange: input.ageRange,
            season: input.season,
            rrpPrice: input.rrpPrice,
            imageUrl: input.imageUrl,
            ozoneCleaned: true,
            insuranceIncluded: true,
          });
          return { success: true, product };
        }),

      update: adminProcedure
        .input(
          z.object({
            id: z.number(),
            brand: z.string().optional(),
            name: z.string().optional(),
            description: z.string().optional(),
            category: z
              .enum([
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
                "overall",
              ])
              .optional(),
            ageRange: z.enum(["0-3m", "3-6m", "6-12m", "12-18m", "18-24m"]).optional(),
            season: z.enum(["summer", "winter", "all-season"]).optional(),
            rrpPrice: z.string().optional(),
            imageUrl: z.string().optional(),
          })
        )
        .mutation(async ({ input }) => {
          const { id, ...data } = input;
          await db.updateProduct(id, data as any);
          return { success: true };
        }),

      delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
        await db.deleteProduct(input.id);
        return { success: true };
      }),

      uploadImage: adminProcedure
        .input(
          z.object({
            fileName: z.string(),
            fileData: z.string(), // Base64 encoded
            contentType: z.string(),
          })
        )
        .mutation(async ({ input }) => {
          const buffer = Buffer.from(input.fileData, "base64");
          const path = `products/${Date.now()}-${input.fileName}`;
          const url = await uploadToStorage("product-images", path, buffer, input.contentType);
          return { success: true, url };
        }),

      bulkImport: adminProcedure
        .input(
          z.object({
            csvData: z.string(),
          })
        )
        .mutation(async ({ input }) => {
          // Parse CSV
          const records = parse(input.csvData, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
          }) as Array<{
            brand: string;
            name: string;
            description: string;
            category: string;
            ageRange: string;
            season: string;
            rrpPrice: string;
            imageUrl?: string;
          }>;

          const products = records.map((record) => ({
            brand: record.brand,
            name: record.name,
            description: record.description,
            category: record.category as any,
            ageRange: record.ageRange as any,
            season: record.season as any,
            rrpPrice: record.rrpPrice,
            imageUrl: record.imageUrl || null,
            ozoneCleaned: true,
            insuranceIncluded: true,
          }));

          const result = await db.bulkCreateProducts(products);
          return { success: true, count: result.length };
        }),
    }),

    // ---- Blog Management ----
    blog: router({
      posts: adminProcedure.query(async () => {
        return await db.getAllBlogPosts();
      }),

      getPost: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
        const post = await db.getBlogPostById(input.id);
        if (!post) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
        }

        const categories = await db.getPostCategories(post.id);
        const tags = await db.getPostTags(post.id);

        return {
          ...post,
          categoryIds: categories.map((c) => c.category.id),
          tagIds: tags.map((t) => t.tag.id),
        };
      }),

      createPost: adminProcedure
        .input(
          z.object({
            title: z.string(),
            content: z.string(),
            excerpt: z.string().optional(),
            featuredImage: z.string().optional(),
            status: z.enum(["draft", "published", "archived"]).default("draft"),
            metaTitle: z.string().optional(),
            metaDescription: z.string().optional(),
            ogImage: z.string().optional(),
            categoryIds: z.array(z.number()).optional(),
            tagIds: z.array(z.number()).optional(),
          })
        )
        .mutation(async ({ ctx, input }) => {
          const slug = slugify(input.title, { lower: true, strict: true });

          // Check if slug already exists
          const existing = await db.getBlogPostBySlug(slug);
          const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

          const post = await db.createBlogPost({
            slug: finalSlug,
            title: input.title,
            content: input.content,
            excerpt: input.excerpt,
            featuredImage: input.featuredImage,
            authorId: ctx.user.id,
            status: input.status,
            publishedAt: input.status === "published" ? new Date() : null,
            metaTitle: input.metaTitle,
            metaDescription: input.metaDescription,
            ogImage: input.ogImage,
          });

          // Set categories and tags
          if (input.categoryIds?.length) {
            await db.setPostCategories(post.id, input.categoryIds);
          }
          if (input.tagIds?.length) {
            await db.setPostTags(post.id, input.tagIds);
          }

          return { success: true, post };
        }),

      updatePost: adminProcedure
        .input(
          z.object({
            id: z.number(),
            title: z.string().optional(),
            content: z.string().optional(),
            excerpt: z.string().optional(),
            featuredImage: z.string().optional(),
            status: z.enum(["draft", "published", "archived"]).optional(),
            metaTitle: z.string().optional(),
            metaDescription: z.string().optional(),
            ogImage: z.string().optional(),
            categoryIds: z.array(z.number()).optional(),
            tagIds: z.array(z.number()).optional(),
          })
        )
        .mutation(async ({ input }) => {
          const { id, categoryIds, tagIds, ...data } = input;

          // If publishing for the first time, set publishedAt
          if (data.status === "published") {
            const existing = await db.getBlogPostById(id);
            if (existing && !existing.publishedAt) {
              (data as any).publishedAt = new Date();
            }
          }

          await db.updateBlogPost(id, data);

          // Update categories and tags if provided
          if (categoryIds !== undefined) {
            await db.setPostCategories(id, categoryIds);
          }
          if (tagIds !== undefined) {
            await db.setPostTags(id, tagIds);
          }

          return { success: true };
        }),

      deletePost: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
        await db.deleteBlogPost(input.id);
        return { success: true };
      }),

      // Categories
      categories: adminProcedure.query(async () => {
        return await db.getAllBlogCategories();
      }),

      createCategory: adminProcedure
        .input(
          z.object({
            name: z.string(),
            description: z.string().optional(),
          })
        )
        .mutation(async ({ input }) => {
          const slug = slugify(input.name, { lower: true, strict: true });
          const category = await db.createBlogCategory({
            name: input.name,
            slug,
            description: input.description,
          });
          return { success: true, category };
        }),

      deleteCategory: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
        await db.deleteBlogCategory(input.id);
        return { success: true };
      }),

      // Tags
      tags: adminProcedure.query(async () => {
        return await db.getAllBlogTags();
      }),

      createTag: adminProcedure.input(z.object({ name: z.string() })).mutation(async ({ input }) => {
        const slug = slugify(input.name, { lower: true, strict: true });
        const tag = await db.createBlogTag({
          name: input.name,
          slug,
        });
        return { success: true, tag };
      }),

      deleteTag: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
        await db.deleteBlogTag(input.id);
        return { success: true };
      }),

      uploadImage: adminProcedure
        .input(
          z.object({
            fileName: z.string(),
            fileData: z.string(), // Base64 encoded
            contentType: z.string(),
          })
        )
        .mutation(async ({ input }) => {
          const buffer = Buffer.from(input.fileData, "base64");
          const path = `blog/${Date.now()}-${input.fileName}`;
          const url = await uploadToStorage("blog-images", path, buffer, input.contentType);
          return { success: true, url };
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
