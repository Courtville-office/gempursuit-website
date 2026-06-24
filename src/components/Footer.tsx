import Link from "next/link";
import { SOCIAL_LINKS, PODCAST_LINKS } from "@/lib/links";
import { fetchSiteSettings } from "@/sanity/queries";

const DEFAULT_TAGLINE =
  "An antique jewellery podcast from Courtville Antiques in Dublin. Hosted by Matthew Weldon, exploring the stories, history and characters behind the gems we love.";

export async function Footer() {
  const year = new Date().getFullYear();
  const settings = await fetchSiteSettings();
  const tagline = settings?.footerTagline || DEFAULT_TAGLINE;
  const podcastLinks =
    settings?.podcastLinks && settings.podcastLinks.length > 0
      ? settings.podcastLinks
      : PODCAST_LINKS;
  const socialLinks =
    settings?.socialLinks && settings.socialLinks.length > 0
      ? settings.socialLinks
      : SOCIAL_LINKS;

  return (
    <footer className="mt-24 border-t border-gold/20 bg-maroon-deep/60">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-2xl text-gold">Gem Pursuit</p>
            <p className="mt-3 max-w-md text-sm text-cream/80 leading-relaxed">
              {tagline}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-gold/80">
              Listen
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {podcastLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/90 hover:text-gold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-gold/80">
              Follow
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/90 hover:text-gold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="deco-divider mt-10" />

        <div className="mt-6 flex flex-col gap-3 text-xs text-cream/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} Gem Pursuit. Produced by{" "}
            <a
              href="https://www.courtville.ie"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-gold"
            >
              Courtville Antiques
            </a>
            .
          </p>
          <ul className="flex flex-wrap gap-4">
            <li>
              <Link href="/sponsorship" className="hover:text-gold">
                Sponsorship
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-gold">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
