import { fetchYouTubeEpisodes } from "@/lib/youtube";
import { EpisodeCard } from "@/components/EpisodeCard";
import type { Metadata } from "next";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Episodes",
  description:
    "Every episode of Gem Pursuit, the antique jewellery podcast from Courtville Antiques.",
};

export default async function EpisodesPage() {
  let episodes: Awaited<ReturnType<typeof fetchYouTubeEpisodes>> = [];
  try {
    episodes = await fetchYouTubeEpisodes();
  } catch {
    episodes = [];
  }

  const fullEpisodes = episodes.filter((e) => !e.isShort);
  const shorts = episodes.filter((e) => e.isShort);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <header className="mb-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          The archive
        </p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Episodes</h1>
        <p className="mx-auto mt-4 max-w-2xl text-cream/80">
          Every conversation, story and gem-fuelled obsession from the show.
          Latest at the top.
        </p>
      </header>

      {fullEpisodes.length > 0 ? (
        <section>
          <h2 className="mb-6 font-display text-2xl text-gold">Full episodes</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fullEpisodes.map((ep) => (
              <EpisodeCard key={ep.videoId} episode={ep} />
            ))}
          </div>
        </section>
      ) : (
        <p className="text-center text-cream/70">
          Episodes will appear here as soon as the YouTube feed connects. Try
          refreshing in a minute.
        </p>
      )}

      {shorts.length > 0 && (
        <section id="shorts" className="mt-16 scroll-mt-24">
          <h2 className="mb-6 font-display text-2xl text-gold">Shorts</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {shorts.map((ep) => (
              <EpisodeCard key={ep.videoId} episode={ep} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
