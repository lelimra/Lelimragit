import React from "react";
import { useTranslations } from "next-intl";
import { Factory, Truck, ShieldCheck, Layers } from "lucide-react";

export const TrustStrip: React.FC = () => {
  const t = useTranslations();

  const items = [
    {
      icon: Factory,
      title: t("trustManufacturer"),
      desc: t("trustManufacturerDesc"),
    },
    {
      icon: Layers,
      title: t("trustWholesale"),
      desc: t("trustWholesaleDesc"),
    },
    {
      icon: ShieldCheck,
      title: t("trustWarranty"),
      desc: t("trustWarrantyDesc"),
    },
    {
      icon: Truck,
      title: t("trustDelivery"),
      desc: t("trustDeliveryDesc"),
    },
  ];

  return (
    <section className="bg-white border-b border-slate-200 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-white text-[#091a32] border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                  <Icon className="w-4 h-4 text-[#091a32]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
