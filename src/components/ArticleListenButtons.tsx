import { SPOTIFY_SHOW_URL, YOUTUBE_CHANNEL_URL } from "@/lib/links";

export function ArticleListenButtons({ episodeUrl }: { episodeUrl?: string }) {
  let spotify = SPOTIFY_SHOW_URL;
  let youtube = YOUTUBE_CHANNEL_URL;
  try {
    const url = new URL(episodeUrl || "");
    if (url.hostname === "open.spotify.com" && url.pathname.startsWith("/episode/")) spotify = url.href;
    if (["youtube.com", "www.youtube.com", "youtu.be"].includes(url.hostname)) youtube = url.href;
    if (["gempursuit.com", "www.gempursuit.com"].includes(url.hostname)) {
      const id = url.pathname.match(/^\/episodes\/([A-Za-z0-9_-]{11})\/?$/)?.[1];
      if (id) youtube = `https://www.youtube.com/watch?v=${id}`;
      if (id === "FE7gY74Gd-g") spotify = "https://open.spotify.com/episode/2tLMeQE0S0qt2UgJOoedQD";
    }
  } catch { /* Without an episode URL, link to the verified show destinations. */ }
  return (
    <nav aria-label="Listen to Gem Pursuit" className="my-8 flex flex-col gap-3 border-y border-gold/20 py-6 sm:flex-row">
      <a href={spotify} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block px-5 py-2 text-center text-sm">Listen on Spotify</a>
      <a href={youtube} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block px-5 py-2 text-center text-sm">Watch on YouTube</a>
    </nav>
  );
}
