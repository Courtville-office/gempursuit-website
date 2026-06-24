# Gem Pursuit

The website for **Gem Pursuit**, an antique jewellery podcast produced by Courtville Antiques. Lives at [gempursuit.com](https://gempursuit.com).

Stack: Next.js 14 (App Router) + Tailwind, Supabase for data, Resend for email, deployed on Netlify. Episodes are pulled live from the show's YouTube RSS feed and players are embedded from both YouTube and Spotify.

---

## Quick start (local)

```bash
npm install
cp .env.example .env.local   # fill in keys, see below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The site works without any keys configured (episodes still render from YouTube). Forms will say "saved but email not configured" until you add the Resend and Supabase keys.

---

## Architecture in 30 seconds

| Concern | Where it lives |
|---|---|
| Episode list and detail | `src/app/episodes/` (RSS-driven, revalidates every 10 min) |
| YouTube RSS fetcher | `src/lib/youtube.ts` |
| Spotify and YouTube embeds | `src/components/SpotifyEmbed.tsx`, `YouTubeEmbed.tsx` |
| Newsletter signup | `/subscribe` → `/api/subscribe` → Supabase (source of truth) |
| Contact form | `/contact` → `/api/contact` → emails `info@gempursuit.com` via Resend, also stored in Supabase |
| New-episode auto-broadcast | `/api/cron/check-episodes` reads subscribers from Supabase, sends via Resend in batches of 100, hourly |
| Unsubscribe | One-click link in every email → `/api/unsubscribe?token=...` → marks `unsubscribed_at` in Supabase |
| Instagram + TikTok feeds | Home page section, powered by [Behold.so](https://behold.so) widget IDs (free tier) |
| Brand palette | `tailwind.config.ts` (maroon, gold, violet, ember, cream) |

---

## Deployment checklist

Walk through these once. You only do it once.

### 1. Supabase

1. Sign up at [supabase.com](https://supabase.com) and create a **new project** in the EU region. Name it something like `gempursuit-prod`.
2. Wait for the project to provision (~2 min).
3. In the Supabase dashboard go to **SQL Editor** and run the contents of [`supabase/schema.sql`](supabase/schema.sql). This creates the `subscribers`, `contact_submissions` and `broadcast_log` tables.
4. Go to **Project Settings → API**. Copy:
   - `Project URL` → use as `SUPABASE_URL`
   - `service_role` key (the secret one, not the anon key) → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Resend

Resend is used purely as the email transport. The subscriber list lives in Supabase.

1. Sign up at [resend.com](https://resend.com).
2. **Add domain** → `gempursuit.com`. Resend gives you a DNS record set (SPF, DKIM, return-path).
3. Add those DNS records at your domain registrar. Wait for Resend to verify (usually a few minutes).
4. **API Keys → Create** with full access → copy → `RESEND_API_KEY`.
5. Decide your "from" address. Recommended: `Gem Pursuit <info@gempursuit.com>` (same address contact forms route to). Set as `RESEND_FROM_ADDRESS`.

### 3. GitHub

The repo lives at `github.com/<owner>/gempursuit-website`. Code is pushed via the `gh` CLI.

### 4. Behold.so (Instagram + TikTok feeds)

The home page has a "Latest from the feed" section that pulls posts from Instagram and TikTok. Behold.so is a free, well-regarded widget service for this. Free tier covers 1 Instagram feed and 1 TikTok feed.

1. Sign up at [behold.so](https://behold.so).
2. Click **New widget → Instagram** and connect `@gempursuitpod`. Behold guides you through the Instagram login. Pick the layout you like.
3. Once published, copy the **Feed ID** from the widget settings → use as `NEXT_PUBLIC_BEHOLD_INSTAGRAM_FEED_ID`.
4. Repeat for TikTok with `@matthew.weldon` → `NEXT_PUBLIC_BEHOLD_TIKTOK_FEED_ID`.

If you skip this step, the section gracefully shows a "set this up later" placeholder with a link to follow on each platform.

### 5. Netlify

1. Sign up at [netlify.com](https://netlify.com).
2. **Add new site → Import from Git → GitHub** and pick `gempursuit-website`.
3. Build command auto-detects from `netlify.toml` (`npm run build`). Publish directory `.next`.
4. **Site settings → Environment variables**, add:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `RESEND_FROM_ADDRESS`
   - `CONTACT_INBOX` = `info@gempursuit.com`
   - `SITE_URL` = `https://gempursuit.com`
   - `CRON_SECRET` = generate a random 32+ char string (`openssl rand -hex 32`)
   - `NEXT_PUBLIC_BEHOLD_INSTAGRAM_FEED_ID` (optional, from Behold.so)
   - `NEXT_PUBLIC_BEHOLD_TIKTOK_FEED_ID` (optional, from Behold.so)
5. **Deploy site**.
6. **Domain settings → Add custom domain** → `gempursuit.com`. Netlify gives you DNS records:
   - For apex (`gempursuit.com`): an `A` record pointing at Netlify load balancer (or use Netlify DNS for ALIAS support).
   - For `www`: a `CNAME` to your Netlify subdomain.
7. Add those records at your domain registrar. SSL provisions automatically.

### 6. Verify the cron works

The new-episode broadcast runs hourly via Netlify scheduled functions. To trigger a test run manually:

```bash
curl -X POST -H "Authorization: Bearer $CRON_SECRET" \
  https://gempursuit.com/api/cron/check-episodes
```

Expected JSON responses:

- `{"action":"already-broadcast"}` — latest YouTube episode has already been emailed.
- `{"action":"sent","videoId":"...","sent":N,"failed":0}` — emailed all N subscribers about a new episode.
- `{"action":"partial","sent":N,"failed":M}` — some emails couldn't go out, see Resend logs.
- `{"action":"no-subscribers"}` — there's a new episode but the subscriber table is empty.
- `{"action":"skipped-no-resend"}` — Resend not configured (env vars missing).

---

## Adding content

### Specials page

A hand-picked list of stand-out episodes (deep-dive profiles, guest episodes, one-off events). To add or edit an entry, open `src/lib/specials.ts` and append a Spotify or Apple Podcasts entry to `SPECIALS`. The list sorts newest first automatically by `publishedAt`. The route `/guests` permanently redirects to `/specials`.

### Editing copy

Almost all human-written copy lives directly in the page files under `src/app/*/page.tsx`. Search and replace.

### Adding pages

Drop a new folder under `src/app/`, e.g. `src/app/shop/page.tsx`. It picks up the layout, header and footer automatically. Add it to the nav array in `src/components/Header.tsx`.

---

## Local testing tips

- `npm run lint` — runs ESLint.
- `npm run build` — runs the full production build (types + bundling).
- `npm run dev` — hot-reloads on save.
- The YouTube RSS is cached for 10 minutes via `next: { revalidate: 600 }`. To force a fresh fetch in development, restart `npm run dev`.

---

## Troubleshooting

**"Episodes will appear here as soon as the YouTube feed connects"** — YouTube returned an error or empty feed. Check the channel ID hasn't changed in `src/lib/links.ts`.

**Subscribe form returns success but no email arrives** — the subscribe form doesn't send an email itself. Subscribers only get an email when a new YouTube episode is detected by the hourly cron job. To send a one-off note now, run a manual broadcast or hit the cron endpoint after a new episode goes live.

**Subscriber count keeps going up but emails fail** — check `RESEND_API_KEY` is set and the from-domain is verified in Resend. Without Resend the cron route returns `skipped-no-resend` and just logs the broadcast as skipped.

**Cron route returns 401** — `CRON_SECRET` mismatch between the env var and the Authorization header.

**Spotify embed shows a different episode** — by design. The show-level embed always plays the freshest Spotify episode. To embed a specific Spotify episode on its YouTube counterpart, add a `spotify_episode_id` column on a future `episodes` Supabase table and update `src/components/SpotifyEmbed.tsx` to use `SpotifyEpisodeEmbed`.
