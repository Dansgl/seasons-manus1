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
      title: "Hero Image",
      type: "image",
      description: "Main hero image on homepage (baby/toddler photo)",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "bentoImage1",
      title: "Bento Grid - Philosophy Image",
      type: "image",
      description: "Image for the philosophy/about section (top right of bento grid)",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "bentoImage2",
      title: "Bento Grid - Cleaning Image",
      type: "image",
      description: "Image for the cleaning/quality section (bottom left of bento grid)",
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
    // Homepage sections
    defineField({
      name: "announcementBar",
      title: "Announcement Bar",
      type: "object",
      fields: [
        {
          name: "text",
          title: "Text",
          type: "string",
          initialValue: "Premium baby clothing rental — €70/quarter for 5 designer pieces",
        },
        {
          name: "enabled",
          title: "Enabled",
          type: "boolean",
          initialValue: true,
        },
      ],
    }),
    defineField({
      name: "sectionTitles",
      title: "Section Titles",
      type: "object",
      description: "Customize homepage section headings",
      fields: [
        {
          name: "mostLoved",
          title: "Most Loved Section",
          type: "string",
          initialValue: "Most loved",
        },
        {
          name: "ourBrands",
          title: "Our Brands Section",
          type: "string",
          initialValue: "Our brands",
        },
        {
          name: "fromTheBlog",
          title: "From the Blog Section",
          type: "string",
          initialValue: "From the blog",
        },
      ],
    }),
    defineField({
      name: "philosophySection",
      title: "Philosophy Section",
      type: "object",
      description: "The 'Our Philosophy' section on homepage",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
          initialValue: "Our philosophy",
        },
        {
          name: "content",
          title: "Content",
          type: "text",
          initialValue: "Premium European fashion for your little one, delivered fresh each season. We handle the cleaning, you enjoy the moments.",
        },
      ],
    }),
    defineField({
      name: "qualitySection",
      title: "Cleaning/Quality Section",
      type: "object",
      description: "The cleaning standard section on homepage",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
          initialValue: "The cleaning standard",
        },
        {
          name: "content",
          title: "Content",
          type: "text",
          initialValue: "Ozone-cleaned, hypoallergenic, and baby-safe. Every garment meets hospital-grade cleanliness before reaching your little one.",
        },
      ],
    }),
    defineField({
      name: "newsletterSection",
      title: "Newsletter/Waitlist Section",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
          initialValue: "Join the waitlist",
        },
        {
          name: "content",
          title: "Content",
          type: "text",
          initialValue: "Be the first to know when we launch. Early access, exclusive offers, and sustainable style tips.",
        },
      ],
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
