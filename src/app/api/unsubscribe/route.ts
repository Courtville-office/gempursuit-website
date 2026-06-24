import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

const TOKEN_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function unsubscribe(token: string) {
  if (!TOKEN_RE.test(token)) {
    return { ok: false, status: 400, message: "Invalid unsubscribe token" };
  }
  if (!isSupabaseConfigured()) {
    return { ok: false, status: 500, message: "Database not configured" };
  }

  const { data, error } = await supabaseAdmin()
    .from("subscribers")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token)
    .select("email")
    .maybeSingle();

  if (error) {
    console.error("Unsubscribe failed", error);
    return { ok: false, status: 500, message: "Could not unsubscribe" };
  }
  if (!data) {
    return { ok: false, status: 404, message: "Subscription not found" };
  }
  return { ok: true, status: 200, message: "Unsubscribed" };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  const result = await unsubscribe(token);
  if (req.headers.get("accept")?.includes("application/json")) {
    return NextResponse.json(
      { ok: result.ok, message: result.message },
      { status: result.status }
    );
  }
  const redirectUrl = new URL("/unsubscribe", url);
  redirectUrl.searchParams.set("status", result.ok ? "ok" : "error");
  if (!result.ok) redirectUrl.searchParams.set("message", result.message);
  return NextResponse.redirect(redirectUrl, { status: 303 });
}

export async function POST(req: Request) {
  let token = "";
  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      const body = await req.json();
      token = (body?.token ?? "").toString();
    } catch {
      token = "";
    }
  } else {
    const url = new URL(req.url);
    token = url.searchParams.get("token") ?? "";
    if (!token) {
      const formData = await req.formData().catch(() => null);
      token = (formData?.get("token") ?? "").toString();
    }
  }
  const result = await unsubscribe(token);
  return NextResponse.json(
    { ok: result.ok, message: result.message },
    { status: result.status }
  );
}
