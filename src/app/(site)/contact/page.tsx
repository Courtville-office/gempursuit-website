import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { fetchContact, fetchSiteSettings } from "@/sanity/queries";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Gem Pursuit team. Story ideas, guest pitches, listener questions all welcome.",
};

export default async function ContactPage() {
  const [data, settings] = await Promise.all([
    fetchContact(),
    fetchSiteSettings(),
  ]);

  const inbox = settings?.contactInbox || "info@gempursuit.com";
  const eyebrow = data?.eyebrow ?? "Get in touch";
  const heading = data?.heading ?? "Say hello";
  const intro =
    data?.intro ??
    "Story idea, guest pitch, listener question, or just want to nerd out about jewellery? Drop us a line.";
  const directEmailIntro = data?.directEmailIntro ?? "Or email us directly at";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
      <h1 className="mt-3 font-display text-5xl md:text-6xl">{heading}</h1>
      <p className="mt-4 max-w-2xl text-cream/80">{intro}</p>

      <div className="mt-10">
        <ContactForm />
      </div>

      <p className="mt-8 text-sm text-cream/60">
        {directEmailIntro}{" "}
        <a href={`mailto:${inbox}`} className="text-gold hover:underline">
          {inbox}
        </a>
        .
      </p>
    </div>
  );
}
