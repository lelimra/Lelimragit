import type { MetadataRoute } from "next";

import { LOCALES, SITE_URL } from "@/lib/seo";

const staticPages = [
  "",
  "/about",
  "/catalog",
  "/contact",
  "/dealers",
  "/products",
  "/wholesale",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const page of staticPages) {
      const url = `${SITE_URL}/${locale}${page}`;

      entries.push({
        url,
        changeFrequency:
          page === "" || page === "/products"
            ? "weekly"
            : "monthly",
        priority:
          page === ""
            ? 1
            : page === "/products"
              ? 0.9
              : 0.7,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((altLocale) => [
              altLocale,
              `${SITE_URL}/${altLocale}${page}`,
            ])
          ),
        },
      });
    }
  }

  return entries;
}