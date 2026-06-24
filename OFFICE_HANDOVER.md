# Office handover — gempursuit.com

This document is for the new site administrator. It explains how to edit the website without touching code.

## Where to log in

**https://gempursuit.com/studio**

Sign in with the email you were invited at. The interface is **Sanity Studio** — a modern, clean editing experience designed for non-technical editors.

## What you can edit

1. **Specials (Featured Episodes)** — the hand-picked featured episodes shown on the [Specials page](https://gempursuit.com/specials). Add, edit, delete, reorder.
2. **About page** — heading, intro, sections.
3. **Contact page** — heading, intro, direct email line.
4. **Sponsorship page** — heading, intro, three pillars, form copy.
5. **Specials page** — the page's own heading + intro + CTA at the bottom (separate from the Specials list itself).
6. **Privacy Policy** — full editor for the policy text. Supports headings, lists, links, bold.
7. **Site Settings** — footer tagline, contact inbox address, podcast platform links (Spotify / YouTube / Apple), social media links (Instagram / TikTok).

Changes you save appear on the live site within ~2 minutes (Netlify rebuilds automatically on every save).

## What is NOT editable via /studio (needs a developer)

- Brand colours and palette
- Custom font
- Page layout / structure
- Header navigation bar items
- Forms (Contact, Subscribe, Sponsorship enquiry)
- Anything in the codebase

For those, contact a developer.

---

## Setup required (Colin: do this once)

### 1. Add Sanity env vars in Netlify

In Netlify → **gempursuit project** → **Site configuration → Environment variables → Add a variable**:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `tfw6v3tl` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |

Then **Deploys → Trigger deploy → Deploy site**.

### 2. Seed Sanity with the existing content

The migration is a one-time job that copies the old markdown content into Sanity. You need a write-access token for this.

1. Go to **[sanity.io/manage/personal/tokens](https://www.sanity.io/manage/personal/tokens)**
2. Click **Add API token**, name it `migration`, scope **Editor** (read + write), assign to the **Gem Pursuit** project
3. Copy the token (starts with `sk...`). It's only shown once
4. In your local terminal, from `~/Desktop/gempursuit-website`:
   ```bash
   SANITY_AUTH_TOKEN=skXXX...XXX node scripts/migrate-to-sanity.mjs
   ```
5. The script logs each special, page and settings doc it creates
6. After it finishes, **revoke the token** at sanity.io/manage/personal/tokens (you don't need it again)

### 3. Invite the team to Sanity

1. Go to **[sanity.io/manage](https://www.sanity.io/manage)** → **Gem Pursuit** project → **Members**
2. Click **Invite members**
3. Enter each email and set role to **Editor**:
   - `info@gempursuit.com`
   - `Office@courtville.ie`
   - `colin.weldon@courtville.ie`
4. Each user gets an email, accepts the invite, sets up a Sanity account, and can log in at gempursuit.com/studio

### 4. Test it

1. Sign in at `gempursuit.com/studio`
2. The interface shows three sections: **Specials**, page items, **Site settings**
3. Open the **Privacy Policy** entry, change the "Last updated" date, click **Publish**
4. Wait ~2 minutes
5. Refresh `gempursuit.com/privacy` — new date should be live

If that works end-to-end, the handover is functional.

---

## User guide for the Office user

### Logging in

Go to **https://gempursuit.com/studio**. Sign in with your email and password (set during the Sanity invite acceptance).

### Editing a featured episode (Specials)

1. Left sidebar → **Specials (Featured Episodes)**
2. To **edit** an existing entry: click on the episode in the list
3. To **add a new one**: click the **+ New Special** button (top right)
4. Fill in the form:
   - **Where the episode lives**: Spotify or Apple Podcasts
   - **Episode title**: as it appears on the show
   - **Published date**: when the episode dropped
   - **Apple Show ID**: already pre-filled with `1514094392`. Leave it alone unless the show moves platforms
   - **Episode ID**: from the URL. For Spotify: the bit after `/episode/`. For Apple: the bit after `?i=`
   - **Guest name / role / blurb**: all optional, used for the on-page eyebrow and description
5. Click **Publish** (top right). The page rebuilds and shows the new entry within ~2 minutes

### Editing a page (About / Contact / Sponsorship / Specials / Privacy)

1. Left sidebar → click the page name
2. Edit any field — Sanity shows you the field labels with helper hints
3. Click **Publish**
4. Wait 2 minutes, then refresh the live page

### Editing the Privacy Policy body

Sanity's editor for the Privacy text supports proper formatting:
- Use the **H2** option in the toolbar for section headings
- Bullet list option for lists
- Bold / italic for emphasis
- Add links via the link button in the toolbar

### Editing site-wide settings (footer, contact email, podcast/social links)

1. Left sidebar → **Site settings**
2. Update any field
3. Click **Publish**

### What to avoid

- Don't delete the Privacy Policy entry (legal requirement)
- Don't change technical IDs unless a developer says so (Apple Show ID, episode IDs already in use)
- Don't share your login

### If something breaks

Email Colin or a developer with:
- What you were editing
- What button you clicked
- Any error message that appeared
- A screenshot if possible

Every edit is saved in Sanity's version history. Nothing is permanently lost.

---

## How it works (for the curious)

When you click **Publish** in /studio:

1. Sanity saves the change in its hosted database
2. The next time the site rebuilds (every 10 minutes max, or instantly on the next deploy), the page fetches the latest content via the Sanity API
3. The change goes live without anyone touching code

For really immediate updates, a developer can wire up a Sanity webhook to trigger a Netlify rebuild on every publish.

---

## Useful URLs

| What | Where |
|---|---|
| Live website | https://gempursuit.com |
| **Admin / Studio** | https://gempursuit.com/studio |
| Sanity project dashboard (Colin / admin only) | https://www.sanity.io/manage/personal/project/tfw6v3tl |
| Netlify dashboard (developers only) | https://app.netlify.com/projects/gempursuit |
| GitHub repo (developers only) | https://github.com/Courtville-office/gempursuit-website |
| Supabase dashboard (form submissions DB) | https://supabase.com/dashboard |
| Resend dashboard (email logs) | https://resend.com |
