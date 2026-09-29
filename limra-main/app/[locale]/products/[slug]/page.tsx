import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductDetails from "@/components/products/ProductDetails";

import {
  getAllProducts,
  getProductBySlug,
} from "@/data/products";

import {
  generateSEO,
  generateProductJsonLd,
  generateBreadcrumbJsonLd,
  LOCALES,
  SITE_URL,
  type SupportedLocale,
} from "@/lib/seo";

type ProductPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getAllProducts().map((product) => ({
      locale,
      slug: product.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const safeLocale: SupportedLocale = LOCALES.includes(
    locale as SupportedLocale
  )
    ? (locale as SupportedLocale)
    : "en";

  const productImage =
    product.images?.find(Boolean) ||
    "/images/brand/logo.png";

  return generateSEO({
    locale: safeLocale,

    path: `/products/${product.slug}`,

    title: product.name,

    description:
      product.shortDescription ||
      product.description,

    image: productImage,
  });
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { locale, slug } = await params;

  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const safeLocale: SupportedLocale = LOCALES.includes(
    locale as SupportedLocale
  )
    ? (locale as SupportedLocale)
    : "en";

  const productJsonLd = generateProductJsonLd(
    product,
    safeLocale
  );

  const productUrl = `${SITE_URL}/${safeLocale}/products/${product.slug}`;

  const breadcrumbJsonLd =
    generateBreadcrumbJsonLd([
      {
        name: "Products",
        url: `${SITE_URL}/${safeLocale}/products`,
      },
      {
        name: getCategoryName(product.category),
        url: `${SITE_URL}/${safeLocale}/products?category=${product.category}`,
      },
      {
        name: product.name,
        url: productUrl,
      },
    ]);

  return (
    <>
      {/* Product structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />

      {/* Breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd
          ).replace(/</g, "\\u003c"),
        }}
      />

      <ProductDetails product={product} />
    </>
  );
}

function getCategoryName(
  category: string
): string {
  switch (category) {
    case "ceiling-fan":
      return "Ceiling Fans";

    case "table-fan":
      return "Table Fans";

    case "pedestal-fan":
      return "Pedestal Fans";

    default:
      return "Products";
  }
}