"use client";

export function PodcastCoEmbed() {
  return (
    <div
      className="rounded-2xl overflow-hidden border border-gold/30 shadow-2xl shadow-black/50"
      dangerouslySetInnerHTML={{
        __html: `
          <iframe
            data-target="sustainable-fine-jewellery"
            src="https://play.pod.co/sustainable-fine-jewellery"
            frameborder="0"
            width="100%"
            scrolling="no"
            style="overflow:hidden;height:500px;"
            class="podcastdotco-player podcastdotco-player--podcast"
          ></iframe>
          <script src="https://play.pod.co/embed/frame-v1.js"></script>
        `,
      }}
    />
  );
}
