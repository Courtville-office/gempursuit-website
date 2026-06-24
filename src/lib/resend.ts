import { Resend } from "resend";

let cachedClient: Resend | null = null;

export function resendClient(): Resend {
  if (cachedClient) return cachedClient;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Missing RESEND_API_KEY env var");
  cachedClient = new Resend(key);
  return cachedClient;
}

export const FROM_ADDRESS =
  process.env.RESEND_FROM_ADDRESS ?? "Gem Pursuit <info@gempursuit.com>";

export const CONTACT_INBOX =
  process.env.CONTACT_INBOX ?? "info@gempursuit.com";

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}
