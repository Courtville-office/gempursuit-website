import { special } from "./special";
import { article } from "./article";
import {
  aboutPage,
  contactPage,
  sponsorshipPage,
  specialsPage,
  privacyPage,
} from "./pages";
import { siteSettings } from "./siteSettings";

export const schemaTypes = [
  // Featured episodes
  special,
  // Articles
  article,
  // Page-level singletons
  aboutPage,
  contactPage,
  sponsorshipPage,
  specialsPage,
  privacyPage,
  // Site-wide settings
  siteSettings,
];

export const singletonTypes = new Set([
  "aboutPage",
  "contactPage",
  "sponsorshipPage",
  "specialsPage",
  "privacyPage",
  "siteSettings",
]);
