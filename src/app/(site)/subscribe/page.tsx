import type { Metadata } from "next";
import { SubscribeForm } from "@/components/SubscribeForm";
import { PODCAST_LINKS, SOCIAL_LINKS } from "@/lib/links";

export const metadata: Metadata = {
  title: "Subscribe",
  description:
    "Subscribe to Gem Pursuit on Spotify, YouTube, Apple Podcasts or by email.",
};

export default function SubscribePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-20">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Subscribe</p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">
          Don't miss a thing
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-cream/80">
          Pick your favourite app, or pop your email below for new episode
          notifications and the odd bit of jewellery news from Courtville.
        </p>
      </header>

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        {PODCAST_LINKS.map((p) => (
          <a
            key={p.href}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="card group flex items-center justify-between hover:border-gold/60"
          >
            <span className="font-display text-2xl text-cream group-hover:text-gold">
              {p.label}
            </span>
            <span className="text-gold">→</span>
          </a>
        ))}
      </section>

      <section className="mt-16">
        <div className="card mx-auto max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">By email</p>
          <h2 className="mt-2 font-display text-3xl">Newsletter</h2>
          <p className="mt-3 text-cream/80">
            One short email per new episode. We'll occasionally throw in a
            highlight from the Courtville workshop. No spam.
          </p>
          <div className="mt-6">
            <SubscribeForm />
          </div>
        </div>
      </section>

      <section className="mt-16 text-center">
        <p className="text-xs uppercase tracking-widest text-gold/80">
          Or follow us socially
        </p>
        <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {SOCIAL_LINKS.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/90 hover:text-gold"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
