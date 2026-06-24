// Sanity Studio mounted at /studio. Sanity Studio is a browser-side
// React app so this is a client component. The catch-all route lets
// Studio handle its own internal navigation.

"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
