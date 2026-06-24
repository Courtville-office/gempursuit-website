import { defineType, defineField } from "sanity";

// A featured episode shown on the Specials page. Sortable newest-first
// by publishedAt with an optional manual `order` tie-breaker.
export const special = defineType({
  name: "special",
  title: "Special",
  type: "document",
  fields: [
    defineField({
      name: "source",
      title: "Where the episode lives",
      description:
        "Which platform's player should appear on the Specials page for this entry.",
      type: "string",
      options: {
        list: [
          { title: "Spotify", value: "spotify" },
          { title: "Apple Podcasts", value: "apple" },
        ],
        layout: "radio",
      },
      initialValue: "apple",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "episodeTitle",
      title: "Episode title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published date",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "appleShowId",
      title: "Apple Show ID",
      description:
        "Only for Apple Podcasts entries. Gem Pursuit's Apple show ID is 1514094392.",
      type: "string",
      initialValue: "1514094392",
      hidden: ({ document }) => document?.source !== "apple",
    }),
    defineField({
      name: "episodeId",
      title: "Episode ID",
      description:
        "Spotify: the bit after /episode/ in the URL. Apple: the bit after ?i= in the URL.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "guestName",
      title: "Guest name (optional)",
      type: "string",
    }),
    defineField({
      name: "role",
      title: "Role / short description (optional)",
      description:
        "Shown above the episode title as an eyebrow. e.g. 'Antique jewellery historian' or 'Special guest'.",
      type: "string",
    }),
    defineField({
      name: "blurb",
      title: "Blurb (optional)",
      description:
        "1-2 sentences about why this episode is featured. Shown under the title.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "order",
      title: "Manual sort order (optional)",
      description:
        "Tie-breaker if two entries share the same date. Leave at 0 unless you want to force a specific order.",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Published date, newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "episodeTitle",
      subtitle: "publishedAt",
      source: "source",
      guest: "guestName",
    },
    prepare({ title, subtitle, source, guest }) {
      const sourceLabel = source === "spotify" ? "Spotify" : "Apple Podcasts";
      const date = subtitle ?? "no date";
      const guestPart = guest ? ` · ${guest}` : "";
      return {
        title,
        subtitle: `${date} · ${sourceLabel}${guestPart}`,
      };
    },
  },
});
