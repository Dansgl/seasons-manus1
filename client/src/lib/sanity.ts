import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

// Sanity client configuration
export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "",
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true, // Use CDN for faster reads (set to false for real-time data)
});

// Image URL builder
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Type definitions for Sanity data
export interface SanityBrand {
  _id: string;
  name: string;
  slug: { current: string };
  logo?: SanityImageSource;
  description?: string;
  website?: string;
}

export interface SanityProduct {
  _id: string;
  name: string;
  slug: { current: string };
  brand?: SanityBrand;
  mainImage?: SanityImageSource;
  gallery?: SanityImageSource[];
  description?: string;
  category: string;
  ageRange?: string;
  season?: string;
  sizes?: string[];
  colors?: Array<{ name: string; hex: string }>;
  rrpPrice?: number;
  stockQuantity: number;
  available: boolean;
  featured: boolean;
  material?: string;
  careInstructions?: string;
}

export interface SanityAuthor {
  _id: string;
  name: string;
  slug: { current: string };
  image?: SanityImageSource;
  bio?: any[]; // Portable Text
}

export interface SanityCategory {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
}

export interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  author?: SanityAuthor;
  mainImage?: SanityImageSource;
  categories?: SanityCategory[];
  publishedAt?: string;
  excerpt?: string;
  body?: any[]; // Portable Text
  featured: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SanityImageSource;
    canonicalUrl?: string;
  };
}

export interface SanitySettings {
  _id: string;
  siteName: string;
  siteDescription?: string;
  logo?: SanityImageSource;
  ogImage?: SanityImageSource;
  subscriptionPrice: number;
  itemsPerBox: number;
  subscriptionDuration: number;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: SanityImageSource;
  benefits?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  contactEmail?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    pinterest?: string;
  };
}

// GROQ Queries
export const queries = {
  // Products
  allProducts: `*[_type == "product" && available == true] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    mainImage,
    category,
    ageRange,
    season,
    sizes,
    rrpPrice,
    stockQuantity,
    featured,
    "brand": brand->{_id, name, "slug": slug.current, logo}
  }`,

  featuredProducts: `*[_type == "product" && featured == true && available == true] | order(name asc) [0...8] {
    _id,
    name,
    "slug": slug.current,
    mainImage,
    category,
    ageRange,
    rrpPrice,
    "brand": brand->{_id, name, "slug": slug.current}
  }`,

  productBySlug: `*[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    mainImage,
    gallery,
    description,
    category,
    ageRange,
    season,
    sizes,
    colors,
    rrpPrice,
    stockQuantity,
    available,
    material,
    careInstructions,
    "brand": brand->{_id, name, "slug": slug.current, logo, description, website}
  }`,

  productsByCategory: `*[_type == "product" && category == $category && available == true] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    mainImage,
    category,
    ageRange,
    rrpPrice,
    "brand": brand->{_id, name, "slug": slug.current}
  }`,

  // Brands
  allBrands: `*[_type == "brand"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    logo,
    description
  }`,

  // Blog Posts
  allPosts: `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    excerpt,
    publishedAt,
    featured,
    "author": author->{_id, name, image},
    "categories": categories[]->{_id, title, "slug": slug.current}
  }`,

  featuredPosts: `*[_type == "post" && featured == true] | order(publishedAt desc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    excerpt,
    publishedAt,
    "author": author->{_id, name, image}
  }`,

  postBySlug: `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    body,
    excerpt,
    publishedAt,
    seo,
    "author": author->{_id, name, image, bio},
    "categories": categories[]->{_id, title, "slug": slug.current}
  }`,

  postsByCategory: `*[_type == "post" && $categoryId in categories[]._ref] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    excerpt,
    publishedAt,
    "author": author->{_id, name, image}
  }`,

  // Categories
  allCategories: `*[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description
  }`,

  // Site Settings
  siteSettings: `*[_type == "siteSettings"][0] {
    _id,
    siteName,
    siteDescription,
    logo,
    ogImage,
    subscriptionPrice,
    itemsPerBox,
    subscriptionDuration,
    heroTitle,
    heroSubtitle,
    heroImage,
    benefits,
    contactEmail,
    socialLinks
  }`,
};

// Fetch functions
export async function fetchProducts() {
  return sanityClient.fetch<SanityProduct[]>(queries.allProducts);
}

export async function fetchFeaturedProducts() {
  return sanityClient.fetch<SanityProduct[]>(queries.featuredProducts);
}

export async function fetchProductBySlug(slug: string) {
  return sanityClient.fetch<SanityProduct>(queries.productBySlug, { slug });
}

export async function fetchProductsByCategory(category: string) {
  return sanityClient.fetch<SanityProduct[]>(queries.productsByCategory, { category });
}

export async function fetchBrands() {
  return sanityClient.fetch<SanityBrand[]>(queries.allBrands);
}

export async function fetchPosts() {
  return sanityClient.fetch<SanityPost[]>(queries.allPosts);
}

export async function fetchFeaturedPosts() {
  return sanityClient.fetch<SanityPost[]>(queries.featuredPosts);
}

export async function fetchPostBySlug(slug: string) {
  return sanityClient.fetch<SanityPost>(queries.postBySlug, { slug });
}

export async function fetchCategories() {
  return sanityClient.fetch<SanityCategory[]>(queries.allCategories);
}

export async function fetchSiteSettings() {
  return sanityClient.fetch<SanitySettings>(queries.siteSettings);
}
