import type { Metadata } from "next";
import type { Product } from "@/data/products";
import { siteConfig } from "@/data/site";

export const SITE_URL = siteConfig.siteUrl;

export const LOCALES = ["en", "hi", "te", "mr", "ur"] as const;

export type SupportedLocale = (typeof LOCALES)[number];

const openGraphLocales: Record<SupportedLocale, string> = {
  en: "en_IN",
  hi: "hi_IN",
  te: "te_IN",
  mr: "mr_IN",
  ur: "ur_PK",
};

function cleanPath(path = ""): string {
  return path
    ? `/${path.replace(/^\/+/, "")}`
    : "";
}

/**
 * Build a localized URL.
 *
 * Example:
 * /en
 * /en/about
 * /en/products/aero
 */
export function getLocalizedUrl(
  locale: SupportedLocale,
  path = ""
): string {
  return `${SITE_URL}/${locale}${cleanPath(path)}`;
}

/**
 * Generate hreflang URLs.
 */
export function getLanguageAlternates(path = "") {
  const clean = cleanPath(path);

  return {
    en: `${SITE_URL}/en${clean}`,
    hi: `${SITE_URL}/hi${clean}`,
    te: `${SITE_URL}/te${clean}`,
    mr: `${SITE_URL}/mr${clean}`,
    ur: `${SITE_URL}/ur${clean}`,
    "x-default": `${SITE_URL}/en${clean}`,
  };
}

type SEOOptions = {
  title?: string;
  description?: string;
  locale?: SupportedLocale;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

export function generateSEO({
  title,
  description,
  locale = "en",
  path = "",
  image = siteConfig.seo.ogImage,
  noIndex = false,
}: SEOOptions = {}): Metadata {
  const finalTitle = title
    ? `${title} | ${siteConfig.brandName}`
    : siteConfig.seo.title;

  const finalDescription =
    description || siteConfig.seo.description;

  const canonicalUrl = getLocalizedUrl(locale, path);

  const imageUrl = image.startsWith("http")
    ? image
    : `${SITE_URL}${image}`;

  return {
    metadataBase: new URL(SITE_URL),

    title: finalTitle,

    description: finalDescription,

    alternates: {
      canonical: canonicalUrl,
      languages: getLanguageAlternates(path),
    },

    robots: noIndex
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },

    openGraph: {
      type: "website",
      siteName: siteConfig.brandName,
      title: finalTitle,
      description: finalDescription,
      url: canonicalUrl,
      locale: openGraphLocales[locale],

      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: finalTitle,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      images: [imageUrl],
    },
  };
}

/**
 * Product structured data.
 */
export function generateProductJsonLd(
  product: Product,
  locale: SupportedLocale
) {
  const productUrl = getLocalizedUrl(
    locale,
    `/products/${product.slug}`
  );

  const productImages = (product.images ?? [])
    .filter(Boolean)
    .map((image) =>
      image.startsWith("http")
        ? image
        : `${SITE_URL}${image}`
    );

  return {
    "@context": "https://schema.org",
    "@type": "Product",

    "@id": `${productUrl}#product`,

    name: product.name,

    description:
      product.description ||
      product.shortDescription,

    url: productUrl,

    sku: product.model || product.id,

    category: product.category,

    ...(productImages.length > 0
      ? {
          image: productImages,
        }
      : {}),

    brand: {
      "@type": "Brand",
      name: siteConfig.brandName,
    },

    manufacturer: {
      "@type": "Organization",
      name: siteConfig.companyName,
      url: SITE_URL,
    },

    ...(product.price != null
      ? {
          offers: {
            "@type": "Offer",

            url: productUrl,

            price: product.price.toFixed(2),

            priceCurrency: "INR",

            availability: product.available
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",

            seller: {
              "@type": "Organization",
              name: siteConfig.companyName,
            },
          },
        }
      : {}),
  };
}

/**
 * Organization structured data.
 */
export function generateOrganizationJson() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",

    "@id": `${SITE_URL}#organization`,

    name: siteConfig.companyName,

    alternateName: siteConfig.brandName,

    url: SITE_URL,

    logo: `${SITE_URL}${siteConfig.logo}`,

    description: siteConfig.aboutText,

    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.state,
      addressCountry: siteConfig.country,
    },

    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      contactType: "customer service",
      areaServed: "IN",
    },
  };
}

/**
 * Breadcrumb structured data.
 */
export function generateBreadcrumbJsonLd(
  items: Array<{
    name: string;
    url: string;
  }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",

    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}