import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      initialValue: "Seasons",
    }),
    defineField({
      name: "siteDescription",
      title: "Site Description",
      type: "text",
      description: "Default meta description for the site",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
    }),
    defineField({
      name: "ogImage",
      title: "Default Social Sharing Image",
      type: "image",
      description: "Default image for social media sharing (1200x630 recommended)",
    }),
    defineField({
      name: "subscriptionPrice",
      title: "Subscription Price (€)",
      type: "number",
      initialValue: 70,
      description: "Quarterly subscription price",
    }),
    defineField({
      name: "itemsPerBox",
      title: "Items Per Box",
      type: "number",
      initialValue: 5,
    }),
    defineField({
      name: "subscriptionDuration",
      title: "Subscription Duration (months)",
      type: "number",
      initialValue: 3,
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      initialValue: "Premium Baby Clothing, Without the Premium Price Tag",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "aboutSection",
      title: "About Section",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
        },
        {
          name: "content",
          title: "Content",
          type: "array",
          of: [{ type: "block" }],
        },
        {
          name: "image",
          title: "Image",
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: "benefits",
      title: "Benefits",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Title",
              type: "string",
            },
            {
              name: "description",
              title: "Description",
              type: "text",
            },
            {
              name: "icon",
              title: "Icon Name",
              type: "string",
              description: "Lucide icon name (e.g., 'Sparkles', 'Heart', 'Leaf')",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "object",
      fields: [
        {
          name: "instagram",
          title: "Instagram URL",
          type: "url",
        },
        {
          name: "facebook",
          title: "Facebook URL",
          type: "url",
        },
        {
          name: "pinterest",
          title: "Pinterest URL",
          type: "url",
        },
      ],
    }),
    defineField({
      name: "footerText",
      title: "Footer Text",
      type: "string",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings",
      };
    },
  },
});
