"use client";

import {
  Cpu,
  Factory,
  Gauge,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type WhyFeature = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

export default function WhyLimraSection() {
  const t = useTranslations();

  const whyLimraFeatures: WhyFeature[] = [
    {
      icon: Factory,
      title: t("whyFactoryDirect"),
      desc: t("whyFactoryDirectDesc"),
    },
    {
      icon: Cpu,
      title: t("whyReliableMotor"),
      desc: t("whyReliableMotorDesc"),
    },
    {
      icon: Gauge,
      title: t("whyHighAir"),
      desc: t("whyHighAirDesc"),
    },
    {
      icon: Zap,
      title: t("whyEnergyEfficient"),
      desc: t("whyEnergyEfficientDesc"),
    },
    {
      icon: Sparkles,
      title: t("whyQualityComponents"),
      desc: t("whyQualityComponentsDesc"),
    },
    {
      icon: ShieldCheck,
      title: t("whyWarranty"),
      desc: t("whyWarrantyDesc"),
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Manufacturing Standards
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {t("whyHeading")}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t("whyDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {whyLimraFeatures.map((feat, idx) => {
            const Icon = feat.icon;

            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-colors flex flex-col"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-[#091a32] flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-[#091a32]" />
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  {feat.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
