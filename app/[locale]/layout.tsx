import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

import Navbar from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { AIAssistantProvider } from "@/context/AiAssistantContext";
import FloatingActions from "@/components/layout/FloatingActions";

const locales = ["en", "hi", "te", "mr", "ur"] as const;

export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>

      <AIAssistantProvider>


        <Navbar />
        {children}
        <MobileBottomNav />
        <FloatingActions />
        <Footer />
        </AIAssistantProvider>

    </NextIntlClientProvider>
  );
}