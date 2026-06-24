import { NextResponse } from "next/server";
import { resendClient, FROM_ADDRESS, CONTACT_INBOX, isResendConfigured } from "@/lib/resend";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { name?: string; email?: string; subject?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const subject = (body.subject ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email and message are required" },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (message.length > 5000) {
    return NextResponse.json(
      { error: "Message is too long" },
      { status: 400 }
    );
  }

  if (isSupabaseConfigured()) {
    try {
      await supabaseAdmin().from("contact_submissions").insert({
        name,
        email,
        subject: subject || null,
        message,
      });
    } catch (err) {
      console.error("Failed to store contact submission", err);
    }
  }

  if (!isResendConfigured()) {
    return NextResponse.json({
      ok: true,
      stored: isSupabaseConfigured(),
      emailed: false,
      message:
        "Saved. Email delivery isn't configured yet but we have your message.",
    });
  }

  try {
    const resend = resendClient();
    const cleanSubject = subject || "Gem Pursuit message";
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: CONTACT_INBOX,
      replyTo: email,
      subject: `[Gem Pursuit] ${cleanSubject}`,
      text: `From: ${name} <${email}>\nSubject: ${cleanSubject}\n\n${message}`,
    });
  } catch (err) {
    console.error("Failed to send contact email", err);
    return NextResponse.json(
      { error: "Could not send your message. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
