/**
 * Mailchimp Marketing API helper.
 *
 * The API key encodes the server prefix as a suffix, e.g. `abc123-us3`.
 * We extract that to build the data-center URL.
 *
 * Env vars expected:
 *   MAILCHIMP_API_KEY      e.g. "abc123def456-us3"
 *   MAILCHIMP_AUDIENCE_ID  e.g. "f463b7b0ac"
 */

export function isMailchimpConfigured(): boolean {
  return Boolean(process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_AUDIENCE_ID);
}

function serverPrefix(key: string): string {
  const idx = key.lastIndexOf("-");
  if (idx === -1) throw new Error("Mailchimp API key missing server prefix (expected key like xxx-us10)");
  return key.slice(idx + 1);
}

function md5Lower(input: string): string {
  // Lazy import — keeps this file edge-safe if ever imported in a non-node context
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require("crypto") as typeof import("crypto");
  return crypto.createHash("md5").update(input.toLowerCase()).digest("hex");
}

type UpsertArgs = {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
  /** Mailchimp source label, stored as a merge field */
  source?: string;
};

/**
 * Add or update a subscriber in the configured Mailchimp audience.
 *
 * Uses PUT /lists/{list_id}/members/{subscriber_hash} which upserts:
 *  - new email → creates as subscribed
 *  - existing email → updates merge fields / tags / status
 *
 * Throws on HTTP errors. Caller should catch and decide whether to fail the
 * whole request or just log.
 */
export async function upsertMailchimpMember(args: UpsertArgs): Promise<void> {
  const key = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  if (!key || !audienceId) {
    throw new Error("Mailchimp env vars not set");
  }

  const dc = serverPrefix(key);
  const hash = md5Lower(args.email);
  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members/${hash}`;

  const mergeFields: Record<string, string> = {};
  if (args.firstName) mergeFields.FNAME = args.firstName;
  if (args.lastName) mergeFields.LNAME = args.lastName;
  if (args.source) mergeFields.SOURCE = args.source;

  const body = {
    email_address: args.email,
    status_if_new: "subscribed" as const,
    merge_fields: mergeFields,
  };

  const auth = Buffer.from(`anystring:${key}`).toString("base64");
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Mailchimp upsert failed (${res.status}): ${text.slice(0, 300)}`);
  }

  // Tags are added separately via the tags endpoint (Mailchimp's API design).
  if (args.tags && args.tags.length > 0) {
    const tagsUrl = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members/${hash}/tags`;
    const tagsRes = await fetch(tagsUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tags: args.tags.map((name) => ({ name, status: "active" })),
      }),
    });
    if (!tagsRes.ok) {
      const text = await tagsRes.text().catch(() => "");
      throw new Error(`Mailchimp tags failed (${tagsRes.status}): ${text.slice(0, 300)}`);
    }
  }
}
