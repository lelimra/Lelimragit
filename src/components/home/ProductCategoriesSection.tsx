"use client";

import Image from "next/image";
import { ChevronRight, Fan, ShieldCheck, Wind } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/lib/navigation";

type ProductCategory = {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  image: string;
  href: string;
  icon: LucideIcon;
};

export default function ProductCategoriesSection() {
  const t = useTranslations();

  const categories: ProductCategory[] = [
    {
      id: "ceiling-fans",
      title: t("navCeilingFans"),
      subtitle: "1200mm & High Speed",
      desc: t("categoryCeilingDesc"),
      image: "/images/products/ceiling-fan-01.jpg",
      href: "/products?category=ceiling-fan",
      icon: Fan,
    },
    {
      id: "table-fans",
      title: t("navTableFans"),
      subtitle: "400mm Compact Airflow",
      desc: t("categoryTableDesc"),
      image: "/images/products/table-fan-01.jpg",
      href: "/products?category=table-fan",
      icon: Wind,
    },
    {
      id: "pedestal-fans",
      title: t("navPedestalFans"),
      subtitle: "Heavy Duty Stand Fans",
      desc: t("categoryPedestalDesc"),
      image: "/images/products/pedestal-fan-01.jpg",
      href: "/products?category=pedestal-fan",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Product Categories
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {t("categoriesHeading")}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t("categoriesDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat) => {
            const Icon = cat.icon;

            return (
              <div
                key={cat.id}
                className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden border-b border-slate-100">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-[#e31e24]" />

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#091a32] transition-colors">
                        {cat.title}
                      </h3>
                    </div>

                    <span className="text-xs text-slate-400 font-medium">
                      {cat.subtitle}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-grow">
                    {cat.desc}
                  </p>

                  <Link
                    href={cat.href}
                    className="inline-flex items-center justify-between w-full bg-slate-100 hover:bg-[#091a32] text-slate-800 hover:text-white px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <span>Explore Collection</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
