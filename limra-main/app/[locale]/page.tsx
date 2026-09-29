import type { Metadata } from "next";


import HomePageClient from "@/components/home/HomePageClient";

import {
  generateSEO,
  generateOrganizationJson,
  LOCALES,
  type SupportedLocale,
} from "@/lib/seo";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;

  const safeLocale: SupportedLocale = LOCALES.includes(
    locale as SupportedLocale
  )
    ? (locale as SupportedLocale)
    : "en";

  return generateSEO({
    locale: safeLocale,
    path: "",
    title:
      "Ceiling Fans, Table Fans & Pedestal Fans Manufacturer",
    description:
      "LE LIMRA by LIMRA INDUSTRY manufactures and supplies ceiling fans, table fans and pedestal fans for residential, commercial, retail, wholesale and bulk requirements.",
  });
}

export default async function LocalizedHomePage({
  params,
}: Props) {

  

  const organizationJsonLd =
    generateOrganizationJson();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            organizationJsonLd
          ).replace(/</g, "\\u003c"),
        }}
      />

      <HomePageClient />
    </>
  );
}