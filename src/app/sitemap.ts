import type { MetadataRoute } from "next";
import { fetchYouTubeEpisodes } from "@/lib/youtube";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://gempursuit.com";
  const staticRoutes = ["", "/episodes", "/about", "/specials", "/sponsorship", "/subscribe", "/contact", "/privacy"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })
  );

  let episodeRoutes: MetadataRoute.Sitemap = [];
  try {
    const episodes = await fetchYouTubeEpisodes();
    episodeRoutes = episodes.map((e) => ({
      url: `${base}/episodes/${e.videoId}`,
      lastModified: new Date(e.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    episodeRoutes = [];
  }

  return [...staticRoutes, ...episodeRoutes];
}
