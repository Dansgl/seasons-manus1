import { defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "externalImageUrl",
      title: "External Image URL",
      type: "url",
      description: "Fallback image URL (e.g., from Unsplash) when no uploaded image",
    }),
    defineField({
      name: "images",
      title: "Additional Images",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Bodysuit", value: "bodysuit" },
          { title: "Sleepsuit", value: "sleepsuit" },
          { title: "Joggers", value: "joggers" },
          { title: "Jacket", value: "jacket" },
          { title: "Cardigan", value: "cardigan" },
          { title: "Top", value: "top" },
          { title: "Bottom", value: "bottom" },
          { title: "Dress", value: "dress" },
          { title: "Outerwear", value: "outerwear" },
          { title: "Swimwear", value: "swimwear" },
          { title: "Hat", value: "hat" },
          { title: "Shoes", value: "shoes" },
          { title: "PJs", value: "pjs" },
          { title: "Overall", value: "overall" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ageRange",
      title: "Age Range",
      type: "string",
      options: {
        list: [
          { title: "0-3 months", value: "0-3m" },
          { title: "3-6 months", value: "3-6m" },
          { title: "6-12 months", value: "6-12m" },
          { title: "12-18 months", value: "12-18m" },
          { title: "18-24 months", value: "18-24m" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "season",
      title: "Season",
      type: "string",
      options: {
        list: [
          { title: "Summer", value: "summer" },
          { title: "Winter", value: "winter" },
          { title: "All Season", value: "all-season" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rrpPrice",
      title: "RRP Price (€)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "ozoneCleaned",
      title: "Ozone Cleaned",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "insuranceIncluded",
      title: "Insurance Included",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      initialValue: true,
      description: "Toggle to show/hide from catalog",
    }),
    defineField({
      name: "stockQuantity",
      title: "Stock Quantity",
      type: "number",
      initialValue: 0,
      description: "Number of items available for rent",
    }),
  ],
  preview: {
    select: {
      title: "name",
      brand: "brand.name",
      media: "mainImage",
      category: "category",
      ageRange: "ageRange",
    },
    prepare({ title, brand, media, category, ageRange }) {
      return {
        title,
        subtitle: `${brand || "No brand"} • ${category || ""} • ${ageRange || ""}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Name, A-Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
    {
      title: "Brand, A-Z",
      name: "brandAsc",
      by: [{ field: "brand.name", direction: "asc" }],
    },
    {
      title: "Recently Added",
      name: "createdDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
});
