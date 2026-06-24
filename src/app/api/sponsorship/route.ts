import { NextResponse } from "next/server";
import {
  resendClient,
  FROM_ADDRESS,
  CONTACT_INBOX,
  isResendConfigured,
} from "@/lib/resend";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: {
    name?: string;
    company?: string;
    email?: string;
    phone?: string;
    partnership?: string;
    budget?: string;
    message?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const company = (body.company ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const phone = (body.phone ?? "").trim();
  const partnership = (body.partnership ?? "").trim();
  const budget = (body.budget ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || !company || !email || !message) {
    return NextResponse.json(
      { error: "Name, company, email and message are required" },
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
      await supabaseAdmin().from("sponsorship_enquiries").insert({
        name,
        company,
        email,
        phone: phone || null,
        partnership_type: partnership || null,
        budget: budget || null,
        message,
      });
    } catch (err) {
      console.error("Failed to store sponsorship enquiry", err);
    }
  }

  if (!isResendConfigured()) {
    return NextResponse.json({
      ok: true,
      stored: isSupabaseConfigured(),
      emailed: false,
      message:
        "Saved. Email delivery isn't configured yet but we have your enquiry.",
    });
  }

  try {
    const resend = resendClient();
    const subjectLine = partnership
      ? `[Gem Pursuit Sponsorship] ${company} — ${partnership}`
      : `[Gem Pursuit Sponsorship] ${company}`;
    const text = [
      `From: ${name} <${email}>`,
      `Company: ${company}`,
      phone ? `Phone: ${phone}` : null,
      partnership ? `Partnership: ${partnership}` : null,
      budget ? `Budget: ${budget}` : null,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    await resend.emails.send({
      from: FROM_ADDRESS,
      to: CONTACT_INBOX,
      replyTo: email,
      subject: subjectLine,
      text,
    });
  } catch (err) {
    console.error("Failed to send sponsorship email", err);
    return NextResponse.json(
      { error: "Could not send your enquiry. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
