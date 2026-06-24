import { notFound } from "next/navigation";
import Link from "next/link";
import {
  fetchEpisodeById,
  fetchYouTubeEpisodes,
  formatDescription,
} from "@/lib/youtube";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { SpotifyShowEmbed } from "@/components/SpotifyEmbed";
import type { Metadata } from "next";

export const revalidate = 600;

type Params = { params: { id: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  try {
    const episode = await fetchEpisodeById(params.id);
    if (!episode) return { title: "Episode not found" };
    return {
      title: episode.title,
      description: formatDescription(episode.description).slice(0, 160),
      openGraph: {
        title: episode.title,
        description: formatDescription(episode.description).slice(0, 160),
        images: [{ url: episode.thumbnail }],
      },
    };
  } catch {
    return { title: "Episode" };
  }
}

export default async function EpisodePage({ params }: Params) {
  let episode = null;
  let related: Awaited<ReturnType<typeof fetchYouTubeEpisodes>> = [];
  try {
    episode = await fetchEpisodeById(params.id);
    const all = await fetchYouTubeEpisodes();
    related = all
      .filter((e) => e.videoId !== params.id && !e.isShort)
      .slice(0, 3);
  } catch {
    notFound();
  }

  if (!episode) notFound();

  const date = new Date(episode.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <Link
        href="/episodes"
        className="text-sm text-gold hover:underline"
      >
        ← All episodes
      </Link>

      <header className="mt-6">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">{date}</p>
        <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
          {episode.title}
        </h1>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-gold/80">
            Watch on YouTube
          </p>
          <YouTubeEmbed videoId={episode.videoId} title={episode.title} />
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-gold/80">
            Listen on Spotify
          </p>
          <SpotifyShowEmbed />
        </div>
      </div>

      {episode.description && (
        <section className="mt-12 max-w-3xl">
          <h2 className="font-display text-2xl text-gold">About this episode</h2>
          <p className="mt-4 whitespace-pre-line text-cream/85 leading-relaxed">
            {formatDescription(episode.description)}
          </p>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl text-gold">More episodes</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((ep) => (
              <Link
                key={ep.videoId}
                href={`/episodes/${ep.videoId}`}
                className="group block rounded-2xl border border-gold/20 bg-maroon-deep/40 p-4 transition hover:border-gold/60"
              >
                <p className="text-xs uppercase tracking-widest text-gold/80">
                  {new Date(ep.publishedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="mt-2 font-display text-lg text-cream group-hover:text-gold">
                  {ep.title}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
