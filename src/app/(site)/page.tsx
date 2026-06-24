import Link from "next/link";
import { fetchYouTubeEpisodes } from "@/lib/youtube";
import { EpisodeCard } from "@/components/EpisodeCard";
import { SubscribeForm } from "@/components/SubscribeForm";
import { PodcastCoEmbed } from "@/components/PodcastCoEmbed";
import { InstagramFeed } from "@/components/SocialFeed";
import { PODCAST_LINKS } from "@/lib/links";

export const revalidate = 600;

export default async function HomePage() {
  let episodes: Awaited<ReturnType<typeof fetchYouTubeEpisodes>> = [];
  try {
    episodes = await fetchYouTubeEpisodes();
  } catch {
    episodes = [];
  }

  const fullEpisodes = episodes.filter((e) => !e.isShort);
  const shorts = episodes.filter((e) => e.isShort);
  const latest = fullEpisodes[0] ?? episodes[0];
  const recent = fullEpisodes.slice(1, 4);
  const recentShorts = shorts.slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-8 md:grid-cols-[2fr_3fr] md:gap-12 md:px-6 md:py-12">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold md:text-xs">
              An antique jewellery podcast
            </p>
            <p className="mt-5 max-w-lg text-base text-cream/85 leading-relaxed md:mt-6 md:text-lg">
              Stories, history and obsessions from the world of antique and
              vintage jewellery. Hosted by Matthew Weldon, brought to you by{" "}
              <a
                href="https://www.courtville.ie/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline"
              >
                Courtville Antiques
              </a>{" "}
              in Dublin.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/episodes" className="btn-primary">
                Browse episodes
              </Link>
              <Link href="/subscribe" className="btn-outline">
                Subscribe
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-cream/60">
              <span className="uppercase tracking-widest">Listen on</span>
              {PODCAST_LINKS.map((p) => (
                <a
                  key={p.href}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/90 hover:text-gold"
                >
                  {p.label}
                </a>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gold/10 blur-2xl pointer-events-none" aria-hidden />
            <PodcastCoEmbed />
          </div>
        </div>
      </section>

      <div className="deco-divider mx-auto max-w-6xl" />

      {latest && (
        <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <div className="mb-6 flex items-end justify-between gap-6 md:mb-8">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold md:text-xs">
                Latest episode
              </p>
              <h2 className="mt-2 font-display font-semibold text-2xl leading-tight md:text-4xl">
                {latest.title}
              </h2>
            </div>
            <Link
              href={`/episodes/${latest.videoId}`}
              className="hidden shrink-0 text-sm text-gold hover:underline md:block"
            >
              Listen now →
            </Link>
          </div>
          <EpisodeCard episode={latest} featured />
        </section>
      )}

      {recent.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display font-semibold text-3xl md:text-4xl">More episodes</h2>
            <Link
              href="/episodes"
              className="text-sm text-gold hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((ep) => (
              <EpisodeCard key={ep.videoId} episode={ep} />
            ))}
          </div>
        </section>
      )}

      {recentShorts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">
                Bite-sized
              </p>
              <h2 className="mt-2 font-display font-semibold text-3xl md:text-4xl">
                Shorts
              </h2>
            </div>
            <Link
              href="/episodes#shorts"
              className="text-sm text-gold hover:underline"
            >
              All shorts →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {recentShorts.map((ep) => (
              <EpisodeCard key={ep.videoId} episode={ep} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            On the socials
          </p>
          <h2 className="mt-2 font-display font-semibold text-3xl md:text-4xl">
            Latest from the feed
          </h2>
        </div>
        <InstagramFeed
          handle="@gempursuitpod"
          href="https://www.instagram.com/gempursuitpod/"
          feedId={process.env.NEXT_PUBLIC_BEHOLD_INSTAGRAM_FEED_ID}
        />
      </section>

      <section className="mx-auto mt-16 max-w-3xl px-4 pb-16 md:px-6">
        <div className="card text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            Never miss an episode
          </p>
          <h2 className="mt-3 font-display font-semibold text-3xl md:text-4xl">
            Join the Pursuit
          </h2>
          <p className="mt-4 text-cream/80">
            Pop your email below and we'll send a note when a new episode lands,
            plus the occasional bit of jewellery news from the Courtville
            workshop.
          </p>
          <div className="mt-6 text-left">
            <SubscribeForm />
          </div>
        </div>
      </section>
    </>
  );
}
