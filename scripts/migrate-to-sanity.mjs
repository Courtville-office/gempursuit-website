// One-off migration script that seeds the Sanity dataset with Gem
// Pursuit's content. Self-contained: no external content files
// required. Run with:
//
//   SANITY_AUTH_TOKEN=skXXX node scripts/migrate-to-sanity.mjs
//
// After it finishes, revoke the API token at:
//   https://www.sanity.io/manage/personal/tokens
// You can delete this file once the migration is complete.

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "tfw6v3tl";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_AUTH_TOKEN;

if (!token) {
  console.error(
    "Missing SANITY_AUTH_TOKEN.\n\n1. Get a write-access token at:\n   https://www.sanity.io/manage/personal/tokens\n2. Then run:\n   SANITY_AUTH_TOKEN=skXXX node scripts/migrate-to-sanity.mjs"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const APPLE_SHOW_ID = "1514094392";

// ---------- Specials ----------

const SPECIALS = [
  {
    slug: "2026-04-13-a-new-kind-of-dealer",
    source: "spotify",
    episodeId: "6Ra7sRi3nHts6WIs4gIE1Q",
    episodeTitle:
      "A New Kind of Dealer: Antique Jewellery in a Social Media World",
    publishedAt: "2026-04-13",
    order: 1,
  },
  {
    slug: "2025-09-15-instinct-at-work-michael-singer",
    source: "apple",
    appleShowId: APPLE_SHOW_ID,
    episodeId: "1000726860803",
    episodeTitle:
      "Instinct at Work: Adventures in Antique Jewellery with Michael Singer",
    publishedAt: "2025-09-15",
    guestName: "Michael Singer",
    order: 2,
  },
  {
    slug: "2025-02-04-tales-of-the-trade-miami-beach",
    source: "apple",
    appleShowId: APPLE_SHOW_ID,
    episodeId: "1000688775030",
    episodeTitle: "Tales of the Trade (Live from Miami Beach)",
    publishedAt: "2025-02-04",
    order: 3,
  },
  {
    slug: "2022-07-25-juliet-weir-de-la-rochefoucauld",
    source: "apple",
    appleShowId: APPLE_SHOW_ID,
    episodeId: "1000571056053",
    episodeTitle: "Juliet Weir-de La Rochefoucauld",
    publishedAt: "2022-07-25",
    guestName: "Juliet Weir-de La Rochefoucauld",
    order: 4,
  },
  {
    slug: "2022-07-18-elsa-peretti",
    source: "apple",
    appleShowId: APPLE_SHOW_ID,
    episodeId: "1000570271292",
    episodeTitle: "Elsa Peretti",
    publishedAt: "2022-07-18",
    order: 5,
  },
  {
    slug: "2022-07-04-alma-pihl",
    source: "apple",
    appleShowId: APPLE_SHOW_ID,
    episodeId: "1000568704119",
    episodeTitle: "Alma Pihl",
    publishedAt: "2022-07-04",
    order: 6,
  },
  {
    slug: "2022-06-27-suzanne-belperron",
    source: "apple",
    appleShowId: APPLE_SHOW_ID,
    episodeId: "1000567798538",
    episodeTitle: "Suzanne Belperron",
    publishedAt: "2022-06-27",
    order: 7,
  },
  {
    slug: "2022-06-20-jeanne-toussaint",
    source: "apple",
    appleShowId: APPLE_SHOW_ID,
    episodeId: "1000567096827",
    episodeTitle: "Jeanne Toussaint",
    publishedAt: "2022-06-20",
    order: 8,
  },
];

// ---------- Page copy ----------

const ABOUT_PAGE = {
  _id: "aboutPage",
  _type: "aboutPage",
  eyebrow: "About",
  heading: "The story",
  intro:
    "Gem Pursuit is a podcast about antique and vintage jewellery, the characters who made it and the people who love it. From medieval symbolism to Art Deco glamour and beyond, we go deep on the stories behind the gems.",
  producedByIntro: "The show is hosted by Matthew Weldon and produced by",
  producedByLinkText: "Courtville Antiques",
  producedByLinkUrl: "https://www.courtville.ie",
  producedByOutro:
    ", Dublin's specialist antique and vintage jeweller, established in the Powerscourt Centre. Drawing on decades of trade experience, every episode draws back the curtain on a world most people only see through a shop window.",
  secondaryHeading: "Where to listen",
  secondaryBody:
    "New episodes drop on Spotify, YouTube and every major podcast app. Hit Subscribe to be notified when one lands, or jump straight to the episodes page.",
  tertiaryHeading: "Get in touch",
  tertiaryBody:
    "Got an idea, a question or a piece you'd love us to cover? Use the contact form and the team will get back to you.",
};

const CONTACT_PAGE = {
  _id: "contactPage",
  _type: "contactPage",
  eyebrow: "Get in touch",
  heading: "Say hello",
  intro:
    "Story idea, guest pitch, listener question, or just want to nerd out about jewellery? Drop us a line.",
  directEmailIntro: "Or email us directly at",
};

const SPONSORSHIP_PAGE = {
  _id: "sponsorshipPage",
  _type: "sponsorshipPage",
  eyebrow: "Partnerships",
  heading: "Team up with us",
  intro:
    "Gem Pursuit talks directly to a passionate audience of collectors, jewellers and curious enthusiasts across Ireland, the UK and beyond. If your brand belongs in that conversation, we'd love to hear from you.",
  pillarOneTitle: "Episode sponsorship",
  pillarOneBody:
    "Single or multi-episode reads woven naturally into the show by Matthew.",
  pillarTwoTitle: "Series partnership",
  pillarTwoBody:
    "Title sponsorship of a themed series, with on-air, social and newsletter inclusion.",
  pillarThreeTitle: "Collaborations",
  pillarThreeBody:
    "Live events, product placement, co-branded content. Open to creative ideas.",
  formEyebrow: "Send us a note",
  formHeading: "Sponsorship enquiry",
  formIntro:
    "Tell us a little about the brand and what you have in mind. We usually reply within two working days.",
  directEmailIntro: "Prefer to email directly?",
};

const SPECIALS_PAGE = {
  _id: "specialsPage",
  _type: "specialsPage",
  eyebrow: "Spotlight episodes",
  heading: "Specials",
  intro:
    "A hand-picked selection of deep dives and stand-out conversations from the show. Profiles of the great designers, conversations with guests, and special one-off events.",
  ctaText: "Got a guest you'd love to hear on the show?",
  ctaLinkText: "Get in touch",
  ctaLinkHref: "/contact",
};

// Portable Text version of the privacy policy.
const k = () => Math.random().toString(36).slice(2, 10);
const span = (text, marks = []) => ({
  _type: "span",
  _key: k(),
  text,
  marks,
});
const block = (style, children, listItem, markDefs = []) => ({
  _type: "block",
  _key: k(),
  style,
  children,
  markDefs,
  ...(listItem ? { listItem, level: 1 } : {}),
});

const PRIVACY_PAGE = {
  _id: "privacyPage",
  _type: "privacyPage",
  eyebrow: "Legal",
  heading: "Privacy Policy",
  lastUpdated: "8 May 2026",
  body: [
    block("h2", [span("Who we are")]),
    block("normal", [
      span(
        "Gem Pursuit is a podcast produced by Courtville Antiques (Powerscourt Centre, South William Street, Dublin 2, Ireland). When you use this website, Courtville Antiques is the data controller. You can reach us at info@gempursuit.com."
      ),
    ]),
    block("h2", [span("What information we collect")]),
    block(
      "normal",
      [
        span("Newsletter sign-ups.", ["strong"]),
        span(
          " If you subscribe, we collect your email address and optionally your name."
        ),
      ],
      "bullet"
    ),
    block(
      "normal",
      [
        span("Contact form.", ["strong"]),
        span(
          " If you message us, we collect your name, email and the content of your message."
        ),
      ],
      "bullet"
    ),
    block(
      "normal",
      [
        span("Sponsorship enquiries.", ["strong"]),
        span(
          " If you submit a sponsorship enquiry, we collect your name, company, email, optional phone, partnership preference, budget and message."
        ),
      ],
      "bullet"
    ),
    block(
      "normal",
      [
        span("Basic site analytics.", ["strong"]),
        span(
          " Aggregated, anonymised data about how the site is used (page views, country, referrer). No personal identifiers."
        ),
      ],
      "bullet"
    ),
    block("h2", [span("How we use it")]),
    block(
      "normal",
      [span("To send you new episode notifications, if you've opted in.")],
      "bullet"
    ),
    block("normal", [span("To respond to your contact enquiries.")], "bullet"),
    block(
      "normal",
      [span("To improve the website and the show.")],
      "bullet"
    ),
    block("normal", [
      span(
        "We do not sell or rent your data. We do not share it with third parties except for the processors listed below, who help us run the site."
      ),
    ]),
    block("h2", [span("Who handles your data")]),
    block(
      "normal",
      [
        span("Supabase", ["strong"]),
        span(" — stores subscriber and contact data (EU region)."),
      ],
      "bullet"
    ),
    block(
      "normal",
      [
        span("Resend", ["strong"]),
        span(" — sends our emails (newsletter and contact replies)."),
      ],
      "bullet"
    ),
    block(
      "normal",
      [span("Netlify", ["strong"]), span(" — hosts the website.")],
      "bullet"
    ),
    block(
      "normal",
      [
        span("Spotify and YouTube", ["strong"]),
        span(
          " — when you press play on an embedded player, those services receive the request directly. See their own privacy policies."
        ),
      ],
      "bullet"
    ),
    block("h2", [span("Your rights")]),
    block("normal", [
      span(
        "Under GDPR you have the right to access, correct, delete or export the data we hold on you, and to withdraw consent at any time. Every newsletter email contains a one-click unsubscribe link. To exercise any other right, email info@gempursuit.com."
      ),
    ]),
    block("h2", [span("Cookies")]),
    block("normal", [
      span(
        "This site uses only essential cookies needed for it to function. Embedded Spotify and YouTube players may set their own cookies if you interact with them."
      ),
    ]),
    block("h2", [span("Changes")]),
    block("normal", [
      span(
        "If we update this policy, we'll change the date at the top. Material changes will be flagged on the homepage."
      ),
    ]),
  ],
};

// ---------- Site settings ----------

const SITE_SETTINGS = {
  _id: "siteSettings",
  _type: "siteSettings",
  footerTagline:
    "An antique jewellery podcast from Courtville Antiques in Dublin. Hosted by Matthew Weldon, exploring the stories, history and characters behind the gems we love.",
  contactInbox: "info@gempursuit.com",
  podcastLinks: [
    {
      _key: k(),
      label: "Spotify",
      href: "https://open.spotify.com/show/6z8DMDbFgTZVqzHb02zKjC",
    },
    {
      _key: k(),
      label: "YouTube",
      href: "https://www.youtube.com/channel/UCU6ps7fcW3zuxMZ7AHm9AVw",
    },
    {
      _key: k(),
      label: "Apple Podcasts",
      href: "https://podcasts.apple.com/podcast/gem-pursuit",
    },
  ],
  socialLinks: [
    {
      _key: k(),
      label: "Instagram",
      href: "https://www.instagram.com/gempursuitpod/",
    },
    {
      _key: k(),
      label: "TikTok",
      href: "https://www.tiktok.com/@matthew.weldon?lang=en-GB",
    },
    {
      _key: k(),
      label: "Courtville Antiques",
      href: "https://www.courtville.ie",
    },
  ],
};

// ---------- Run ----------

async function migrateSpecials() {
  console.log("Migrating Specials…");
  for (const s of SPECIALS) {
    const doc = {
      _id: `special.${s.slug}`,
      _type: "special",
      source: s.source,
      episodeTitle: s.episodeTitle,
      publishedAt: s.publishedAt,
      episodeId: s.episodeId,
      ...(s.appleShowId ? { appleShowId: s.appleShowId } : {}),
      ...(s.guestName ? { guestName: s.guestName } : {}),
      ...(s.role ? { role: s.role } : {}),
      ...(s.blurb ? { blurb: s.blurb } : {}),
      order: s.order ?? 0,
    };
    console.log(`  → ${s.episodeTitle}`);
    await client.createOrReplace(doc);
  }
}

async function migratePages() {
  console.log("Migrating Pages…");
  for (const doc of [
    ABOUT_PAGE,
    CONTACT_PAGE,
    SPONSORSHIP_PAGE,
    SPECIALS_PAGE,
    PRIVACY_PAGE,
  ]) {
    console.log(`  → ${doc._type}`);
    await client.createOrReplace(doc);
  }
}

async function migrateSettings() {
  console.log("Migrating Site settings…");
  console.log("  → siteSettings");
  await client.createOrReplace(SITE_SETTINGS);
}

(async () => {
  await migrateSpecials();
  await migratePages();
  await migrateSettings();
  console.log("\n✓ Done. Remember to revoke the API token.");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
