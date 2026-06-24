import type { Metadata } from "next";
import Link from "next/link";
import {
  SpotifyEpisodeEmbed,
  ApplePodcastEpisodeEmbed,
} from "@/components/SpotifyEmbed";
import { sortedSpecials, type Special } from "@/lib/specials";
import { fetchSpecialsPage } from "@/sanity/queries";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Specials",
  description:
    "Stand-out episodes from Gem Pursuit, the antique jewellery podcast from Courtville Antiques. Spotlights on legendary designers, special guests and one-off events.",
};

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function SpecialPlayer({ special }: { special: Special }) {
  if (special.source === "spotify") {
    return <SpotifyEpisodeEmbed episodeId={special.episodeId} />;
  }
  return (
    <ApplePodcastEpisodeEmbed
      showId={special.showId}
      episodeId={special.episodeId}
    />
  );
}

export default async function SpecialsPage() {
  const [specials, data] = await Promise.all([
    sortedSpecials(),
    fetchSpecialsPage(),
  ]);

  const eyebrow = data?.eyebrow ?? "Spotlight episodes";
  const heading = data?.heading ?? "Specials";
  const intro =
    data?.intro ??
    "A hand-picked selection of deep dives and stand-out conversations from the show.";
  const ctaText =
    data?.ctaText ?? "Got a guest you'd love to hear on the show?";
  const ctaLinkText = data?.ctaLinkText ?? "Get in touch";
  const ctaLinkHref = data?.ctaLinkHref ?? "/contact";

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-20">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">{heading}</h1>
        <p className="mt-4 max-w-2xl text-cream/80">{intro}</p>
      </header>

      <section className="mt-12 space-y-8">
        {specials.map((s) => {
          const key = `${s.source}-${s.episodeId}`;
          const showGuest = Boolean(s.guestName);
          return (
            <article
              key={key}
              className="card grid gap-6 md:grid-cols-[1fr_360px] md:items-center"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold">
                  {showGuest ? s.role ?? "Special guest" : "Featured episode"}
                  <span className="ml-3 text-cream/50 normal-case tracking-normal text-[11px]">
                    {formatDate(s.publishedAt)}
                  </span>
                </p>
                {showGuest && (
                  <h2 className="mt-2 font-display text-3xl text-cream">
                    {s.guestName}
                  </h2>
                )}
                <p
                  className={`${
                    showGuest ? "mt-3" : "mt-2"
                  } font-display text-xl text-violet leading-tight`}
                >
                  {s.episodeTitle}
                </p>
                {s.blurb && (
                  <p className="mt-4 text-cream/80 leading-relaxed">
                    {s.blurb}
                  </p>
                )}
                <p className="mt-4 text-[11px] uppercase tracking-widest text-cream/50">
                  Source · {s.source === "spotify" ? "Spotify" : "Apple Podcasts"}
                </p>
              </div>
              <div className="w-full md:w-[360px]">
                <SpecialPlayer special={s} />
              </div>
            </article>
          );
        })}
      </section>

      <p className="mt-16 text-sm text-cream/60">
        {ctaText}{" "}
        <Link href={ctaLinkHref} className="text-gold hover:underline">
          {ctaLinkText}
        </Link>
        .
      </p>
    </div>
  );
}
