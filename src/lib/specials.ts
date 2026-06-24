// Specials — featured episodes shown on the Specials page. The data
// lives in Sanity (edited via /studio). This thin wrapper shapes the
// raw Sanity documents into the form the page components expect.

import { fetchSpecials, type SpecialDoc } from "@/sanity/queries";

export type SpotifySpecial = {
  source: "spotify";
  episodeId: string;
  episodeTitle: string;
  publishedAt: string;
  guestName?: string;
  role?: string;
  blurb?: string;
};

export type AppleSpecial = {
  source: "apple";
  showId: string;
  episodeId: string;
  episodeTitle: string;
  publishedAt: string;
  guestName?: string;
  role?: string;
  blurb?: string;
};

export type Special = SpotifySpecial | AppleSpecial;

function toSpecial(doc: SpecialDoc): Special | null {
  if (!doc.episodeId || !doc.episodeTitle) return null;
  if (doc.source === "apple") {
    if (!doc.appleShowId) return null;
    return {
      source: "apple",
      showId: doc.appleShowId,
      episodeId: doc.episodeId,
      episodeTitle: doc.episodeTitle,
      publishedAt: doc.publishedAt,
      guestName: doc.guestName,
      role: doc.role,
      blurb: doc.blurb,
    };
  }
  return {
    source: "spotify",
    episodeId: doc.episodeId,
    episodeTitle: doc.episodeTitle,
    publishedAt: doc.publishedAt,
    guestName: doc.guestName,
    role: doc.role,
    blurb: doc.blurb,
  };
}

export async function sortedSpecials(): Promise<Special[]> {
  const docs = await fetchSpecials();
  return docs.map(toSpecial).filter((s): s is Special => s !== null);
}
