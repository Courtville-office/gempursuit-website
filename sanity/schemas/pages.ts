import { defineType, defineField } from "sanity";

// Each page is its own singleton document type. Sanity's preview shows
// the page title in the Studio sidebar.

const labelField = (name: string, title: string, description?: string) =>
  defineField({ name, title, type: "string", description });

const textField = (
  name: string,
  title: string,
  description?: string,
  rows = 3
) => defineField({ name, title, type: "text", rows, description });

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  fields: [
    labelField("eyebrow", "Eyebrow (small label above heading)"),
    labelField("heading", "Heading"),
    textField("intro", "Intro paragraph"),
    labelField("producedByIntro", "Produced by — intro text"),
    labelField("producedByLinkText", "Produced by — link text"),
    labelField("producedByLinkUrl", "Produced by — link URL"),
    textField("producedByOutro", "Produced by — outro text"),
    labelField("secondaryHeading", "Where to listen — heading"),
    textField(
      "secondaryBody",
      "Where to listen — body",
      "Include the word 'Subscribe' and it'll automatically link to the Subscribe page."
    ),
    labelField("tertiaryHeading", "Get in touch — heading"),
    textField(
      "tertiaryBody",
      "Get in touch — body",
      "Include the words 'contact form' and they'll automatically link to the Contact page."
    ),
  ],
  preview: { prepare: () => ({ title: "About page" }) },
});

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact page",
  type: "document",
  fields: [
    labelField("eyebrow", "Eyebrow"),
    labelField("heading", "Heading"),
    textField("intro", "Intro paragraph"),
    labelField(
      "directEmailIntro",
      "Direct email intro",
      "e.g. 'Or email us directly at'. The address itself comes from Site Settings."
    ),
  ],
  preview: { prepare: () => ({ title: "Contact page" }) },
});

export const sponsorshipPage = defineType({
  name: "sponsorshipPage",
  title: "Sponsorship page",
  type: "document",
  fields: [
    labelField("eyebrow", "Eyebrow"),
    labelField("heading", "Heading"),
    textField("intro", "Intro paragraph"),
    labelField("pillarOneTitle", "Pillar 1 — title"),
    textField("pillarOneBody", "Pillar 1 — body"),
    labelField("pillarTwoTitle", "Pillar 2 — title"),
    textField("pillarTwoBody", "Pillar 2 — body"),
    labelField("pillarThreeTitle", "Pillar 3 — title"),
    textField("pillarThreeBody", "Pillar 3 — body"),
    labelField("formEyebrow", "Form eyebrow"),
    labelField("formHeading", "Form heading"),
    textField("formIntro", "Form intro"),
    labelField("directEmailIntro", "Direct email intro"),
  ],
  preview: { prepare: () => ({ title: "Sponsorship page" }) },
});

export const specialsPage = defineType({
  name: "specialsPage",
  title: "Specials page — heading & footer",
  type: "document",
  fields: [
    labelField("eyebrow", "Eyebrow"),
    labelField("heading", "Heading"),
    textField("intro", "Intro paragraph"),
    labelField(
      "ctaText",
      "CTA text",
      "Sits at the bottom of the page, before the link."
    ),
    labelField("ctaLinkText", "CTA link text"),
    labelField("ctaLinkHref", "CTA link URL"),
  ],
  preview: { prepare: () => ({ title: "Specials page (heading & footer)" }) },
});

export const privacyPage = defineType({
  name: "privacyPage",
  title: "Privacy Policy",
  type: "document",
  fields: [
    labelField("eyebrow", "Eyebrow"),
    labelField("heading", "Heading"),
    labelField(
      "lastUpdated",
      "Last updated",
      "e.g. '8 May 2026'. Update this whenever you edit the policy."
    ),
    defineField({
      name: "body",
      title: "Policy text",
      description:
        "The full policy. Use the headings, lists and links options in the toolbar.",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Section heading", value: "h2" },
            { title: "Subheading", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    type: "url",
                    title: "URL",
                  }),
                ],
              },
            ],
          },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Privacy Policy" }) },
});
