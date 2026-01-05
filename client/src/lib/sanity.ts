import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

// Sanity client configuration
export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "h83nldug",
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true, // Use CDN for faster responses in production
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
  brandImage?: SanityImageSource;
  description?: string;
  website?: string;
  featured?: boolean;
}

export interface SanityProduct {
  _id: string;
  name: string;
  slug: string; // Flattened in queries
  brand?: SanityBrand;
  mainImage?: SanityImageSource;
  externalImageUrl?: string; // Fallback URL (e.g., Unsplash) when no uploaded image
  images?: SanityImageSource[];
  description?: string;
  category: string;
  ageRange?: string;
  season?: string;
  sizes?: string[];
  colors?: Array<{ name: string; hex: string }>;
  rrpPrice?: number;
  stockQuantity: number;
  inStock: boolean;
  featured?: boolean;
  material?: string;
  careInstructions?: string;
}

// Helper function to get the best image URL for a product
export function getProductImageUrl(
  product: SanityProduct,
  options?: { width?: number; height?: number }
): string | null {
  const { width = 800, height = 800 } = options || {};

  // Prefer Sanity uploaded image
  if (product.mainImage) {
    return urlFor(product.mainImage).width(width).height(height).fit("crop").quality(90).auto("format").url();
  }

  // Fall back to external URL (Unsplash)
  if (product.externalImageUrl) {
    // Unsplash URLs can be resized with query params
    const url = product.externalImageUrl;
    if (url.includes('unsplash.com')) {
      return `${url}&w=${width}&h=${height}&fit=crop&auto=format&q=90`;
    }
    return url;
  }

  return null;
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
  slug: string; // Flattened in queries
  author?: SanityAuthor;
  mainImage?: SanityImageSource;
  externalImageUrl?: string; // Fallback URL for external images
  categories?: SanityCategory[];
  publishedAt?: string;
  excerpt?: string;
  body?: any[]; // Portable Text
  featured?: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SanityImageSource;
    canonicalUrl?: string;
  };
}

// Helper function to get the best image URL for a post
export function getPostImageUrl(
  post: SanityPost,
  options?: { width?: number; height?: number }
): string | null {
  const { width = 800, height = 600 } = options || {};

  if (post.mainImage) {
    return urlFor(post.mainImage).width(width).height(height).quality(90).auto("format").url();
  }

  if (post.externalImageUrl) {
    const url = post.externalImageUrl;
    if (url.includes('unsplash.com')) {
      return `${url}&w=${width}&h=${height}&fit=crop&auto=format&q=90`;
    }
    return url;
  }

  return null;
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
  bentoImage1?: SanityImageSource;
  bentoImage2?: SanityImageSource;
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
  // New homepage section fields
  announcementBar?: {
    text?: string;
    enabled?: boolean;
  };
  sectionTitles?: {
    mostLoved?: string;
    ourBrands?: string;
    fromTheBlog?: string;
  };
  philosophySection?: {
    title?: string;
    content?: string;
  };
  qualitySection?: {
    title?: string;
    content?: string;
  };
  newsletterSection?: {
    title?: string;
    content?: string;
  };
}

export interface SanityAboutPage {
  _id: string;
  heroTitle?: string;
  heroSubtitle?: string;
  missionSection?: {
    title?: string;
    content?: any[]; // Portable Text
  };
  valuesSection?: {
    title?: string;
    values?: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  storySection?: {
    title?: string;
    content?: any[]; // Portable Text
  };
  impactSection?: {
    title?: string;
    stats?: Array<{
      value: string;
      label: string;
    }>;
  };
  ctaSection?: {
    title?: string;
    content?: string;
    buttonText?: string;
    buttonLink?: string;
  };
}

// Helper to get settings image URL
export function getSettingsImageUrl(
  image: SanityImageSource | undefined,
  options?: { width?: number; height?: number }
): string | null {
  if (!image) return null;
  const { width = 1200, height = 1200 } = options || {};
  return urlFor(image).width(width).height(height).quality(90).auto("format").url();
}

// GROQ Queries
export const queries = {
  // Products
  allProducts: `*[_type == "product" && inStock == true] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    mainImage,
    externalImageUrl,
    category,
    ageRange,
    season,
    sizes,
    rrpPrice,
    stockQuantity,
    inStock,
    featured,
    "brand": brand->{_id, name, "slug": slug.current, logo}
  }`,

  featuredProducts: `*[_type == "product" && featured == true && inStock == true] | order(name asc) [0...8] {
    _id,
    name,
    "slug": slug.current,
    mainImage,
    externalImageUrl,
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
    externalImageUrl,
    images,
    description,
    category,
    ageRange,
    season,
    sizes,
    colors,
    rrpPrice,
    stockQuantity,
    inStock,
    material,
    careInstructions,
    "brand": brand->{_id, name, "slug": slug.current, logo, description, website}
  }`,

  productsByCategory: `*[_type == "product" && category == $category && inStock == true] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    mainImage,
    externalImageUrl,
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
    brandImage,
    description,
    featured
  }`,

  featuredBrands: `*[_type == "brand" && featured == true] | order(name asc) [0...3] {
    _id,
    name,
    "slug": slug.current,
    logo,
    brandImage,
    description
  }`,

  // Blog Posts
  allPosts: `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    externalImageUrl,
    excerpt,
    publishedAt,
    featured,
    "author": author->{_id, name, image},
    "categories": categories[]->{_id, title, "slug": slug.current}
  }`,

  featuredPosts: `*[_type == "post" && featured == true] | order(publishedAt desc) [0...4] {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    externalImageUrl,
    excerpt,
    publishedAt,
    "author": author->{_id, name, image}
  }`,

  postBySlug: `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    externalImageUrl,
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
    externalImageUrl,
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
    bentoImage1,
    bentoImage2,
    benefits,
    contactEmail,
    socialLinks,
    announcementBar,
    sectionTitles,
    philosophySection,
    qualitySection,
    newsletterSection
  }`,

  // About Page
  aboutPage: `*[_type == "aboutPage"][0] {
    _id,
    heroTitle,
    heroSubtitle,
    missionSection,
    valuesSection,
    storySection,
    impactSection,
    ctaSection
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

export async function fetchFeaturedBrands() {
  return sanityClient.fetch<SanityBrand[]>(queries.featuredBrands);
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

export async function fetchAboutPage() {
  return sanityClient.fetch<SanityAboutPage>(queries.aboutPage);
}
