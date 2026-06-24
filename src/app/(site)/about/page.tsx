import type { Metadata } from "next";
import Link from "next/link";
import { fetchAbout } from "@/sanity/queries";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "About",
  description:
    "About Gem Pursuit, the antique jewellery podcast hosted by Matthew Weldon and produced by Courtville Antiques in Dublin.",
};

const DEFAULTS = {
  eyebrow: "About",
  heading: "The story",
  intro:
    "Gem Pursuit is a podcast about antique and vintage jewellery, the characters who made it and the people who love it. From medieval symbolism to Art Deco glamour and beyond, we go deep on the stories behind the gems.",
  producedByIntro: "The show is hosted by Matthew Weldon and produced by",
  producedByLinkText: "Courtville Antiques",
  producedByLinkUrl: "https://www.courtville.ie",
  producedByOutro:
    ", Dublin's specialist antique and vintage jeweller, established in the Powerscourt Centre. Drawing on decades of trade experience, every episode draws back the curtain on a world most people only see through a shop window.",
  secondaryHeading: "Where to listen",
  tertiaryHeading: "Get in touch",
};

function linkify(
  source: string | undefined,
  keyword: string,
  href: string,
  fallback: React.ReactNode
) {
  if (!source) return fallback;
  if (!source.includes(keyword)) return <>{source}</>;
  const parts = source.split(keyword);
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <Link href={href} className="text-gold hover:underline">
              {keyword}
            </Link>
          )}
        </span>
      ))}
    </>
  );
}

export default async function AboutPage() {
  const data = (await fetchAbout()) ?? {};
  const eyebrow = data.eyebrow ?? DEFAULTS.eyebrow;
  const heading = data.heading ?? DEFAULTS.heading;
  const intro = data.intro ?? DEFAULTS.intro;
  const producedByIntro = data.producedByIntro ?? DEFAULTS.producedByIntro;
  const producedByLinkText =
    data.producedByLinkText ?? DEFAULTS.producedByLinkText;
  const producedByLinkUrl =
    data.producedByLinkUrl ?? DEFAULTS.producedByLinkUrl;
  const producedByOutro = data.producedByOutro ?? DEFAULTS.producedByOutro;
  const secondaryHeading = data.secondaryHeading ?? DEFAULTS.secondaryHeading;
  const tertiaryHeading = data.tertiaryHeading ?? DEFAULTS.tertiaryHeading;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
      <h1 className="mt-3 font-display text-5xl md:text-6xl">{heading}</h1>

      <div className="prose prose-invert mt-10 max-w-none text-cream/85">
        <p className="text-lg leading-relaxed">{intro}</p>

        <p className="mt-6 leading-relaxed">
          {producedByIntro}{" "}
          <a
            href={producedByLinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            {producedByLinkText}
          </a>
          {producedByOutro}
        </p>

        <h2 className="mt-12 font-display text-3xl text-gold">
          {secondaryHeading}
        </h2>
        <p className="mt-3 leading-relaxed">
          {linkify(
            data.secondaryBody,
            "Subscribe",
            "/subscribe",
            <>
              New episodes drop on Spotify, YouTube and every major podcast
              app. Hit{" "}
              <Link href="/subscribe" className="text-gold hover:underline">
                Subscribe
              </Link>{" "}
              to be notified when one lands, or jump straight to the{" "}
              <Link href="/episodes" className="text-gold hover:underline">
                episodes
              </Link>{" "}
              page.
            </>
          )}
        </p>

        <h2 className="mt-12 font-display text-3xl text-gold">
          {tertiaryHeading}
        </h2>
        <p className="mt-3 leading-relaxed">
          {linkify(
            data.tertiaryBody,
            "contact form",
            "/contact",
            <>
              Got an idea, a question or a piece you'd love us to cover? Use
              the{" "}
              <Link href="/contact" className="text-gold hover:underline">
                contact form
              </Link>{" "}
              and the team will get back to you.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
