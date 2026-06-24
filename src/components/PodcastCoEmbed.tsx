export function PodcastCoEmbed() {
  return (
    <div className="rounded-2xl overflow-hidden border border-gold/30 shadow-2xl shadow-black/50">
      <iframe
        data-target="sustainable-fine-jewellery"
        src="https://play.pod.co/sustainable-fine-jewellery"
        frameBorder={0}
        width="100%"
        scrolling="no"
        style={{ overflow: "hidden", height: 500 }}
        className="podcastdotco-player podcastdotco-player--podcast block w-full"
        title="Gem Pursuit on Podcast.co"
      />
    </div>
  );
}
