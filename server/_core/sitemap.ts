import * as db from "../db";
import { ENV } from "./env";

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(date: Date | string | null): string {
  if (!date) return new Date().toISOString().split("T")[0];
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0];
}

export async function generateSitemap(): Promise<string> {
  const baseUrl = ENV.appUrl || "http://localhost:3000";
  const urls: SitemapUrl[] = [];

  // Static pages
  urls.push({
    loc: baseUrl,
    changefreq: "daily",
    priority: 1.0,
  });

  urls.push({
    loc: `${baseUrl}/catalog`,
    changefreq: "daily",
    priority: 0.9,
  });

  urls.push({
    loc: `${baseUrl}/blog`,
    changefreq: "daily",
    priority: 0.8,
  });

  // Product pages
  try {
    const products = await db.getAllProducts();
    for (const product of products) {
      urls.push({
        loc: `${baseUrl}/product/${product.id}`,
        lastmod: formatDate(product.updatedAt),
        changefreq: "weekly",
        priority: 0.7,
      });
    }
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
  }

  // Blog posts
  try {
    const posts = await db.getPublishedBlogPosts();
    for (const post of posts) {
      urls.push({
        loc: `${baseUrl}/blog/${post.slug}`,
        lastmod: formatDate(post.updatedAt),
        changefreq: "weekly",
        priority: 0.6,
      });
    }
  } catch (error) {
    console.error("Error fetching blog posts for sitemap:", error);
  }

  // Blog categories
  try {
    const categories = await db.getAllBlogCategories();
    for (const category of categories) {
      urls.push({
        loc: `${baseUrl}/blog/category/${category.slug}`,
        changefreq: "weekly",
        priority: 0.5,
      });
    }
  } catch (error) {
    console.error("Error fetching blog categories for sitemap:", error);
  }

  // Generate XML
  const urlsXml = urls
    .map((url) => {
      let urlXml = `  <url>\n    <loc>${escapeXml(url.loc)}</loc>`;
      if (url.lastmod) {
        urlXml += `\n    <lastmod>${url.lastmod}</lastmod>`;
      }
      if (url.changefreq) {
        urlXml += `\n    <changefreq>${url.changefreq}</changefreq>`;
      }
      if (url.priority !== undefined) {
        urlXml += `\n    <priority>${url.priority.toFixed(1)}</priority>`;
      }
      urlXml += "\n  </url>";
      return urlXml;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
}
