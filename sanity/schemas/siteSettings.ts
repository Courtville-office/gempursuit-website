import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "footerTagline",
      title: "Footer tagline",
      description: "The short description in the footer of every page.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "contactInbox",
      title: "Contact inbox",
      description: "Email address shown on the Contact and Sponsorship pages.",
      type: "string",
    }),
    defineField({
      name: "podcastLinks",
      title: "Podcast platform links",
      type: "array",
      of: [
        {
          type: "object",
          name: "link",
          fields: [
            defineField({ name: "label", type: "string", title: "Platform name" }),
            defineField({ name: "href", type: "url", title: "URL" }),
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        },
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social media links",
      type: "array",
      of: [
        {
          type: "object",
          name: "link",
          fields: [
            defineField({ name: "label", type: "string", title: "Platform name" }),
            defineField({ name: "href", type: "url", title: "URL" }),
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
