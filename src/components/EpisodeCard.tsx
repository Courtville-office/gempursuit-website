import Link from "next/link";
import Image from "next/image";
import type { YouTubeEpisode } from "@/lib/youtube";

export function EpisodeCard({
  episode,
  featured = false,
}: {
  episode: YouTubeEpisode;
  featured?: boolean;
}) {
  const date = new Date(episode.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Link
      href={`/episodes/${episode.videoId}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gold/15 bg-maroon-deep shadow-md shadow-gold-deep/10 transition hover:border-gold/50 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-video w-full bg-black">
        <Image
          src={episode.thumbnail}
          alt={episode.title}
          fill
          priority={featured}
          sizes={
            featured
              ? "(min-width: 1280px) 1152px, 100vw"
              : "(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          }
          className="object-cover"
        />
        {episode.isShort && (
          <span className="absolute right-3 top-3 rounded-full bg-ember px-3 py-0.5 text-xs font-semibold text-cream">
            Short
          </span>
        )}
      </div>
      <div className="flex-1 p-2 md:p-3">
        <p className="text-[11px] uppercase tracking-widest text-gold/80">
          {date}
        </p>
        <h3 className="mt-2 font-display font-semibold text-base md:text-xl leading-tight text-cream group-hover:text-gold line-clamp-3">
          {episode.title}
        </h3>
      </div>
    </Link>
  );
}
