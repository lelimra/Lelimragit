"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Handshake,
  TrendingUp,
  ShieldCheck,
  Truck,
  Building,
  MessageSquare,
  BadgePercent,
  Layers,
  Store,
  Briefcase,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import DealerForm from "@/components/dealer/DealerForm";


export default function DealersPage() {
  const t = useTranslations();

  const whatsappNumber = "919999999999";

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hello LIMRA INDUSTRIES, I am interested in becoming a dealer/distributor."
  )}`;

  /* =========================================================
     PARTNER TYPES
  ========================================================= */

  const partnerTypes = [
    {
      title: t("dealerSuperStockist"),
      description: t("dealerSuperStockistDesc"),
      level: t("dealerSuperStockistLevel"),
      icon: Layers,
      iconStyle: "bg-purple-50 text-purple-600",
    },
    {
      title: t("dealerDistributor"),
      description: t("dealerDistributorDesc"),
      level: t("dealerDistributorLevel"),
      icon: Briefcase,
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      title: t("dealerAuthorizedDealer"),
      description: t("dealerAuthorizedDealerDesc"),
      level: t("dealerAuthorizedDealerLevel"),
      icon: Store,
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      title: t("dealerRetailer"),
      description: t("dealerRetailerDesc"),
      level: t("dealerRetailerLevel"),
      icon: Building,
      iconStyle: "bg-amber-50 text-amber-700",
    },
  ];

  /* =========================================================
     ADVANTAGES
  ========================================================= */

  const advantages = [
    {
      icon: BadgePercent,
      title: t("dealerAdvantage1"),
      description: t("dealerAdvantage1Desc"),
    },
    {
      icon: ShieldCheck,
      title: t("dealerAdvantage2"),
      description: t("dealerAdvantage2Desc"),
    },
    {
      icon: Layers,
      title: t("dealerAdvantage3"),
      description: t("dealerAdvantage3Desc"),
    },
    {
      icon: Truck,
      title: t("dealerAdvantage4"),
      description: t("dealerAdvantage4Desc"),
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-20">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

          {/* Breadcrumb */}
          <nav className="text-xs text-slate-500">
            <Link
              href="/"
              className="transition-colors hover:text-[#174e8c]"
            >
              {t("Navbar.home")}
            </Link>

            <span className="mx-2">/</span>

            <span className="font-medium text-slate-700">
              {t("dealerPageTitle")}
            </span>
          </nav>

          {/* Header Content */}
          <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="max-w-3xl">

              {/* Eyebrow */}
              <div className="mb-2 flex flex-wrap items-center gap-2">

                <span className="text-xs font-bold uppercase tracking-wider text-[#174e8c]">
                  {t("dealerEyebrow")}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />

                  {t("dealerWarrantyBadge")}
                </span>

              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {t("dealerPageTitle")}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                {t("dealerPageDescription")}
              </p>

            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2.5">

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                <MessageSquare className="h-4 w-4" />

                {t("dealerWhatsApp")}
              </a>

            </div>

          </div>

          {/* =================================================
              PARTNER TYPES
          ================================================= */}

          <div className="mt-7 grid grid-cols-2 gap-3 border-t border-slate-100 pt-6 md:grid-cols-4">

            {partnerTypes.map((partner) => {
              const Icon = partner.icon;

              return (
                <div
                  key={partner.title}
                  className="flex items-start gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50 p-3"
                >

                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${partner.iconStyle}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">

                    <h3 className="truncate text-xs font-bold text-slate-900">
                      {partner.title}
                    </h3>

                    <p className="mt-0.5 text-[10px] text-slate-500">
                      {partner.level}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          {/* =================================================
              LEFT SIDEBAR
          ================================================= */}

          <aside className="space-y-6 lg:col-span-4">

            {/* Warranty Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#07192f] to-[#0b2f5c] p-6 text-white shadow-md">

              <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-blue-400/10 blur-2xl" />

              <div className="relative">

                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-emerald-300">

                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />

                  {t("dealerQualityAssurance")}

                </div>

                <h2 className="mt-4 text-xl font-bold">
                  {t("dealerWarrantyTitle")}
                </h2>

                <p className="mt-3 text-xs leading-6 text-slate-300">
                  {t("dealerWarrantyDescription")}
                </p>

              </div>
            </div>

            {/* Commercial Advantages */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-2">

                <TrendingUp className="h-5 w-5 text-[#0b2f5c]" />

                <h2 className="text-lg font-bold text-slate-900">
                  {t("dealerAdvantagesTitle")}
                </h2>

              </div>

              <p className="mt-3 text-xs leading-6 text-slate-600">
                {t("dealerAdvantagesDescription")}
              </p>

              <div className="mt-5 space-y-3">

                {advantages.map((advantage) => {
                  const Icon = advantage.icon;

                  return (
                    <div
                      key={advantage.title}
                      className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-3.5"
                    >

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0b2f5c]/10 text-[#0b2f5c]">
                        <Icon className="h-4 w-4" />
                      </div>

                      <div>

                        <h3 className="text-xs font-bold text-slate-900">
                          {advantage.title}
                        </h3>

                        <p className="mt-1 text-[11px] leading-5 text-slate-500">
                          {advantage.description}
                        </p>

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

            {/* Factory Information */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center gap-2 text-[#0b2f5c]">

                <Building className="h-4 w-4" />

                <h2 className="text-xs font-bold">
                  {t("dealerFactoryTitle")}
                </h2>

              </div>

              <div className="mt-4">

                <h3 className="text-sm font-bold text-slate-900">
                  LIMRA INDUSTRIES
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Hyderabad, Telangana, India
                </p>

              </div>

              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-[11px] text-slate-600">

                <p>
                  • {t("dealerDirectFactory")}
                </p>

                <p>
                  • {t("dealerPanIndia")}
                </p>

                <p>
                  • {t("dealerWarrantySupport")}
                </p>

              </div>

            </div>

          </aside>

          {/* =================================================
              RIGHT FORM AREA
          ================================================= */}

          <div className="lg:col-span-8">

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              {/* Form Header */}
              <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-6 sm:px-8">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                    <Handshake className="h-5 w-5" />
                  </div>

                  <div>

                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                      {t("dealerFormTitle")}
                    </h2>

                    <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                      {t("dealerFormDescription")}
                    </p>

                  </div>

                </div>

              </div>

              {/* =================================================
                  FORM PLACEHOLDER
                  <DealerForm />
                  
                  Replace this entire block with DealerForm
                  when you provide the component.
              ================================================= */}

              <DealerForm />

              <div className="p-6 sm:p-8">

                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0b2f5c]/10 text-[#0b2f5c]">
                    <Handshake className="h-7 w-7" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {t("dealerFormPlaceholderTitle")}
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    {t("dealerFormPlaceholderDescription")}
                  </p>

                  <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0b2f5c] px-5 py-3 text-xs font-bold text-white">
                    {t("dealerFormComingSoon")}

                    <ArrowRight className="h-4 w-4" />
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      

    </main>
  );
}