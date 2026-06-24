import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { resendClient, FROM_ADDRESS, isResendConfigured } from "@/lib/resend";
import { upsertMailchimpMember, isMailchimpConfigured } from "@/lib/mailchimp";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SITE_URL = process.env.SITE_URL ?? "https://gempursuit.com";

export async function POST(req: Request) {
  let body: { email?: string; name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const name = (body.name ?? "").trim();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      ok: true,
      stored: false,
      message:
        "Saved. Email storage isn't configured yet but we have your details.",
    });
  }

  const sb = supabaseAdmin();
  let isNewOrResubscribed = false;
  let unsubscribeToken: string | null = null;

  try {
    const { data: existing } = await sb
      .from("subscribers")
      .select("email, unsubscribed_at, unsubscribe_token")
      .eq("email", email)
      .maybeSingle();

    isNewOrResubscribed = !existing || existing.unsubscribed_at !== null;

    const { data: upserted, error } = await sb
      .from("subscribers")
      .upsert(
        {
          email,
          name: name || null,
          source: "website",
          unsubscribed_at: null,
        },
        { onConflict: "email" }
      )
      .select("unsubscribe_token")
      .single();
    if (error) throw error;
    unsubscribeToken = upserted?.unsubscribe_token ?? existing?.unsubscribe_token ?? null;
  } catch (err) {
    console.error("Failed to upsert subscriber", err);
    return NextResponse.json(
      { error: "Could not save your details. Please try again." },
      { status: 500 }
    );
  }

  // Push to Mailchimp (the live newsletter list). Non-fatal on failure —
  // the Supabase record is our backup.
  if (isMailchimpConfigured()) {
    try {
      const [firstName, ...rest] = name ? name.split(/\s+/) : [];
      await upsertMailchimpMember({
        email,
        firstName: firstName || undefined,
        lastName: rest.length > 0 ? rest.join(" ") : undefined,
        source: "gempursuit",
        tags: ["gempursuit"],
      });
    } catch (err) {
      console.error("Failed to sync subscriber to Mailchimp", err);
    }
  }

  // Welcome email — only for genuinely new signups or resubscribes.
  if (isNewOrResubscribed && isResendConfigured()) {
    try {
      const resend = resendClient();
      const unsubUrl = unsubscribeToken
        ? `${SITE_URL}/unsubscribe?token=${unsubscribeToken}`
        : `${SITE_URL}/unsubscribe`;
      const headers: Record<string, string> = unsubscribeToken
        ? {
            "List-Unsubscribe": `<${SITE_URL}/api/unsubscribe?token=${unsubscribeToken}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          }
        : {};
      await resend.emails.send({
        from: FROM_ADDRESS,
        to: email,
        subject: "Welcome to the Pursuit",
        html: renderWelcomeHtml(name, unsubUrl),
        text: renderWelcomeText(unsubUrl),
        headers,
      });
    } catch (err) {
      console.error("Failed to send welcome email", err);
    }
  }

  return NextResponse.json({
    ok: true,
    stored: true,
    message: "You're on the list. Welcome to the Pursuit.",
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderWelcomeHtml(name: string, unsubUrl: string): string {
  const greeting = name ? `Hi ${escapeHtml(name.split(" ")[0])},` : "Hello,";
  return `<!doctype html>
<html lang="en">
<body style="margin:0;background:#FAF1D0;color:#1F2147;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;">
  <div style="background:#FAF1D0;padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#FFFCE7;border:1px solid rgba(45,46,140,0.18);border-radius:16px;">
      <tr><td style="padding:32px;">
        <p style="text-transform:uppercase;letter-spacing:0.3em;color:#2D2E8C;font-size:11px;margin:0 0 12px;">Welcome</p>
        <h1 style="font-family:Georgia,serif;font-size:26px;line-height:1.2;color:#2D2E8C;margin:0 0 16px;">Welcome to the Pursuit</h1>
        <p style="margin:0 0 16px;color:#1F2147;">${greeting}</p>
        <p style="margin:0 0 20px;line-height:1.6;color:#1F2147;">Thanks for joining. You'll hear from us in our newsletter, with podcast updates and the occasional highlight from the Courtville workshop.</p>
        <p style="margin:0 0 8px;">
          <a href="${SITE_URL}/episodes" style="display:inline-block;background:#2D2E8C;color:#FFFFFF;padding:12px 24px;border-radius:999px;font-weight:600;text-decoration:none;">Browse past episodes</a>
        </p>
        <p style="font-size:12px;color:rgba(31,33,71,0.6);margin:32px 0 0;line-height:1.6;">
          You're receiving this because you signed up at gempursuit.com.
          <br /><a href="${unsubUrl}" style="color:#2D2E8C;">Unsubscribe</a> · Produced by Courtville Antiques, Dublin.
        </p>
      </td></tr>
    </table>
  </div>
</body>
</html>`;
}

function renderWelcomeText(unsubUrl: string): string {
  return [
    "Welcome to the Pursuit",
    "",
    "Thanks for joining. You'll hear from us in our newsletter, with podcast updates and the occasional highlight from the Courtville workshop.",
    "",
    "Browse past episodes: " + SITE_URL + "/episodes",
    "",
    "Unsubscribe: " + unsubUrl,
    "Gem Pursuit, produced by Courtville Antiques, Dublin.",
  ].join("\n");
}
