import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://twizzcutter.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = [
    "/",          // home
    "/reels",
    "/faq",
    "/template",
    "/donate",
    "/about",
  ];
  return pages.map(p => ({
    url: `${BASE}${p}`,
    lastModified: now,
    changeFrequency: p === "/" ? "weekly" : "monthly",
    priority: p === "/" ? 1 : 0.7,
  }));
}