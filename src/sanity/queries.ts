import { sanityClient } from "./client";

const SPECIALS_QUERY = /* groq */ `
  *[_type == "special"] | order(publishedAt desc, order asc) {
    _id,
    source,
    appleShowId,
    episodeId,
    episodeTitle,
    publishedAt,
    guestName,
    role,
    blurb,
    order
  }
`;

const ABOUT_QUERY = /* groq */ `*[_type == "aboutPage"][0]`;
const CONTACT_QUERY = /* groq */ `*[_type == "contactPage"][0]`;
const SPONSORSHIP_QUERY = /* groq */ `*[_type == "sponsorshipPage"][0]`;
const SPECIALS_PAGE_QUERY = /* groq */ `*[_type == "specialsPage"][0]`;
const PRIVACY_QUERY = /* groq */ `*[_type == "privacyPage"][0]`;
const SITE_SETTINGS_QUERY = /* groq */ `*[_type == "siteSettings"][0]`;

type CacheOpts = { revalidate?: number; tags?: string[] };

const DEFAULT_CACHE: CacheOpts = { revalidate: 600 };

async function fetchOnce<T>(
  query: string,
  cache: CacheOpts = DEFAULT_CACHE
): Promise<T | null> {
  try {
    return await sanityClient.fetch<T>(query, {}, { next: cache });
  } catch (err) {
    console.error("Sanity fetch failed", err);
    return null;
  }
}

// ---------- Specials ----------

export type SpecialDoc = {
  _id: string;
  source: "spotify" | "apple";
  appleShowId?: string;
  episodeId: string;
  episodeTitle: string;
  publishedAt: string;
  guestName?: string;
  role?: string;
  blurb?: string;
  order?: number;
};

export async function fetchSpecials(): Promise<SpecialDoc[]> {
  const data = await fetchOnce<SpecialDoc[]>(SPECIALS_QUERY);
  return data ?? [];
}

// ---------- Pages ----------

export type AboutDoc = {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  producedByIntro?: string;
  producedByLinkText?: string;
  producedByLinkUrl?: string;
  producedByOutro?: string;
  secondaryHeading?: string;
  secondaryBody?: string;
  tertiaryHeading?: string;
  tertiaryBody?: string;
};
export const fetchAbout = () => fetchOnce<AboutDoc>(ABOUT_QUERY);

export type ContactDoc = {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  directEmailIntro?: string;
};
export const fetchContact = () => fetchOnce<ContactDoc>(CONTACT_QUERY);

export type SponsorshipDoc = {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  pillarOneTitle?: string;
  pillarOneBody?: string;
  pillarTwoTitle?: string;
  pillarTwoBody?: string;
  pillarThreeTitle?: string;
  pillarThreeBody?: string;
  formEyebrow?: string;
  formHeading?: string;
  formIntro?: string;
  directEmailIntro?: string;
};
export const fetchSponsorship = () =>
  fetchOnce<SponsorshipDoc>(SPONSORSHIP_QUERY);

export type SpecialsPageDoc = {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  ctaText?: string;
  ctaLinkText?: string;
  ctaLinkHref?: string;
};
export const fetchSpecialsPage = () =>
  fetchOnce<SpecialsPageDoc>(SPECIALS_PAGE_QUERY);

export type PortableTextBlock = {
  _type: "block" | "image";
  _key?: string;
  style?: string;
  children?: { _type: string; text?: string; marks?: string[] }[];
  markDefs?: { _key: string; _type: string; href?: string }[];
} & SanityImage;

export type SanityImage = {
  asset?: {
    _id?: string;
    url?: string;
    metadata?: {
      dimensions?: {
        width?: number;
        height?: number;
        aspectRatio?: number;
      };
    };
  };
  alt?: string;
  caption?: string;
  credit?: string;
  sourceUrl?: string;
};

export type PrivacyDoc = {
  eyebrow?: string;
  heading?: string;
  lastUpdated?: string;
  body?: PortableTextBlock[];
};
export const fetchPrivacy = () => fetchOnce<PrivacyDoc>(PRIVACY_QUERY);

// ---------- Articles ----------

const ARTICLES_QUERY = /* groq */ `
  *[_type == "article"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    episodeTitle,
    excerpt,
    headerImage {
      ...,
      asset-> {
        _id,
        url,
        metadata {
          dimensions
        }
      }
    }
  }
`;

const ARTICLE_QUERY = /* groq */ `
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    episodeTitle,
    episodeUrl,
    excerpt,
    headerImage {
      ...,
      asset-> {
        _id,
        url,
        metadata {
          dimensions
        }
      }
    },
    body[] {
      ...,
      _type == "image" => {
        ...,
        asset-> {
          _id,
          url,
          metadata {
            dimensions
          }
        }
      }
    }
  }
`;

export type ArticleListItem = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  episodeTitle: string;
  excerpt: string;
  headerImage?: SanityImage;
};

export type ArticleDoc = ArticleListItem & {
  episodeUrl?: string;
  headerImage?: SanityImage;
  body?: PortableTextBlock[];
};

export async function fetchArticles(): Promise<ArticleListItem[]> {
  const data = await fetchOnce<ArticleListItem[]>(ARTICLES_QUERY);
  return data ?? [];
}

export async function fetchArticle(slug: string): Promise<ArticleDoc | null> {
  try {
    return await sanityClient.fetch<ArticleDoc>(
      ARTICLE_QUERY,
      { slug },
      { next: { revalidate: 600 } }
    );
  } catch (err) {
    console.error("Sanity fetch failed", err);
    return null;
  }
}

// ---------- Site settings ----------

export type LinkItem = { label: string; href: string };

export type SiteSettingsDoc = {
  footerTagline?: string;
  contactInbox?: string;
  podcastLinks?: LinkItem[];
  socialLinks?: LinkItem[];
};

export const fetchSiteSettings = () =>
  fetchOnce<SiteSettingsDoc>(SITE_SETTINGS_QUERY);
