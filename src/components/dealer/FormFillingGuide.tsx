"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  HelpCircle,
  CheckCircle2,
  FileText,
  Building,
  ChevronDown,
  Info,
  Layers,
  Store,
  Briefcase,
  ShieldCheck,
} from "lucide-react";

export type PartnerRole =
  | "Super Stockist"
  | "Distributor"
  | "Dealer"
  | "Retailer";

interface FormFillingGuideProps {
  onSelectRole?: (role: PartnerRole) => void;
}

export default function FormFillingGuide({
  onSelectRole,
}: FormFillingGuideProps) {
  const t = useTranslations();

  const [activeTab, setActiveTab] = useState<
    "roles" | "fields" | "faq"
  >("roles");

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  /* =========================================================
     PARTNER ROLES
  ========================================================= */

  const roles = [
    {
      id: "Super Stockist" as PartnerRole,
      badge: t("dealerGuideSuperStockistBadge"),
      title: t("dealerSuperStockist"),
      icon: Layers,
      color: "bg-purple-50 text-purple-700 border-purple-200",
      accent: "border-l-4 border-l-purple-600",
      description: t("dealerGuideSuperStockistDescription"),
      eligibility: t("dealerGuideSuperStockistEligibility"),
      minOrder: t("dealerGuideSuperStockistOrder"),
      turnaround: t("dealerGuideSuperStockistLogistics"),
    },

    {
      id: "Distributor" as PartnerRole,
      badge: t("dealerGuideDistributorBadge"),
      title: t("dealerDistributor"),
      icon: Briefcase,
      color: "bg-blue-50 text-blue-700 border-blue-200",
      accent: "border-l-4 border-l-[#0b2f5c]",
      description: t("dealerGuideDistributorDescription"),
      eligibility: t("dealerGuideDistributorEligibility"),
      minOrder: t("dealerGuideDistributorOrder"),
      turnaround: t("dealerGuideDistributorLogistics"),
    },

    {
      id: "Dealer" as PartnerRole,
      badge: t("dealerGuideDealerBadge"),
      title: t("dealerAuthorizedDealer"),
      icon: Store,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      accent: "border-l-4 border-l-emerald-600",
      description: t("dealerGuideDealerDescription"),
      eligibility: t("dealerGuideDealerEligibility"),
      minOrder: t("dealerGuideDealerOrder"),
      turnaround: t("dealerGuideDealerLogistics"),
    },

    {
      id: "Retailer" as PartnerRole,
      badge: t("dealerGuideRetailerBadge"),
      title: t("dealerRetailer"),
      icon: Building,
      color: "bg-amber-50 text-amber-800 border-amber-200",
      accent: "border-l-4 border-l-amber-500",
      description: t("dealerGuideRetailerDescription"),
      eligibility: t("dealerGuideRetailerEligibility"),
      minOrder: t("dealerGuideRetailerOrder"),
      turnaround: t("dealerGuideRetailerLogistics"),
    },
  ];

  /* =========================================================
     FIELD GUIDE
  ========================================================= */

  const fieldInstructions = [
    {
      field: t("dealerGuideFieldRole"),
      requirement: t("dealerGuideMandatory"),
      tip: t("dealerGuideFieldRoleTip"),
    },
    {
      field: t("dealerGuideFieldBusiness"),
      requirement: t("dealerGuideMandatory"),
      tip: t("dealerGuideFieldBusinessTip"),
    },
    {
      field: t("dealerGuideFieldContact"),
      requirement: t("dealerGuideMandatory"),
      tip: t("dealerGuideFieldContactTip"),
    },
    {
      field: t("dealerGuideFieldGST"),
      requirement: t("dealerGuideRecommended"),
      tip: t("dealerGuideFieldGSTTip"),
    },
    {
      field: t("dealerGuideFieldMobile"),
      requirement: t("dealerGuideMandatory"),
      tip: t("dealerGuideFieldMobileTip"),
    },
    {
      field: t("dealerGuideFieldAddress"),
      requirement: t("dealerGuideMandatory"),
      tip: t("dealerGuideFieldAddressTip"),
    },
    {
      field: t("dealerGuideFieldLocation"),
      requirement: t("dealerGuideMandatory"),
      tip: t("dealerGuideFieldLocationTip"),
    },
    {
      field: t("dealerGuideFieldQuantity"),
      requirement: t("dealerGuideRecommended"),
      tip: t("dealerGuideFieldQuantityTip"),
    },
  ];

  /* =========================================================
     FAQ
  ========================================================= */

  const faqs = [
    {
      q: t("dealerFaq1Question"),
      a: t("dealerFaq1Answer"),
    },
    {
      q: t("dealerFaq2Question"),
      a: t("dealerFaq2Answer"),
    },
    {
      q: t("dealerFaq3Question"),
      a: t("dealerFaq3Answer"),
    },
    {
      q: t("dealerFaq4Question"),
      a: t("dealerFaq4Answer"),
    },
    {
      q: t("dealerFaq5Question"),
      a: t("dealerFaq5Answer"),
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="bg-gradient-to-r from-[#07192f] via-[#0b2f5c] to-[#174e8c] p-5 text-white sm:p-6">

        <div className="flex flex-wrap items-center justify-between gap-3">

          <div className="flex items-center gap-2.5">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-blue-300">
              <HelpCircle className="h-5 w-5" />
            </div>

            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-200">
                {t("dealerGuideEyebrow")}
              </span>

              <h3 className="text-lg font-bold text-white sm:text-xl">
                {t("dealerGuideTitle")}
              </h3>
            </div>

          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{t("dealerWarrantyBadge")}</span>
          </div>

        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-2 overflow-x-auto border-b border-white/15">

          {[
            {
              id: "roles",
              label: t("dealerGuideTabRoles"),
            },
            {
              id: "fields",
              label: t("dealerGuideTabFields"),
            },
            {
              id: "faq",
              label: t("dealerGuideTabFaq"),
            },
          ].map((tab, index) => (

            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setActiveTab(
                  tab.id as "roles" | "fields" | "faq"
                )
              }
              className={`relative whitespace-nowrap px-3 pb-2.5 text-xs font-bold transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-amber-400 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {index + 1}. {tab.label}
            </button>

          ))}

        </div>
      </div>

      {/* =====================================================
          ROLES
      ===================================================== */}

      {activeTab === "roles" && (
        <div className="space-y-4 p-5 sm:p-6">

          <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50/70 p-3.5 text-xs text-[#0b2f5c]">

            <Info className="mt-0.5 h-4 w-4 shrink-0" />

            <p>{t("dealerGuideRolesIntro")}</p>

          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {roles.map((role) => {
              const Icon = role.icon;

              return (
                <div
                  key={role.id}
                  className={`flex flex-col justify-between rounded-xl border bg-slate-50/60 p-4 transition-all hover:bg-slate-50 ${role.accent}`}
                >

                  <div>

                    <div className="mb-2 flex items-center justify-between gap-2">

                      <div className="flex items-center gap-2">

                        <div
                          className={`rounded-lg p-1.5 ${role.color}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>

                        <h4 className="text-sm font-bold text-slate-900">
                          {role.title}
                        </h4>

                      </div>

                      <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                        {role.badge}
                      </span>

                    </div>

                    <p className="mb-3 text-xs leading-relaxed text-slate-600">
                      {role.description}
                    </p>

                    <div className="space-y-1.5 border-t border-slate-200/60 pt-2.5 text-[11px]">

                      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                        <span className="font-semibold text-slate-700">
                          {t("dealerGuideIdealFor")}
                        </span>

                        <span className="text-slate-600 sm:text-right">
                          {role.eligibility}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                        <span className="font-semibold text-slate-700">
                          {t("dealerGuideTypicalOrder")}
                        </span>

                        <span className="font-medium text-[#0b2f5c]">
                          {role.minOrder}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                        <span className="font-semibold text-slate-700">
                          {t("dealerGuideLogistics")}
                        </span>

                        <span className="text-slate-600">
                          {role.turnaround}
                        </span>
                      </div>

                    </div>

                  </div>

                  {onSelectRole && (
                    <button
                      type="button"
                      onClick={() => onSelectRole(role.id)}
                      className="mt-3.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-center text-xs font-bold text-[#0b2f5c] transition-all hover:border-[#0b2f5c]"
                    >
                      {t("dealerGuideSelectRole")}
                    </button>
                  )}

                </div>
              );
            })}

          </div>
        </div>
      )}

      {/* =====================================================
          FIELD GUIDE
      ===================================================== */}

      {activeTab === "fields" && (
        <div className="space-y-4 p-5 sm:p-6">

          <div className="flex items-center justify-between border-b border-slate-100 pb-2">

            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t("dealerGuideChecklist")}
            </h4>

            <span className="hidden text-[11px] text-slate-400 sm:block">
              {t("dealerGuideChecklistDescription")}
            </span>

          </div>

          <div className="space-y-3">

            {fieldInstructions.map((item) => (
              <div
                key={item.field}
                className="rounded-lg border border-slate-200/70 bg-slate-50/40 p-3 transition-colors hover:bg-slate-50"
              >

                <div className="flex items-center justify-between gap-2">

                  <div className="flex items-center gap-2">

                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#0b2f5c]" />

                    <span className="text-xs font-bold text-slate-900">
                      {item.field}
                    </span>

                  </div>

                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                      item.requirement === t("dealerGuideMandatory")
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-blue-200 bg-blue-50 text-blue-700"
                    }`}
                  >
                    {item.requirement}
                  </span>

                </div>

                <p className="mt-1 pl-5 text-xs leading-relaxed text-slate-600">
                  {item.tip}
                </p>

              </div>
            ))}

          </div>

          {/* GST */}
          <div className="mt-4 space-y-2 rounded-xl bg-slate-900 p-4 text-xs text-white">

            <div className="flex items-center gap-2 font-bold text-amber-400">

              <FileText className="h-4 w-4" />

              <span>{t("dealerGuideGSTTitle")}</span>

            </div>

            <p className="rounded border border-slate-700 bg-slate-800 p-2 font-mono text-[12px] tracking-wider text-slate-300">
              36 AAAAA 0000 A 1 Z 5
            </p>

            <p className="text-[10px] leading-5 text-slate-400">
              {t("dealerGuideGSTDescription")}
            </p>

          </div>

        </div>
      )}

      {/* =====================================================
          FAQ
      ===================================================== */}

      {activeTab === "faq" && (
        <div className="space-y-4 p-5 sm:p-6">

          <div className="space-y-3">

            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={faq.q}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50/50"
                >

                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(isOpen ? null : index)
                    }
                    className="flex w-full items-center justify-between p-3.5 text-left text-xs font-bold text-slate-900 transition-colors hover:bg-slate-100/70"
                  >

                    <span className="pr-2">
                      {faq.q}
                    </span>

                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                        isOpen
                          ? "rotate-180 text-[#0b2f5c]"
                          : ""
                      }`}
                    />

                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 bg-white p-3.5 pt-3 text-xs leading-relaxed text-slate-600">
                      {faq.a}
                    </div>
                  )}

                </div>
              );
            })}

          </div>

          {/* Support */}
          <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-xs sm:flex-row">

            <div className="text-center sm:text-left">

              <h5 className="font-bold text-emerald-950">
                {t("dealerGuideNeedHelp")}
              </h5>

              <p className="mt-0.5 text-emerald-800">
                {t("dealerGuideSupportDescription")}
              </p>

            </div>

            <span className="shrink-0 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 font-bold text-[#0b2f5c]">
              {t("dealerGuideSupportPhone")}
            </span>

          </div>

        </div>
      )}

    </div>
  );
}