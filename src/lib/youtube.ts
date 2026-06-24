import { XMLParser } from "fast-xml-parser";
import { YOUTUBE_RSS_URL } from "./links";

export type YouTubeEpisode = {
  id: string;
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  thumbnail: string;
  thumbnailFallback: string;
  url: string;
  isShort: boolean;
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

type FeedEntry = {
  "yt:videoId": string;
  title: string;
  link: { "@_href": string } | { "@_href": string }[];
  published: string;
  updated: string;
  "media:group": {
    "media:title": string;
    "media:description"?: string;
    "media:thumbnail": { "@_url": string } | { "@_url": string }[];
  };
};

function firstHref(link: FeedEntry["link"]): string {
  return Array.isArray(link) ? link[0]["@_href"] : link["@_href"];
}

function firstThumb(thumb: FeedEntry["media:group"]["media:thumbnail"]): string {
  return Array.isArray(thumb) ? thumb[0]["@_url"] : thumb["@_url"];
}

export async function fetchYouTubeEpisodes(): Promise<YouTubeEpisode[]> {
  const res = await fetch(YOUTUBE_RSS_URL, {
    next: { revalidate: 600 },
    headers: { "user-agent": "GemPursuit/1.0 (+https://gempursuit.com)" },
  });

  if (!res.ok) {
    throw new Error(`YouTube RSS fetch failed: ${res.status}`);
  }

  const xml = await res.text();
  const data = parser.parse(xml);
  const entries: FeedEntry[] = data?.feed?.entry ?? [];
  if (!Array.isArray(entries)) return [];

  return entries.map((entry) => {
    const url = firstHref(entry.link);
    const isShort = url.includes("/shorts/");
    const videoId = entry["yt:videoId"];
    const thumbnail = isShort
      ? firstThumb(entry["media:group"]["media:thumbnail"])
      : `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    return {
      id: videoId,
      videoId,
      title: entry.title,
      description: entry["media:group"]["media:description"] ?? "",
      publishedAt: entry.published,
      updatedAt: entry.updated,
      thumbnail,
      thumbnailFallback: firstThumb(
        entry["media:group"]["media:thumbnail"]
      ),
      url,
      isShort,
    };
  });
}

export async function fetchEpisodeById(
  videoId: string
): Promise<YouTubeEpisode | null> {
  const all = await fetchYouTubeEpisodes();
  return all.find((e) => e.videoId === videoId) ?? null;
}

export function formatDescription(raw: string): string {
  return raw
    .replace(/💎 FOLLOW US ON SOCIALS[\s\S]*$/i, "")
    .replace(/#\w+/g, "")
    .trim();
}
