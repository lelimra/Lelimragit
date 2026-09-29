"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Handshake,
  MessageSquare,
  ShieldCheck,
  Truck,
  Building2,
} from "lucide-react";

import WholesaleForm from "@/components/wholesale/WholesaleForm";
import { getWholesaleEnquiryWhatsAppUrl } from "@/utils/whatsapp";
import { generateSEO } from "@/components/SEO/SEOHead";

export default function WholesalePage() {
  const params = useParams();
  const locale = params.locale as string;

  // Your JSON has wholesale keys at the root level,
  // so do NOT use useTranslations("Wholesale").
  const t = useTranslations();

  const whatsappUrl = getWholesaleEnquiryWhatsAppUrl();

  const buyerTypes = [
    {
      icon: Building2,
      title: t("wholesaleRetailers"),
      desc: t("wholesaleRetailersDesc"),
    },
    {
      icon: Boxes,
      title: t("wholesaleDistributors"),
      desc: t("wholesaleDistributorsDesc"),
    },
    {
      icon: ShieldCheck,
      title: t("wholesaleInstitutions"),
      desc: t("wholesaleInstitutionsDesc"),
    },
    {
      icon: Truck,
      title: t("wholesaleBuilders"),
      desc: t("wholesaleBuildersDesc"),
    },
  ];

  const benefits = [
    t("wholesaleBenefit1"),
    t("wholesaleBenefit2"),
    t("wholesaleBenefit3"),
    t("wholesaleBenefit4"),
  ];

  const productTypes = [
    t("wholesaleProductCeilingBulk"),
    t("wholesaleProductTableBulk"),
    t("wholesaleProductPedestalBulk"),
    t("wholesaleProductMixed"),
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-20">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative overflow-hidden bg-[#07192f] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(23,78,140,0.35),transparent_45%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          

          <div className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:py-20">

            {/* Hero Content */}
            <div className="lg:col-span-7">

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-300">
                <Handshake className="h-3.5 w-3.5" />
                {t("wholesaleBadge")}
              </div>

              <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
                {t("wholesaleHeroTitle")}
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                {t("wholesaleHeroDescription")}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/20 transition-colors hover:bg-emerald-700"
                >
                  <MessageSquare className="h-4 w-4" />
                  {t("wholesaleWhatsApp")}
                </a>

                <a
                  href="#wholesale-enquiry"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  {t("wholesaleEnquiry")}
                  <ArrowRight className="h-4 w-4" />
                </a>

              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-400">

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  {t("wholesaleDirectFactory")}
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  {t("wholesaleBenefit2")}
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  {t("wholesaleBenefit5")}
                </div>

              </div>
            </div>

            {/* Hero Side Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm sm:p-7">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                      {t("wholesaleFormTitle")}
                    </p>

                    <h2 className="mt-1 text-xl font-bold">
                      {t("wholesaleFormDescription")}
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-400/10">
                    <Boxes className="h-5 w-5 text-blue-300" />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {productTypes.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 px-4 py-3"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />

                      <span className="text-sm text-slate-200">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-5 text-xs leading-relaxed text-slate-400">
                  {t("wholesaleDescription")}
                </p>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          BUYER TYPES
      ===================================================== */}
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">

        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#174e8c]">
            {t("wholesaleWhoWeSupply")}
          </span>

          <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
            {t("wholesaleWhoWeSupply")}
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {t("wholesaleWhoWeSupplyDescription")}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {buyerTypes.map((buyer) => {
            const Icon = buyer.icon;

            return (
              <div
                key={buyer.title}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0b2f5c]/10 text-[#0b2f5c]">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-4 text-sm font-bold text-slate-900">
                  {buyer.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {buyer.desc}
                </p>
              </div>
            );
          })}

        </div>
      </section>

      {/* =====================================================
          FORM + BENEFITS
      ===================================================== */}
      <section
        id="wholesale-enquiry"
        className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8"
      >
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">

          {/* Benefits */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-2xl bg-[#07192f] p-6 text-white shadow-sm sm:p-7">

              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                {t("wholesaleBenefitsTitle")}
              </span>

              <h2 className="mt-2 text-2xl font-black">
                {t("wholesaleBenefitsTitle")}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {t("wholesaleBenefitsDescription")}
              </p>

              <div className="mt-6 space-y-4">

                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/10">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    </div>

                    <p className="text-xs leading-5 text-slate-300">
                      {benefit}
                    </p>
                  </div>
                ))}

              </div>

              <div className="mt-7 border-t border-slate-800 pt-5">

                <Link
                  href={`/${locale}/dealers`}
                  className="group flex items-center justify-between gap-4 rounded-xl border border-blue-700/40 bg-blue-900/30 p-4 transition-colors hover:bg-blue-900/50"
                >
                  <div className="flex items-center gap-3">

                    <Handshake className="h-5 w-5 shrink-0 text-amber-400" />

                    <div>
                      <p className="text-xs font-bold text-white">
                        {t("wholesaleProductDealer")}
                      </p>

                      <p className="mt-0.5 text-[11px] text-blue-200">
                        {t("wholesaleBenefit6")}
                      </p>
                    </div>

                  </div>

                  <ArrowRight className="h-4 w-4 text-blue-300 transition-transform group-hover:translate-x-1" />
                </Link>

              </div>

              <div className="mt-4 flex items-center gap-2 text-[11px] text-emerald-400">
                <ShieldCheck className="h-4 w-4" />

                <span>
                  {t("wholesaleTrustWarranty")}
                </span>
              </div>

            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

              <div className="mb-6">

                <span className="text-xs font-bold uppercase tracking-wider text-[#174e8c]">
                  {t("wholesaleEnquiry")}
                </span>

                <h2 className="mt-1 text-2xl font-black text-slate-900">
                  {t("wholesaleFormTitle")}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {t("wholesaleFormDescription")}
                </p>

              </div>

              <WholesaleForm />

            </div>
          </div>

        </div>
      </section>

     
    </main>
  );
}