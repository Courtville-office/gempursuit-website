import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Per-episode auto-email broadcast — DISABLED.
 *
 * The newsletter is now composed manually in Mailchimp (the existing
 * courtville.ie list, audience id f463b7b0ac). Subscribers from
 * gempursuit.com are pushed into that audience via /api/subscribe.
 *
 * To re-enable:
 *   1. Restore the previous implementation from git history
 *   2. Recreate netlify/functions/check-episodes.mts
 *   3. Add the schedule block back to netlify.toml
 */
function disabled() {
  return NextResponse.json({
    ok: true,
    action: "disabled",
    note: "Per-episode auto-emails are off. Newsletter is sent manually via Mailchimp.",
  });
}

export const GET = disabled;
export const POST = disabled;
