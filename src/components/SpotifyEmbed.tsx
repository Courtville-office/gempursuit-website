import { SPOTIFY_SHOW_ID } from "@/lib/links";

export function SpotifyShowEmbed() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gold/30 shadow-2xl shadow-black/50" style={{ height: 352 }}>
      <iframe
        data-testid="embed-iframe"
        src={`https://open.spotify.com/embed/show/${SPOTIFY_SHOW_ID}?utm_source=generator&theme=0`}
        width="100%"
        height={352}
        frameBorder={0}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Gem Pursuit on Spotify"
        className="block w-full"
      />
    </div>
  );
}

export function SpotifyEpisodeEmbed({
  episodeId,
  height = 232,
}: {
  episodeId: string;
  height?: number;
}) {
  return (
    <iframe
      src={`https://open.spotify.com/embed/episode/${episodeId}?utm_source=generator&theme=0`}
      width="100%"
      height={height}
      frameBorder={0}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      title="Spotify episode player"
      className="rounded-2xl border border-gold/30 shadow-md shadow-gold-deep/15"
    />
  );
}

export function ApplePodcastEpisodeEmbed({
  showId,
  episodeId,
}: {
  showId: string;
  episodeId: string;
}) {
  return (
    <iframe
      allow="autoplay *; encrypted-media *; clipboard-write"
      frameBorder={0}
      height={175}
      sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
      src={`https://embed.podcasts.apple.com/ie/podcast/id${showId}?i=${episodeId}&theme=auto`}
      loading="lazy"
      title="Apple Podcasts episode player"
      className="w-full rounded-2xl border border-gold/30 shadow-md shadow-gold-deep/15"
      style={{ overflow: "hidden" }}
    />
  );
}
