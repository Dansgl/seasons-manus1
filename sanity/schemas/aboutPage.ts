import { defineField, defineType } from "sanity";

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    // Hero Section
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      initialValue: "Rethinking Baby Fashion",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      initialValue:
        "We believe every baby deserves beautiful, high-quality clothing without the waste. Seasons is building a circular fashion future for families.",
    }),

    // Mission Section
    defineField({
      name: "missionSection",
      title: "Mission Section",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
          initialValue: "Our Mission",
        },
        {
          name: "content",
          title: "Content",
          type: "array",
          of: [{ type: "block" }],
          description: "Rich text content for the mission section",
        },
      ],
    }),

    // Values Section
    defineField({
      name: "valuesSection",
      title: "Values Section",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Section Title",
          type: "string",
          initialValue: "Our Values",
        },
        {
          name: "values",
          title: "Values",
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
                  description: "Lucide icon name (e.g., 'Leaf', 'Heart', 'Recycle', 'Users')",
                },
              ],
            },
          ],
        },
      ],
    }),

    // Story Section
    defineField({
      name: "storySection",
      title: "Story Section",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
          initialValue: "Our Story",
        },
        {
          name: "content",
          title: "Content",
          type: "array",
          of: [{ type: "block" }],
        },
      ],
    }),

    // Impact Stats
    defineField({
      name: "impactSection",
      title: "Impact Section",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Section Title",
          type: "string",
          initialValue: "Our Impact",
        },
        {
          name: "stats",
          title: "Stats",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "value",
                  title: "Value",
                  type: "string",
                  description: "e.g., '5+', '80%', '50+'",
                },
                {
                  name: "label",
                  title: "Label",
                  type: "string",
                  description: "e.g., 'Lives per garment'",
                },
              ],
            },
          ],
        },
      ],
    }),

    // CTA Section
    defineField({
      name: "ctaSection",
      title: "CTA Section",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
          initialValue: "Join the Movement",
        },
        {
          name: "content",
          title: "Content",
          type: "text",
          initialValue:
            "Start your sustainable parenting journey with Seasons. €70 per quarter for 5 premium items.",
        },
        {
          name: "buttonText",
          title: "Button Text",
          type: "string",
          initialValue: "Browse Collection",
        },
        {
          name: "buttonLink",
          title: "Button Link",
          type: "string",
          initialValue: "/catalog",
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "About Page",
      };
    },
  },
});
