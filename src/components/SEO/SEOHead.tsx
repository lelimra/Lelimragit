import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import type { Product } from "../../../data/products";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  product?: Product;
  locale?: string;
}

export function generateSEO({
  title,
  description,
  canonicalUrl,
}: SEOHeadProps = {}): Metadata {
  const finalTitle = title
    ? `${title} | ${siteConfig.brandName}`
    : `${siteConfig.brandName} | Ceiling Fans & Table Fans Manufacturer`;

  const finalDescription =
    description ||
    `LE LIMRA by ${siteConfig.companyName} — ceiling fans, table fans and pedestal fans for homes, businesses, retailers, wholesalers and bulk buyers in ${siteConfig.city}, ${siteConfig.state}, ${siteConfig.country}.`;

  return {
    title: finalTitle,
    description: finalDescription,

    ...(canonicalUrl && {
      alternates: {
        canonical: canonicalUrl,
      },
    }),

    openGraph: {
      title: finalTitle,
      description: finalDescription,
      type: "website",
      siteName: siteConfig.brandName,
    },

    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateProductJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.category,

    brand: {
      "@type": "Brand",
      name: siteConfig.brandName,
    },

    manufacturer: {
      "@type": "Organization",
      name: siteConfig.companyName,
    },

    ...(product.price
      ? {
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "INR",
            availability: product.available
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          },
        }
      : {}),
  };
}

export function generateOrganizationJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",

    name: siteConfig.companyName,
    alternateName: siteConfig.brandName,
    url: siteUrl,
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