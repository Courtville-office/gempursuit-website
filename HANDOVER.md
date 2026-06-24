# Gem Pursuit — Project Handover

Everything you need to take command of [gempursuit.com](https://gempursuit.com). Written for the incoming admin/developer (Ross). Read top to bottom on first pass; thereafter, jump to whichever section you need.

---

## Table of contents

1. [What this is](#1-what-this-is)
2. [Quick links you'll use daily](#2-quick-links-youll-use-daily)
3. [The stack and how it all connects](#3-the-stack-and-how-it-all-connects)
4. [Accounts you need access to](#4-accounts-you-need-access-to)
5. [Editing content (Sanity Studio)](#5-editing-content-sanity-studio)
6. [Making code changes (developer workflow)](#6-making-code-changes-developer-workflow)
7. [Where things live in the code](#7-where-things-live-in-the-code)
8. [Brand: colours, fonts, layout](#8-brand-colours-fonts-layout)
9. [Pages and what controls each one](#9-pages-and-what-controls-each-one)
10. [Episodes (auto from YouTube RSS)](#10-episodes-auto-from-youtube-rss)
11. [Forms (Contact, Subscribe, Sponsorship)](#11-forms-contact-subscribe-sponsorship)
12. [Newsletter / broadcast emails](#12-newsletter--broadcast-emails)
13. [Domain, DNS, email](#13-domain-dns-email)
14. [Common changes: step-by-step](#14-common-changes-step-by-step)
15. [Troubleshooting](#15-troubleshooting)
16. [Costs and ongoing maintenance](#16-costs-and-ongoing-maintenance)
17. [Things Colin set up that you should know](#17-things-colin-set-up-that-you-should-know)
18. [Backup, version control, rollbacks](#18-backup-version-control-rollbacks)

---

## 1. What this is

The website for **Gem Pursuit**, an antique jewellery podcast produced by Courtville Antiques in Dublin. Live at [gempursuit.com](https://gempursuit.com).

The site has:
- A home page with a hero, latest episode, full episode grid, YouTube Shorts row, social feeds placeholder, and newsletter signup
- An episodes archive auto-populated from the show's YouTube RSS feed
- A single-episode page with side-by-side YouTube + Spotify embeds
- A "Specials" page — a hand-curated list of standout episodes, mixed Spotify + Apple Podcasts embeds
- An About page
- A Sponsorship page with an enquiry form
- A Subscribe page
- A Contact page with form
- A Privacy Policy
- A one-click email unsubscribe page
- An admin interface at `/studio` for non-technical staff to edit content

**Stack at a glance**: Next.js 14 (App Router, TypeScript, Tailwind) on Netlify, content in Sanity, form data in Supabase, email via Resend, custom domain at Register365 with DNS managed by Netlify, email inbox via Google Workspace.

---

## 2. Quick links you'll use daily

| What | URL |
|---|---|
| **Live website** | https://gempursuit.com |
| **Admin / content editor** | https://gempursuit.com/studio |
| **GitHub repo** | https://github.com/Courtville-office/gempursuit-website |
| **Netlify project** | https://app.netlify.com/projects/gempursuit |
| **Sanity project** | https://www.sanity.io/manage/personal/project/tfw6v3tl |
| **Supabase project** | https://supabase.com/dashboard/project/poovqiyuiowravhtmdex |
| **Resend dashboard** | https://resend.com |
| **Domain registrar (Register365)** | https://cp.register365.com |
| **Google Workspace admin** | https://admin.google.com |

---

## 3. The stack and how it all connects

```
                          ┌────────────────────┐
                          │  GitHub repo       │
                          │  (the source code) │
                          └─────────┬──────────┘
                                    │  push
                                    ▼
                          ┌────────────────────┐
                          │  Netlify           │
                          │  (auto-builds and  │
                          │   hosts the site)  │
                          └─────────┬──────────┘
                                    │  serves
                                    ▼
                          ┌────────────────────┐
        edits content     │  gempursuit.com    │     reads content
        flow back to ──▶  │  (the live site)   │ ◀─── from Sanity API
        GitHub via            └─────────┬──────────┘     at build / revalidate
        Studio                          │
                                        ├──▶ Reads YouTube RSS (auto-updates episodes)
                                        ├──▶ Reads Spotify show + Apple show (embeds)
                                        ├──▶ Posts form submissions to Supabase
                                        ├──▶ Sends email via Resend
                                        └──▶ Hourly cron checks YouTube, sends
                                             new-episode emails to subscribers
```

**Plain English version:**

1. The website code lives in a GitHub repo
2. When code is pushed to the `main` branch, **Netlify automatically rebuilds** and publishes the site within ~2 minutes
3. The live site fetches its **content** (page copy, Specials list, settings) from **Sanity** at build time
4. The live site also pulls **episodes** from YouTube's RSS feed automatically
5. When a user submits a form (contact, subscribe, sponsorship), the data is saved to **Supabase** (a database) and emailed via **Resend** to `info@gempursuit.com`
6. Once an hour, a **cron job** checks for new YouTube episodes; when one appears, it emails all subscribers in Supabase
7. `info@gempursuit.com` is an alias on a Courtville Google Workspace user — actual inbox is wherever Colin set the alias to

---

## 4. Accounts you need access to

Get login credentials / accept invites for these. Most are free for our usage; one or two might charge for upgrades you don't need.

| Service | What it controls | Plan | Your role | Login |
|---|---|---|---|---|
| **GitHub** (`Courtville-office`) | All source code | Free | Admin / Owner | https://github.com |
| **Netlify** (Courtville Team) | Hosting, deploys, env vars, custom domain | Free | Owner | https://app.netlify.com |
| **Sanity** (Courtville org → Gem Pursuit project) | Editable content via /studio | Free / Growth Trial | Administrator | https://www.sanity.io/manage |
| **Supabase** (Courtville org) | Subscriber DB, form submissions | Free | Administrator | https://supabase.com/dashboard |
| **Resend** (Courtville account) | Outbound email | Free (3,000 emails/month) | Admin | https://resend.com |
| **Register365** | The `gempursuit.com` domain | Annual renewal | Account owner | https://cp.register365.com |
| **Google Workspace** | The `info@gempursuit.com` inbox alias | Existing Courtville Workspace | Super admin | https://admin.google.com |
| **Behold.so** (not yet set up) | Optional Instagram + TikTok feeds on home page | Free tier | TBD | https://behold.so |

For each one, ask Colin to invite you using your work email (probably `ross@something`). For Register365 and Google Workspace, you may need shared password access via a password manager (1Password / LastPass / Bitwarden).

---

## 5. Editing content (Sanity Studio)

**URL**: https://gempursuit.com/studio

This is the main day-to-day interface. Non-technical staff use it. You will too for any content change that doesn't need code.

### What's editable here

- **Specials (Featured Episodes)** — the hand-curated list on `/specials`. Add / edit / delete entries.
- **About page** — heading, intro, "Where to listen" body, "Get in touch" body.
- **Contact page** — heading, intro, direct email line.
- **Sponsorship page** — heading, intro, three pillars, form copy.
- **Specials page (heading & footer)** — the page's own heading + intro + CTA. Distinct from the Specials list itself.
- **Privacy Policy** — rich text editor for the policy body.
- **Site settings** — footer tagline, contact inbox, podcast platform links (Spotify, YouTube, Apple), social links (Instagram, TikTok, Courtville).

### What's NOT editable in Studio (needs code, see Section 14)

- Brand colours / fonts
- Header navigation labels
- Page layouts / structure
- The forms themselves
- Anything in `src/`

### How to add a Special

1. Studio left sidebar → **Specials (Featured Episodes)**
2. Top right → **+ New Special**
3. Fill the form:
   - **Where the episode lives**: Spotify or Apple Podcasts
   - **Episode title**: as you'd like it to appear
   - **Published date**: when it dropped
   - **Apple Show ID** (only if Apple): default `1514094392`. Leave alone unless we change podcasts
   - **Episode ID**:
     - Spotify: the bit after `/episode/` in the URL (e.g. `6Ra7sRi3nHts6WIs4gIE1Q`)
     - Apple: the bit after `?i=` in the URL (e.g. `1000726860803`)
   - Optional: guest name, role, blurb, manual sort order
4. Click **Publish** (top right). Wait ~90 seconds. Live.

### How to edit page copy

1. Sidebar → click the page (About / Contact / Sponsorship / Specials / Privacy)
2. Edit the fields
3. Click **Publish**

For Privacy Policy the body is a rich text editor with H2 / H3 / bullet list / bold / italic / links.

### How publishing works under the hood

When you click **Publish**, Sanity saves to its hosted database. The live site reads from Sanity at build time. Netlify rebuilds **every 10 minutes** automatically, OR you can force-rebuild by going to Netlify → **Deploys** → **Trigger deploy → Deploy site** (build takes ~2 min).

To make publishes appear instantly without waiting 10 min, you can set up a Sanity webhook → Netlify build hook. Not currently wired up; nice future improvement.

---

## 6. Making code changes (developer workflow)

### One-time setup on your Mac / dev machine

1. Install **Node.js 20+** (https://nodejs.org)
2. Install **Git** (https://git-scm.com — Mac has it built in)
3. Install **GitHub CLI** (`brew install gh`) and authenticate: `gh auth login` → pick the `Courtville-office` account
4. Clone the repo:
   ```bash
   cd ~/Desktop
   git clone https://github.com/Courtville-office/gempursuit-website.git
   cd gempursuit-website
   npm install
   ```
5. Copy the environment file: `cp .env.example .env.local`
6. Get the secret values from Colin / password manager and paste them into `.env.local`
7. Run the dev server: `npm run dev`
8. Open http://localhost:3000

### Day-to-day flow

```bash
cd ~/Desktop/gempursuit-website
git pull                          # get latest changes from GitHub
# ...make your changes in a code editor (VS Code is the obvious pick)
npm run dev                       # live preview at localhost:3000 while you edit
npm run lint                      # check for code issues
npm run build                     # confirm a production build works
git add -A
git commit -m "what you changed"
git push                          # auto-deploys to gempursuit.com via Netlify within ~2 min
```

### Branching (recommended for non-trivial changes)

```bash
git checkout -b ross/some-feature   # create a branch
# ...work...
git push -u origin ross/some-feature
gh pr create --fill                  # open a pull request
# ...merge via GitHub UI after review...
```

Pushing to `main` deploys immediately. Branches don't deploy unless you specifically open a Deploy Preview via Netlify settings.

---

## 7. Where things live in the code

```
gempursuit-website/
├── HANDOVER.md                ← this file
├── OFFICE_HANDOVER.md         ← simpler version for non-technical staff
├── README.md                  ← initial setup notes
├── netlify.toml               ← Netlify build config + scheduled functions
├── next.config.mjs            ← Next.js config (redirects, image domains)
├── package.json               ← npm dependencies
├── sanity.config.ts           ← Sanity Studio config + schema registration
├── tailwind.config.ts         ← BRAND PALETTE + fonts (the colour file)
├── tsconfig.json              ← TypeScript config
│
├── netlify/functions/         ← Netlify scheduled functions
│   └── check-episodes.mts     ← hourly cron that hits /api/cron/check-episodes
│
├── sanity/                    ← CMS schemas
│   ├── schemas/
│   │   ├── index.ts           ← exports all schemas
│   │   ├── special.ts         ← Specials schema
│   │   ├── pages.ts           ← About / Contact / Sponsorship / Specials / Privacy schemas
│   │   └── siteSettings.ts    ← global settings schema
│   └── structure.ts           ← Studio sidebar layout
│
├── scripts/
│   └── migrate-to-sanity.mjs  ← one-off seed script (already used; can delete)
│
├── supabase/
│   └── schema.sql             ← idempotent DB schema (run once on a fresh project)
│
├── public/                    ← static files served at root (currently empty)
│
└── src/
    ├── app/                   ← Next.js App Router pages
    │   ├── layout.tsx         ← root layout: html, fonts, metadata
    │   ├── globals.css        ← global CSS, brand utility classes
    │   ├── (site)/            ← route group: every public page (Header + Footer)
    │   │   ├── layout.tsx     ← site-wide layout (Header, main, Footer)
    │   │   ├── page.tsx       ← home page
    │   │   ├── about/page.tsx
    │   │   ├── contact/page.tsx
    │   │   ├── episodes/
    │   │   │   ├── page.tsx        ← episodes list
    │   │   │   └── [id]/page.tsx   ← single episode
    │   │   ├── privacy/page.tsx
    │   │   ├── specials/page.tsx
    │   │   ├── sponsorship/page.tsx
    │   │   ├── subscribe/page.tsx
    │   │   └── unsubscribe/page.tsx
    │   ├── studio/[[...tool]]/page.tsx  ← Sanity Studio mounted here (uses its own UI, no Header/Footer)
    │   ├── api/               ← server-side API endpoints
    │   │   ├── contact/route.ts        ← POST /api/contact
    │   │   ├── subscribe/route.ts      ← POST /api/subscribe
    │   │   ├── sponsorship/route.ts    ← POST /api/sponsorship
    │   │   ├── unsubscribe/route.ts    ← GET/POST /api/unsubscribe
    │   │   └── cron/check-episodes/route.ts  ← cron endpoint
    │   ├── fonts/             ← ArtisualDeco .otf files
    │   ├── robots.ts          ← /robots.txt generator
    │   └── sitemap.ts         ← /sitemap.xml generator
    │
    ├── components/            ← reusable React components
    │   ├── Header.tsx         ← the sticky top bar with nav
    │   ├── Footer.tsx         ← reads tagline + links from Sanity
    │   ├── Wordmark.tsx       ← the "GEM PURSUIT" lockup
    │   ├── EpisodeCard.tsx
    │   ├── SpotifyEmbed.tsx   ← exports SpotifyShowEmbed, SpotifyEpisodeEmbed, ApplePodcastEpisodeEmbed
    │   ├── YouTubeEmbed.tsx
    │   ├── ContactForm.tsx
    │   ├── SubscribeForm.tsx
    │   ├── SponsorshipForm.tsx
    │   └── SocialFeed.tsx     ← Behold.so feeds (currently placeholders)
    │
    ├── lib/                   ← server-only helper modules
    │   ├── youtube.ts         ← YouTube RSS fetcher
    │   ├── spotify.ts         ← (none, IDs live in links.ts)
    │   ├── links.ts           ← Spotify show ID, YouTube channel ID, default link lists
    │   ├── specials.ts        ← reads from Sanity, returns Special[]
    │   ├── supabase.ts        ← Supabase client wrapper
    │   └── resend.ts          ← Resend client wrapper + FROM_ADDRESS, CONTACT_INBOX
    │
    └── sanity/                ← Sanity client wiring for the website (not the Studio)
        ├── client.ts          ← Sanity client instance
        └── queries.ts         ← GROQ queries for every document type
```

---

## 8. Brand: colours, fonts, layout

### Colours

**File**: `tailwind.config.ts` — open that file and scroll to the `colors` block.

Currently:
| Class name | Hex | Used for |
|---|---|---|
| `maroon` (DEFAULT) | `#FAF1D0` | page background (butter cream) |
| `maroon-deep` | `#FFFCE7` | card surfaces |
| `maroon-light` | `#F2D04E` | yellow accent (logo card, hero underline) |
| `gold` | `#2D2E8C` | primary accent (buttons, labels, links) — royal blue |
| `gold-soft` | `#4344A8` | hover blue |
| `gold-deep` | `#1A1D4D` | deep navy for shadows |
| `violet` | `#2D2E8C` | GEM wordmark (royal blue) |
| `violet-deep` | `#1A1D4D` | deep navy |
| `ember` | `#C84526` | PURSUIT wordmark (red-orange) |
| `ember-deep` | `#A12F18` | darker red-orange |
| `cream` | `#1F2147` | body text (deep navy) |

Note the class names are legacy from earlier palettes — the *names* don't match the colours any more, but the components reference the names. So `bg-maroon` actually paints a butter colour, `text-gold` paints blue, etc.

**To change a colour**: edit `tailwind.config.ts`, change the hex, save. Run `npm run dev` to preview locally. Push to deploy.

### Fonts

**File**: `src/app/layout.tsx`

Two fonts loaded:
- **Inter** (Google Font) — body text, form labels
- **ArtisualDeco** (custom local font) — every heading and the wordmark

ArtisualDeco files live in `src/app/fonts/`. All 10 weights are loaded (Thin → Black, regular + italic). To change the display font, replace the `localFont` block in `layout.tsx`.

### Wordmark

The "GEM PURSUIT" lockup is the `Wordmark` component (`src/components/Wordmark.tsx`). It supports three sizes (`sm`, `md`, `lg`) and has a yellow underline beneath the text. The Header uses `sm`, the home page hero uses an inline larger version.

Variations explored earlier (yellow tile, monochrome, dot separator, etc.) live as inline JSX in older git history — search the history if you ever want to revisit.

---

## 9. Pages and what controls each one

| Route | File | Content source |
|---|---|---|
| `/` (home) | `src/app/(site)/page.tsx` | Hard-coded copy + YouTube RSS + Sanity socials |
| `/about` | `src/app/(site)/about/page.tsx` | **Sanity** (`aboutPage` document) |
| `/contact` | `src/app/(site)/contact/page.tsx` | **Sanity** + form posts to `/api/contact` |
| `/sponsorship` | `src/app/(site)/sponsorship/page.tsx` | **Sanity** + form posts to `/api/sponsorship` |
| `/specials` | `src/app/(site)/specials/page.tsx` | **Sanity** (specials list + page header) |
| `/privacy` | `src/app/(site)/privacy/page.tsx` | **Sanity** (`privacyPage` document, body is Portable Text) |
| `/episodes` | `src/app/(site)/episodes/page.tsx` | **YouTube RSS** (auto) |
| `/episodes/:id` | `src/app/(site)/episodes/[id]/page.tsx` | **YouTube RSS** (auto) |
| `/subscribe` | `src/app/(site)/subscribe/page.tsx` | Hard-coded copy + form posts to `/api/subscribe` |
| `/unsubscribe` | `src/app/(site)/unsubscribe/page.tsx` | One-click unsubscribe handler |
| `/studio` | `src/app/studio/[[...tool]]/page.tsx` | Sanity Studio (its own UI) |
| `/admin` | redirect | 301 to `/studio` (legacy URL from Decap CMS era) |
| `/guests` | redirect | 301 to `/specials` (legacy URL) |
| `/robots.txt` | `src/app/robots.ts` | Auto-generated |
| `/sitemap.xml` | `src/app/sitemap.ts` | Auto-generated (lists all static pages + episode IDs from RSS) |

### Adding a new page

```bash
mkdir src/app/\(site\)/my-new-page
```

Create `src/app/(site)/my-new-page/page.tsx`:
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My new page",
  description: "What this page is about",
};

export default function MyNewPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
      <h1 className="font-display text-5xl">Hello</h1>
      <p className="mt-4 text-cream/80">Content here.</p>
    </div>
  );
}
```

To add it to the header nav: edit `src/components/Header.tsx` and add an entry to the `nav` array.

---

## 10. Episodes (auto from YouTube RSS)

The `/episodes` page list and each `/episodes/:id` single page are **completely automatic**. They pull the show's video feed from:

```
https://www.youtube.com/feeds/videos.xml?channel_id=UCU6ps7fcW3zuxMZ7AHm9AVw
```

(The channel ID lives in `src/lib/links.ts`.)

Every 10 minutes, Next.js refetches the feed. New uploads appear automatically — no admin action needed.

Episode thumbnails use YouTube's `maxresdefault.jpg` for full-episode videos and `hqdefault.jpg` for Shorts (Shorts don't always have a max-res version).

**If the YouTube channel ID changes**, edit `src/lib/links.ts` and update `YOUTUBE_CHANNEL_ID`.

---

## 11. Forms (Contact, Subscribe, Sponsorship)

All three forms have the same architecture:

1. User fills the form on the website (React client component)
2. Form POSTs to a Next.js API route (`/api/contact`, `/api/subscribe`, or `/api/sponsorship`)
3. The API route does three things:
   - Validates the input
   - Stores the submission in a **Supabase** table (`contact_submissions`, `subscribers`, or `sponsorship_enquiries`)
   - Sends an email to `info@gempursuit.com` via **Resend** (Contact and Sponsorship — not Subscribe)
4. The form shows a success or error message

### Where to see submissions

Open Supabase → **Table editor**. Tables:
- `subscribers` — newsletter signups (email, name, source, unsubscribe_token, created_at, unsubscribed_at)
- `contact_submissions` — contact form messages
- `sponsorship_enquiries` — sponsorship leads
- `broadcast_log` — record of which YouTube episodes have been emailed

You can also export any table as CSV from Supabase's UI.

### Email recipient

Hard-coded in env vars: `CONTACT_INBOX=info@gempursuit.com`. Defined in Netlify → Environment variables. Defaults to `info@gempursuit.com` if env var is missing (see `src/lib/resend.ts`).

To change the inbox, change the env var in Netlify and trigger a redeploy.

### Spam protection

None currently. If spam becomes a problem:
- Add a honeypot field (hidden field that bots fill but humans don't)
- Add hCaptcha or Cloudflare Turnstile
- Both are free to set up

---

## 12. Newsletter / broadcast emails

### How it works

When a YouTube video is published to the Gem Pursuit channel:

1. A **scheduled Netlify function** (`netlify/functions/check-episodes.mts`) runs every hour
2. It calls the internal API route `/api/cron/check-episodes` with a Bearer token (`CRON_SECRET` env var)
3. The cron route fetches the YouTube RSS feed
4. It checks `broadcast_log` in Supabase to see if the latest video has been emailed
5. If not, it:
   - Fetches all active subscribers from Supabase (where `unsubscribed_at` is null)
   - Sends a batch of emails via Resend (100 at a time)
   - Records the broadcast in `broadcast_log`

### To trigger a manual broadcast

```bash
curl -X POST \
  -H "Authorization: Bearer $CRON_SECRET" \
  https://gempursuit.com/api/cron/check-episodes
```

Replace `$CRON_SECRET` with the value from Netlify env vars.

### To customise the email template

Edit `renderHtml()` and `renderText()` in `src/app/api/cron/check-episodes/route.ts`.

### Unsubscribe

Every newsletter email contains a one-click unsubscribe link:
```
https://gempursuit.com/api/unsubscribe?token=<uuid>
```

The token is each subscriber's unique unsubscribe token (stored in Supabase). Clicking the link marks them as unsubscribed.

---

## 13. Domain, DNS, email

### Domain ownership

`gempursuit.com` is registered at **Register365** (https://cp.register365.com). Renewed annually. Login is in Colin's password manager.

### DNS

DNS is **managed by Netlify**, not Register365. The domain's nameservers at Register365 are set to:
- `dns1.p01.nsone.net`
- `dns2.p01.nsone.net`
- `dns3.p01.nsone.net`
- `dns4.p01.nsone.net`

Don't change those at Register365 unless you mean to migrate DNS providers.

All DNS records — A, CNAME, MX, TXT — are added in Netlify → **gempursuit.com** → **DNS records**.

### Current DNS records

| Type | Name | Value | Purpose |
|---|---|---|---|
| NETLIFY | `gempursuit.com` | `gempursuit.netlify.app` | apex → site |
| NETLIFY | `www.gempursuit.com` | `gempursuit.netlify.app` | www → site |
| MX (priority 1) | `gempursuit.com` | `smtp.google.com` | Google Workspace mail in |
| MX (priority 10) | `send.gempursuit.com` | `feedback-smtp.eu-west-1.amazonses.com` | Resend bounce reports |
| TXT | `gempursuit.com` | `google-site-verification=...` | Google ownership proof |
| TXT | `send.gempursuit.com` | `v=spf1 include:amazonses.com ~all` | Resend SPF |
| TXT | `_dmarc.gempursuit.com` | `v=DMARC1; p=none;` | DMARC |
| TXT | `resend._domainkey.gempursuit.com` | `p=MIGfMA0G...` | Resend DKIM |

If something email-related stops working, check those records still exist in Netlify DNS.

### The info@gempursuit.com inbox

Routed via Google Workspace:
- `gempursuit.com` is a **secondary domain** on the existing Courtville Google Workspace
- `info@gempursuit.com` is an **alternate email** alias on one of the existing Courtville users (Colin's user, probably)
- Mail sent to `info@gempursuit.com` lands in that user's Gmail inbox

To reroute to a different person:
1. admin.google.com → Directory → Users
2. Find the user currently holding the alias → remove `info@gempursuit.com` from their alternate emails
3. Find the new target user → add `info@gempursuit.com` to their alternate emails

---

## 14. Common changes: step-by-step

### "Change the page background colour"

1. Open `tailwind.config.ts`
2. Find the `colors.maroon.DEFAULT` value
3. Change the hex
4. Commit and push

### "Change the headline font"

1. Save the new font files (`.woff2` or `.otf`) into `src/app/fonts/`
2. Open `src/app/layout.tsx`
3. Replace the `artisualDeco` block with a new `localFont` definition pointing to your new files
4. Commit and push

### "Add a new featured episode (Special)"

Use Sanity Studio. See Section 5.

### "Edit copy on the About page"

Use Sanity Studio. Section 5.

### "Change the Spotify show ID (if the show moves)"

1. Open `src/lib/links.ts`
2. Update `SPOTIFY_SHOW_ID`
3. Commit and push

### "Add a new page (e.g. /shop)"

1. Create the folder + file: `src/app/(site)/shop/page.tsx`
2. Write the page as a React server component (see Section 9 example)
3. Add it to the nav: open `src/components/Header.tsx` and append `{ href: "/shop", label: "Shop" }` to the `nav` array
4. Commit and push

### "Connect Instagram + TikTok feeds on the home page"

The placeholder cards on the home page are wired to **Behold.so** widget IDs. To activate:

1. Go to https://behold.so → sign up
2. Connect Instagram (@gempursuitpod) → publish a widget → copy the Feed ID
3. Same for TikTok (@matthew.weldon) → copy that Feed ID too
4. In Netlify env vars, add:
   - `NEXT_PUBLIC_BEHOLD_INSTAGRAM_FEED_ID=<the id>`
   - `NEXT_PUBLIC_BEHOLD_TIKTOK_FEED_ID=<the id>`
5. Trigger a Netlify redeploy
6. Placeholders disappear; live feeds load

### "Update the newsletter email template"

Open `src/app/api/cron/check-episodes/route.ts` and edit the `renderHtml()` and `renderText()` functions near the bottom.

### "Trigger a manual newsletter blast right now"

The cron only emails subscribers when it detects a brand-new YouTube video. To force a send manually for an already-broadcast episode, you'd need to delete the row in `broadcast_log` (Supabase Table Editor) and then either wait for the next cron tick or `curl` the endpoint manually (see Section 12).

### "Roll back a bad change"

```bash
git log --oneline       # find the commit before the broken one
git revert <bad-commit-hash>
git push
```

Netlify will auto-deploy the revert.

---

## 15. Troubleshooting

### "The live site shows old content even after I published in Sanity"

Pages revalidate every 10 minutes. Either wait 10 minutes, OR force a rebuild:
- Netlify → Deploys → Trigger deploy → Deploy site

### "I pushed to GitHub but the live site didn't update"

Check Netlify → Deploys. If a build failed (red row), click into it to see the log. Common causes:
- TypeScript error — fix the type
- Missing env var — add it in Netlify
- Module not found — `npm install` locally and commit the updated `package-lock.json`

### "The contact form returns 'Could not send your message'"

Check Resend → Logs. The most likely cause is `RESEND_API_KEY` is invalid (revoked or rotated). Generate a new one at resend.com and update the Netlify env var.

### "Forms work but no email arrives"

The website *sends* the email correctly (you'll see it in Resend logs), but `info@gempursuit.com` might not be routing to a real inbox. Check:
1. Resend → Logs → click the email → look for "Delivered" or "Bounced"
2. If "Delivered" but you don't see it: check the Gmail inbox the alias forwards to, and check spam
3. If "Bounced": the Google Workspace alias isn't set up. Re-do Section 13's "info@ inbox" step.

### "The Studio at /studio shows 'CORS error'"

When the site's URL changes (e.g. you set up a new staging environment), Sanity blocks requests from new origins by default. Add the new origin at https://www.sanity.io/manage/personal/project/tfw6v3tl/api/cors.

### "npm run dev fails with 'Cannot find module ./xxx.js'"

This is a stale Next.js cache. Run:
```bash
rm -rf .next
npm run dev
```

### "Production build fails on Netlify with a TypeScript error that didn't appear locally"

Run `npm run build` locally first — it does the same checks. If it passes locally but fails on Netlify, the env vars probably differ. Check Netlify deploy logs for the specific file/line.

---

## 16. Costs and ongoing maintenance

### Currently free

- GitHub (public repo, unlimited)
- Netlify (free tier — 100 GB bandwidth, 300 build min/month)
- Sanity (free tier — 3 users, 10k API requests/day)
- Supabase (free tier — 500 MB storage, 50k MAU)
- Resend (free tier — 3,000 emails/month)
- YouTube RSS / Spotify embeds / Apple embeds — all free, no API key needed

### Paid

- **Register365 domain renewal** — annual, ~€15-30/year
- **Google Workspace** — already paying for Courtville Workspace, no extra cost for the gempursuit.com alias

### Watch out for

- **Resend at scale** — if subscribers grow past ~3,000 broadcast emails/month, you'll need Pro ($20/month)
- **Sanity Growth Trial** — Colin's account is in a 14-day trial of Growth ($99/month). It auto-downgrades to Free when the trial ends. **Make sure he/you don't get charged on accident.** Check Sanity → Plan to confirm
- **Netlify bandwidth** — 100 GB/month is plenty for a podcast site, but check Netlify → Usage if traffic spikes

### Monthly checks I'd suggest

1. Check Netlify Deploys — make sure there's no red on the most recent build
2. Check Sanity → Members — confirm only people who should have access do
3. Check Resend → Logs — look for bounces or spam complaints
4. Check Supabase → Subscribers count — sanity-check it's growing
5. Check Register365 renewal date for the domain

---

## 17. Things Colin set up that you should know

A few quirks worth knowing:

1. **Two GitHub accounts exist**: `tronborg2000` (Colin's personal, created the repo originally) and `Courtville-office` (current owner, where the repo was transferred to). The `tronborg2000` URL auto-redirects on GitHub.

2. **Decap CMS used to exist at /admin**. We migrated to Sanity. `/admin` now 301-redirects to `/studio`. Some old emails or shared links might still point at `/admin` — they work.

3. **The /guests route used to exist** as the original name for what is now /specials. `/guests` 301-redirects to `/specials`.

4. **`tailwind.config.ts` class names don't match colours**. The class `bg-maroon` paints butter cream, `text-gold` paints royal blue, etc. Legacy from earlier palettes. The hex values in the config are what matter — class names are just labels at this point.

5. **The cron endpoint is at `/api/cron/check-episodes`** but it's invoked by a Netlify scheduled function at `netlify/functions/check-episodes.mts`. The function is what's actually on Netlify's hourly schedule; the API route is what does the work.

6. **The `scripts/migrate-to-sanity.mjs` file** is a one-off seed script that's already been run. Safe to delete. Kept around in case you ever wipe Sanity and need to reseed defaults.

7. **`OFFICE_HANDOVER.md`** is the simpler version of this doc for non-technical users. Share it with Office (info@gempursuit.com) when you next train them.

8. **The Specials page uses Sanity's `_id` like `special.2026-04-13-a-new-kind-of-dealer`** — slug-style IDs. Generated by the migration script. New entries you create through the Studio get auto-generated IDs like `aBc123xYz` — that's fine, same query works.

9. **There's some personal/working content in the repo root** that's `.gitignored`: `IMG_*.png`, etc. Don't worry about those.

10. **Resend uses `info@gempursuit.com` as both the FROM address and the recipient for contact forms.** So when someone contacts via the form, they receive an email from info@gempursuit.com and we receive a copy. The `reply-to` header is set to the original sender so when you click reply in Gmail, it replies to the user, not to ourselves.

---

## 18. Backup, version control, rollbacks

### Code backup

Every commit pushed to `main` is permanently stored on GitHub. **There is no separate backup needed** — the GitHub repo IS the backup. Even if Netlify, Sanity, Supabase and Resend all disappeared overnight, the code could be redeployed elsewhere in an hour.

### Content backup

Sanity's content is in their hosted database. They keep an immutable history of every change — go to any document → three-dot menu → "View history" — and you can roll back any field to any prior state.

For a paranoid offsite backup, you can export the whole Sanity dataset:
```bash
npx sanity@latest dataset export production
```

(Run from the project root. Needs Sanity CLI auth.)

### Database backup

Supabase free tier includes 7 days of daily backups. Visible at Supabase → Database → Backups. For longer retention, upgrade or run periodic CSV exports.

### Rolling back a bad deploy

Netlify keeps every deploy. If a bad change goes live:

1. Netlify → Deploys
2. Find the last-good deploy in the list
3. Click it → top right → **Publish deploy**
4. Live site is now serving that version, ignoring whatever's on GitHub
5. Then fix the code, push, and Netlify will auto-deploy again

### Rolling back a bad git commit

```bash
git log --oneline -10
git revert <bad-commit-hash>
git push
```

Creates a new commit that undoes the bad one. Auto-deploys to Netlify. Original commit history preserved.

---

## Final word

The whole stack is intentionally **low-magic**. Every editable thing is either:
- A file in this repo (you can grep it)
- A Sanity document (you can see it in the Studio)
- A row in Supabase (you can browse it in Table Editor)
- An env var in Netlify (you can read it in the env vars panel)

If you can't find where something is controlled, search the codebase or grep the contents of those four places. Almost always one of them has the answer.

Welcome aboard.
