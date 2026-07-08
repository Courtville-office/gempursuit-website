import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fetchArticles } from "@/sanity/queries";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Written pieces based on episodes of Gem Pursuit, the antique jewellery podcast from Courtville Antiques.",
};

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ArticlesPage() {
  const articles = await fetchArticles();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-20">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          From the podcast
        </p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Articles</h1>
        <p className="mt-4 max-w-2xl text-cream/80">
          Written pieces based on episodes of Gem Pursuit.
        </p>
      </header>

      {articles.length === 0 ? (
        <p className="mt-16 text-cream/60">No articles published yet.</p>
      ) : (
        <section className="mt-12 space-y-6">
          {articles.map((article) => (
            <Link
              key={article._id}
              href={`/articles/${article.slug}`}
              className={`card group grid overflow-hidden p-0 transition hover:border-gold/40 ${
                article.headerImage?.asset?.url ? "md:grid-cols-[240px_1fr]" : ""
              }`}
            >
              {article.headerImage?.asset?.url && (
                <div className="relative aspect-[16/10] overflow-hidden border-b border-gold/15 bg-black/20 md:aspect-auto md:min-h-full md:border-b-0 md:border-r">
                  <Image
                    src={article.headerImage.asset.url}
                    alt={article.headerImage.alt || article.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(min-width: 768px) 240px, 100vw"
                  />
                </div>
              )}
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-gold">
                  {formatDate(article.publishedAt)}
                  {article.episodeTitle && (
                    <span className="ml-3 normal-case tracking-normal text-[11px] text-cream/50">
                      Based on: {article.episodeTitle}
                    </span>
                  )}
                </p>
                <h2 className="mt-2 font-display text-2xl text-cream">
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p className="mt-3 text-cream/75 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                )}
                <p className="mt-4 text-xs uppercase tracking-widest text-gold/70">
                  Read article →
                </p>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
