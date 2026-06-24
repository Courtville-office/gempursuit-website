export const SPOTIFY_SHOW_ID = "6z8DMDbFgTZVqzHb02zKjC";
export const SPOTIFY_SHOW_URL = `https://open.spotify.com/show/${SPOTIFY_SHOW_ID}`;

export const YOUTUBE_CHANNEL_ID = "UCU6ps7fcW3zuxMZ7AHm9AVw";
export const YOUTUBE_CHANNEL_URL = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`;
export const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;

export const PODCAST_LINKS: { href: string; label: string }[] = [
  { href: SPOTIFY_SHOW_URL, label: "Spotify" },
  { href: YOUTUBE_CHANNEL_URL, label: "YouTube" },
  {
    href: "https://podcasts.apple.com/podcast/gem-pursuit",
    label: "Apple Podcasts",
  },
];

export const SOCIAL_LINKS: { href: string; label: string }[] = [
  { href: "https://www.instagram.com/gempursuitpod/", label: "Instagram" },
  { href: "https://www.tiktok.com/@matthew.weldon?lang=en-GB", label: "TikTok" },
  { href: "https://www.courtville.ie", label: "Courtville Antiques" },
];
