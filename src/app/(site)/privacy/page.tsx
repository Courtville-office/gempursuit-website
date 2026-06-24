import type { Metadata } from "next";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { fetchPrivacy } from "@/sanity/queries";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Gem Pursuit handles your personal data.",
};

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-8 font-display text-2xl text-gold first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 font-display text-xl text-gold/90">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="mt-3 leading-relaxed">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-3 list-disc space-y-2 pl-6">{children}</ul>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="text-cream">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gold hover:underline"
      >
        {children}
      </a>
    ),
  },
};

export default async function PrivacyPage() {
  const data = (await fetchPrivacy()) ?? {};
  const eyebrow = data.eyebrow ?? "Legal";
  const heading = data.heading ?? "Privacy Policy";
  const lastUpdated = data.lastUpdated ?? "";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
      <h1 className="mt-3 font-display text-5xl md:text-6xl">{heading}</h1>
      {lastUpdated && (
        <p className="mt-2 text-sm text-cream/60">Last updated {lastUpdated}</p>
      )}

      <div className="mt-10 text-cream/85 leading-relaxed">
        {data.body ? (
          <PortableText
            value={data.body}
            components={portableTextComponents}
          />
        ) : (
          <p>
            Privacy policy has not been published yet. An administrator can
            edit it in the Sanity Studio.
          </p>
        )}
      </div>
    </div>
  );
}
