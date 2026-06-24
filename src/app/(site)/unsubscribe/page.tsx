import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unsubscribed",
  description: "Manage your Gem Pursuit newsletter subscription.",
};

type SearchParams = { status?: string; message?: string; token?: string };

export default function UnsubscribePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const success = searchParams.status === "ok";
  const errored = searchParams.status === "error";

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 md:px-6">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">Newsletter</p>
      <h1 className="mt-3 font-display text-5xl md:text-6xl">
        {success ? "You're unsubscribed" : "Unsubscribe"}
      </h1>

      {success && (
        <div className="card mt-8">
          <p className="text-cream/85">
            You won't get any more new-episode emails from us. We're sorry to
            see you go. If you change your mind, you can always{" "}
            <Link href="/subscribe" className="text-gold hover:underline">
              re-subscribe
            </Link>{" "}
            on the subscribe page.
          </p>
        </div>
      )}

      {errored && (
        <div className="card mt-8">
          <p className="text-cream/85">
            We couldn't process that request.{" "}
            {searchParams.message ? `Reason: ${searchParams.message}.` : ""}{" "}
            If the link in your email isn't working, drop us a line at{" "}
            <a
              href="mailto:info@gempursuit.com"
              className="text-gold hover:underline"
            >
              info@gempursuit.com
            </a>{" "}
            and we'll remove you manually.
          </p>
        </div>
      )}

      {!success && !errored && (
        <div className="card mt-8">
          <p className="text-cream/85">
            To unsubscribe, click the unsubscribe link at the bottom of any
            email you've had from us. If that's not working, email{" "}
            <a
              href="mailto:info@gempursuit.com"
              className="text-gold hover:underline"
            >
              info@gempursuit.com
            </a>
            .
          </p>
        </div>
      )}

      <p className="mt-10 text-sm text-cream/60">
        <Link href="/" className="text-gold hover:underline">
          ← Back to Gem Pursuit
        </Link>
      </p>
    </div>
  );
}
