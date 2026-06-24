import type { Config } from "tailwindcss";

// Brand palette (light theme, matching the Gem Pursuit logo)
// - Page background: pale butter cream (#FAF1D0)
// - Card surfaces: white-cream (#FFFCE7)
// - Highlight band / wordmark tile: saturated logo yellow (#F2D04E)
// - Primary accent: royal indigo blue (#2D2E8C)
// - GEM wordmark: same indigo (matches the logo)
// - PURSUIT wordmark: red-orange (#C84526, matches the logo)
// - Body text: deep navy (#1F2147)
//
// Tailwind class names are kept (maroon/gold/violet/ember/cream) so
// components don't need rewriting. The semantics shift: maroon family
// is now light bg surfaces, gold is the indigo accent, cream is dark
// text colour.
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background and surface layers (light cream / butter)
        maroon: {
          DEFAULT: "#F2F2F2", // page bg, light grey
          deep: "#FFFFFF", // card surfaces, white
          light: "#F2D04E", // saturated logo yellow for highlights / tiles
        },
        // Primary accent: royal indigo blue
        gold: {
          DEFAULT: "#2D2E8C",
          soft: "#4344A8",
          deep: "#1A1D4D",
        },
        // GEM wordmark and soft decorative — also indigo to match the logo
        violet: {
          DEFAULT: "#2D2E8C",
          deep: "#1A1D4D",
        },
        // PURSUIT wordmark and warm hits
        ember: {
          DEFAULT: "#C84526",
          deep: "#A12F18",
        },
        // "cream" is now the dark text colour on the light bg
        cream: "#1F2147",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "deco-radial":
          "radial-gradient(ellipse at top, rgba(200,200,200,0.3) 0%, rgba(242,242,242,0) 60%)",
      },
    },
  },
  plugins: [],
};
export default config;
