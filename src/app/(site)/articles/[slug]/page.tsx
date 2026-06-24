import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { fetchArticle, fetchArticles } from "@/sanity/queries";

export const revalidate = 600;

export async function generateStaticParams() {
  const articles = await fetchArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
  };
}

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 font-display text-3xl text-gold first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 font-display text-2xl text-gold/90">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="mt-4 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 border-gold/40 pl-5 italic text-cream/70">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 list-disc space-y-2 pl-6">{children}</ul>
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

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await fetchArticle(slug);
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
      <Link
        href="/articles"
        className="text-xs uppercase tracking-widest text-gold/70 hover:text-gold"
      >
        ← All articles
      </Link>

      <header className="mt-6">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          {formatDate(article.publishedAt)}
          {article.episodeTitle && (
            <span className="ml-3 normal-case tracking-normal text-[11px] text-cream/50">
              Based on: {article.episodeTitle}
            </span>
          )}
        </p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="mt-5 text-lg text-cream/70 leading-relaxed">
            {article.excerpt}
          </p>
        )}
      </header>

      <div className="mt-10 text-cream/85">
        {article.body ? (
          <PortableText
            value={article.body}
            components={portableTextComponents}
          />
        ) : (
          <p className="text-cream/60">No content yet.</p>
        )}
      </div>

      {article.episodeUrl && (
        <div className="mt-16 border-t border-gold/20 pt-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            Listen to the episode
          </p>
          <p className="mt-2 text-cream/80">
            This article is based on{" "}
            <span className="text-cream">{article.episodeTitle}</span>.
          </p>
          <a
            href={article.episodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-4 inline-block text-sm py-2 px-5"
          >
            Listen now →
          </a>
        </div>
      )}
    </div>
  );
}
