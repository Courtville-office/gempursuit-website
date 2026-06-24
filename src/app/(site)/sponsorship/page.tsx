import type { Metadata } from "next";
import { SponsorshipForm } from "@/components/SponsorshipForm";
import { fetchSponsorship, fetchSiteSettings } from "@/sanity/queries";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Sponsorship",
  description:
    "Team up with Gem Pursuit. Sponsor episodes, series or special projects with an antique jewellery podcast that talks directly to passionate collectors and the trade.",
};

export default async function SponsorshipPage() {
  const [data, settings] = await Promise.all([
    fetchSponsorship(),
    fetchSiteSettings(),
  ]);

  const inbox = settings?.contactInbox || "info@gempursuit.com";
  const eyebrow = data?.eyebrow ?? "Partnerships";
  const heading = data?.heading ?? "Team up with us";
  const intro =
    data?.intro ??
    "Gem Pursuit talks directly to a passionate audience of collectors, jewellers and curious enthusiasts across Ireland, the UK and beyond. If your brand belongs in that conversation, we'd love to hear from you.";

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-20">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">{heading}</h1>
        <p className="mt-4 max-w-2xl text-cream/80 text-lg leading-relaxed">
          {intro}
        </p>
      </header>

      <section className="mt-12 grid gap-4 md:grid-cols-3">
        <Pillar
          eyebrow={data?.pillarOneTitle ?? "Episode sponsorship"}
          body={
            data?.pillarOneBody ??
            "Single or multi-episode reads woven naturally into the show by Matthew."
          }
        />
        <Pillar
          eyebrow={data?.pillarTwoTitle ?? "Series partnership"}
          body={
            data?.pillarTwoBody ??
            "Title sponsorship of a themed series, with on-air, social and newsletter inclusion."
          }
        />
        <Pillar
          eyebrow={data?.pillarThreeTitle ?? "Collaborations"}
          body={
            data?.pillarThreeBody ??
            "Live events, product placement, co-branded content. Open to creative ideas."
          }
        />
      </section>

      <section className="mt-16">
        <div className="card">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            {data?.formEyebrow ?? "Send us a note"}
          </p>
          <h2 className="mt-2 font-display text-3xl">
            {data?.formHeading ?? "Sponsorship enquiry"}
          </h2>
          <p className="mt-3 text-cream/80">
            {data?.formIntro ??
              "Tell us a little about the brand and what you have in mind. We usually reply within two working days."}
          </p>
          <div className="mt-8">
            <SponsorshipForm />
          </div>
        </div>
      </section>

      <p className="mt-8 text-sm text-cream/60">
        {data?.directEmailIntro ?? "Prefer to email directly?"}{" "}
        <a
          href={`mailto:${inbox}?subject=Gem%20Pursuit%20sponsorship`}
          className="text-gold hover:underline"
        >
          {inbox}
        </a>
        .
      </p>
    </div>
  );
}

function Pillar({ eyebrow, body }: { eyebrow: string; body: string }) {
  return (
    <div className="rounded-2xl border border-gold/15 bg-maroon-deep p-5 shadow-md shadow-gold-deep/10">
      <p className="text-[11px] uppercase tracking-widest text-gold/90">
        {eyebrow}
      </p>
      <p className="mt-2 text-cream/85 leading-relaxed text-sm">{body}</p>
    </div>
  );
}
