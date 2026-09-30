"use client";

import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Gauge,
} from "lucide-react";

import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations();

  const categoryLabels: Record<Product["category"], string> = {
    "ceiling-fan": t("navCeilingFans"),
    "table-fan": t("navTableFans"),
    "pedestal-fan": t("navPedestalFans"),
  };

  const hasSpecs =
    product.specifications.size ||
    product.specifications.rpm ||
    product.specifications.wattage ||
    product.warranty;

  const whatsappNumber = "919999999999";

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello LIMRA INDUSTRIES, I am interested in ${product.name}${
      product.model ? ` (${product.model})` : ""
    }. Please share the details and wholesale price.`
  )}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[28px] border-2 border-white bg-gradient-to-b from-white via-slate-50/80 to-slate-100/70 p-3 shadow-[0_12px_32px_-8px_rgba(15,23,42,0.08),inset_0_2px_6px_rgba(255,255,255,0.9)] transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-200 hover:shadow-[0_20px_40px_-10px_rgba(15,23,42,0.14),inset_0_2px_6px_rgba(255,255,255,1)]">

      {/* =====================================================
          PRODUCT IMAGE SECTION (Claymorphic Frame)
      ===================================================== */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]"
      >
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100">
            <span className="text-xs font-semibold text-slate-400">
              {t("productImageComingSoon")}
            </span>
          </div>
        )}

        {/* Gradient Overlay for Top Badges Readability */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 via-black/10 to-transparent pointer-events-none" />

        {/* Category Pill */}
        <span className="absolute left-3.5 top-3.5 rounded-full bg-slate-900/85 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-[0_4px_10px_rgba(0,0,0,0.2)] backdrop-blur-md">
          {categoryLabels[product.category]}
        </span>

        {/* Featured / Popular Pill */}
        {product.featured && (
          <span className="absolute right-3.5 top-3.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-[0_4px_10px_rgba(245,158,11,0.4)]">
            {t("popular")}
          </span>
        )}

        {/* Out of Stock / On Request Overlay */}
        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/85 backdrop-blur-[3px]">
            <span className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-md">
              {t("onRequest")}
            </span>
          </div>
        )}
      </Link>

      {/* =====================================================
          PRODUCT CONTENT SECTION
      ===================================================== */}
      <div className="flex flex-grow flex-col pt-3 px-1.5 pb-1">

        {/* Model Code */}
        {product.model && (
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
              {t("productModel")}: {product.model}
            </span>
          </div>
        )}

        {/* Product Name */}
        <h3 className="mt-1 line-clamp-2 text-base font-extrabold tracking-tight text-slate-900 transition-colors group-hover:text-sky-600">
          <Link href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        {/* Short Description */}
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
          {product.shortDescription}
        </p>

        {/* =====================================================
            SPECIFICATION PILLS (Claymorphic Sub-Cards)
        ===================================================== */}
        {hasSpecs && (
          <div className="my-2.5 grid grid-cols-2 gap-2 rounded-2xl bg-gradient-to-b from-white/90 to-slate-100/90 p-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03),0_2px_8px_rgba(0,0,0,0.02)] border border-slate-200/60 text-[11px]">

            {product.specifications.size && (
              <div className="flex items-center gap-2 rounded-xl bg-white p-2 shadow-[0_3px_8px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,1)] border border-slate-100">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 shadow-xs">
                  <Gauge className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    {t("sweep")}
                  </span>
                  <span className="truncate font-bold text-slate-800">
                    {product.specifications.size}
                  </span>
                </div>
              </div>
            )}

            {product.specifications.rpm && (
              <div className="flex items-center gap-2 rounded-xl bg-white p-2 shadow-[0_3px_8px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,1)] border border-slate-100">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 shadow-xs">
                  <Gauge className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    RPM
                  </span>
                  <span className="truncate font-bold text-slate-800">
                    {product.specifications.rpm}
                  </span>
                </div>
              </div>
            )}

            {product.specifications.wattage && (
              <div className="flex items-center gap-2 rounded-xl bg-white p-2 shadow-[0_3px_8px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,1)] border border-slate-100">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 shadow-xs">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Power
                  </span>
                  <span className="truncate font-bold text-slate-800">
                    {product.specifications.wattage}
                  </span>
                </div>
              </div>
            )}

            {product.warranty && (
              <div className="flex items-center gap-2 rounded-xl bg-white p-2 shadow-[0_3px_8px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,1)] border border-slate-100">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shadow-xs">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Warranty
                  </span>
                  <span className="truncate font-bold text-emerald-700">
                    {product.warranty}
                  </span>
                </div>
              </div>
            )}

          </div>
        )}

        {/* =====================================================
            PRICE & WHOLESALE BADGE
        ===================================================== */}
        <div className="mt-auto flex items-baseline justify-between border-t border-slate-200/60 pt-3">
          <div>
            {product.price ? (
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>

                {product.mrp && product.mrp > product.price && (
                  <span className="text-xs font-medium text-slate-400 line-through">
                    {t("mrpLabel")} ₹{product.mrp.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs font-semibold text-slate-500">
                {t("onRequest")}
              </span>
            )}

            <span className="mt-0.5 block text-[10px] font-bold tracking-wide text-slate-400 uppercase">
              {t("wholesaleBulkRates")}
            </span>
          </div>
        </div>

        {/* =====================================================
            ACTION BUTTONS (3D Claymorphic Tactile Design)
        ===================================================== */}
        <div className="mt-2 grid grid-cols-2 gap-2">
          {/* View Details Button - 3D Clay Amber */}
          <Link
            href={`/products/${product.slug}`}
            className="group relative inline-flex w-full items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-b from-amber-300 to-amber-500 px-1 py-1 text-center text-xs font-extrabold text-slate-950 shadow-[0_6px_0_0_#b45309,0_10px_20px_-4px_rgba(245,158,11,0.4),inset_0_2px_3px_rgba(255,255,255,0.7)] transition-all duration-150 hover:brightness-105 active:translate-y-1.5 active:shadow-[0_0px_0_0_#b45309,0_4px_10px_rgba(245,158,11,0.3),inset_0_1px_2px_rgba(255,255,255,0.5)] focus:outline-none focus:ring-2 focus:ring-amber-400/50"
          >
            <span>{t("viewDetails")}</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* WhatsApp Enquiry Button - 3D Clay Emerald */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex w-full items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-700 px-1 py-1 text-center text-xs font-extrabold text-white shadow-[0_6px_0_0_#064e3b,0_10px_20px_-4px_rgba(16,185,129,0.4),inset_0_2px_3px_rgba(255,255,255,0.4)] transition-all duration-150 hover:brightness-105 active:translate-y-1.5 active:shadow-[0_0px_0_0_#064e3b,0_4px_10px_rgba(16,185,129,0.3),inset_0_1px_2px_rgba(255,255,255,0.3)] focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <WhatsAppIcon className="h-4 w-4 fill-current drop-shadow-sm" />
            <span>{t("enquireBtn")}</span>
          </a>
        </div>
      </div>
    </article>
  );
}