import type { StructureResolver } from "sanity/structure";

// Custom sidebar so singleton pages aren't shown as a list. Each
// page-level document gets a single "edit me" entry. Specials remain a
// list since there can be many.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Gem Pursuit")
    .items([
      S.listItem()
        .title("Articles")
        .icon(() => "✍")
        .child(
          S.documentTypeList("article")
            .title("Articles")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }])
        ),
      S.listItem()
        .title("Specials (Featured Episodes)")
        .icon(() => "★")
        .child(
          S.documentTypeList("special")
            .title("Specials")
            .defaultOrdering([
              { field: "publishedAt", direction: "desc" },
            ])
        ),
      S.divider(),
      S.listItem()
        .title("About page")
        .child(
          S.editor()
            .id("aboutPage")
            .schemaType("aboutPage")
            .documentId("aboutPage")
        ),
      S.listItem()
        .title("Contact page")
        .child(
          S.editor()
            .id("contactPage")
            .schemaType("contactPage")
            .documentId("contactPage")
        ),
      S.listItem()
        .title("Sponsorship page")
        .child(
          S.editor()
            .id("sponsorshipPage")
            .schemaType("sponsorshipPage")
            .documentId("sponsorshipPage")
        ),
      S.listItem()
        .title("Specials page (heading & footer)")
        .child(
          S.editor()
            .id("specialsPage")
            .schemaType("specialsPage")
            .documentId("specialsPage")
        ),
      S.listItem()
        .title("Privacy Policy")
        .child(
          S.editor()
            .id("privacyPage")
            .schemaType("privacyPage")
            .documentId("privacyPage")
        ),
      S.divider(),
      S.listItem()
        .title("Site settings")
        .child(
          S.editor()
            .id("siteSettings")
            .schemaType("siteSettings")
            .documentId("siteSettings")
        ),
    ]);
