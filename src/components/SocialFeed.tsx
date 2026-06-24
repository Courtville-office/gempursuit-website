"use client";

import { createElement, useEffect } from "react";

let scriptInjected = false;
function injectBeholdScript() {
  if (typeof window === "undefined" || scriptInjected) return;
  if (document.querySelector('script[data-behold="1"]')) {
    scriptInjected = true;
    return;
  }
  const s = document.createElement("script");
  s.src = "https://w.behold.so/widget.js";
  s.type = "module";
  s.async = true;
  s.dataset.behold = "1";
  document.head.appendChild(s);
  scriptInjected = true;
}

function BeholdWidget({ feedId }: { feedId: string }) {
  useEffect(() => {
    injectBeholdScript();
  }, []);
  return (
    <div className="overflow-hidden rounded-2xl">
      {createElement("behold-widget", { "feed-id": feedId })}
    </div>
  );
}

export function InstagramFeed({
  feedId,
  handle,
  href,
}: {
  feedId?: string;
  handle: string;
  href: string;
}) {
  if (!feedId) {
    return (
      <SocialPlaceholder
        platform="Instagram"
        handle={handle}
        href={href}
        helpHref="https://behold.so"
      />
    );
  }
  return (
    <div>
      <SocialHeader platform="Instagram" handle={handle} href={href} />
      <div className="mt-4">
        <BeholdWidget feedId={feedId} />
      </div>
    </div>
  );
}

export function TikTokFeed({
  feedId,
  handle,
  href,
}: {
  feedId?: string;
  handle: string;
  href: string;
}) {
  if (!feedId) {
    return (
      <SocialPlaceholder
        platform="TikTok"
        handle={handle}
        href={href}
        helpHref="https://behold.so"
      />
    );
  }
  return (
    <div>
      <SocialHeader platform="TikTok" handle={handle} href={href} />
      <div className="mt-4">
        <BeholdWidget feedId={feedId} />
      </div>
    </div>
  );
}

function SocialHeader({
  platform,
  handle,
  href,
}: {
  platform: string;
  handle: string;
  href: string;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold md:text-xs">
          {platform}
        </p>
        <p className="mt-1 truncate font-display text-lg text-cream md:text-2xl">
          {handle}
        </p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-sm text-gold hover:underline"
      >
        Follow →
      </a>
    </div>
  );
}

function SocialPlaceholder({
  platform,
  handle,
  href,
  helpHref,
}: {
  platform: string;
  handle: string;
  href: string;
  helpHref: string;
}) {
  return (
    <div className="card">
      <SocialHeader platform={platform} handle={handle} href={href} />
      <p className="mt-4 text-sm text-cream/70">
        The latest {platform} posts will appear here once a feed is connected.{" "}
        <a
          href={helpHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold hover:underline"
        >
          Set one up at Behold.so
        </a>{" "}
        and add the feed ID to the site config.
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline mt-6 text-sm"
      >
        Open {platform} in the meantime
      </a>
    </div>
  );
}
