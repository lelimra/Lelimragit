"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {
  MessageSquare,
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
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/85 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">

      {/* =====================================================
          PRODUCT IMAGE SECTION
      ===================================================== */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-slate-50"
      >
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
        <span className="absolute left-3.5 top-3.5 rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs backdrop-blur-md">
          {categoryLabels[product.category]}
        </span>

        {/* Featured / Popular Pill */}
        {product.featured && (
          <span className="absolute right-3.5 top-3.5 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
            {t("popular")}
          </span>
        )}

        {/* Out of Stock / On Request Overlay */}
        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-[2px]">
            <span className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm">
              {t("onRequest")}
            </span>
          </div>
        )}
      </Link>

      {/* =====================================================
          PRODUCT CONTENT SECTION
      ===================================================== */}
      <div className="flex flex-grow flex-col p-2">

        {/* Model Code */}
        {product.model && (
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
              {t("productModel")}: {product.model}
            </span>
          </div>
        )}

        {/* Product Name */}
        <h3 className="mt-1.5 line-clamp-2 text-base font-bold tracking-tight text-slate-900 transition-colors group-hover:text-sky-600">
          <Link href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        {/* Short Description */}
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
          {product.shortDescription}
        </p>

        {/* =====================================================
            SPECIFICATION PILLS
        ===================================================== */}
      {/* =====================================================
            SPECIFICATION PILLS (FRESH UI)
        ===================================================== */}
        {hasSpecs && (
          <div className="my-1 grid grid-cols-2 gap-2 rounded-xl bg-slate-50/80 p-1 border border-slate-100 text-[11px]">

            {product.specifications.size && (
              <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-2xs border border-slate-100/80">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-sky-50 text-sky-600">
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
              <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-2xs border border-slate-100/80">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
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
              <div className="flex items-center gap-1 rounded-lg bg-white p-2 shadow-2xs border border-slate-100/80">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-600">
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
              <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-2xs border border-slate-100/80">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
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
        <div className="mt-auto flex items-baseline justify-between border-t border-slate-100 pt-3.5">
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

            <span className="mt-0.5 block text-[10px] font-medium tracking-wide text-slate-400 uppercase">
              {t("wholesaleBulkRates")}
            </span>
          </div>
        </div>

        {/* =====================================================
            ACTION BUTTONS
        ===================================================== */}
        <div className="mt-4 grid bg-violet-400 grid-cols-2 gap-2.5">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-yellow-300 rounded-2xl px-3 py-2.5 text-center text-xs font-bold text-slate-700 transition-all duration-200 hover:bg-slate-200/80 active:scale-95"
          >
            <span>{t("viewDetails")}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-center text-xs font-bold text-white shadow-xs transition-all duration-200 hover:bg-emerald-700 active:scale-95"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
            <span>{t("enquireBtn")}</span>
          </a>
        </div>

      </div>
    </article>
  );
}