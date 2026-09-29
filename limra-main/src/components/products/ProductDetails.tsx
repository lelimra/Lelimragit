"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";

import type { Product } from "@/data/products";
import {
  getRelatedProducts,
} from "@/data/products";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle,
  ChevronRight,
  Info,
  Layers,
  MessageSquare,
  Truck,
  X,
} from "lucide-react";

import WholesaleForm  from "@/components/wholesale/WholesaleForm";
import ProductCard  from "@/components/products/ProductCard";
import { Link } from "@/lib/navigation";

type ProductDetailsProps = {
  product: Product;
};

export default function ProductDetails({
  product,
}: ProductDetailsProps) {
  const t = useTranslations();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    null
  );
  const [showWholesaleModal, setShowWholesaleModal] =
    useState(false);

  const relatedProducts = getRelatedProducts(
    product.slug,
    product.category,
    3
  );

  const categoryLabels: Record<Product["category"], string> = {
    "ceiling-fan": t("navCeilingFans"),
    "table-fan": t("navTableFans"),
    "pedestal-fan": t("navPedestalFans"),
  };

  const categoryUrls: Record<Product["category"], string> = {
    "ceiling-fan": "/products?category=ceiling-fan",
    "table-fan": "/products?category=table-fan",
    "pedestal-fan": "/products?category=pedestal-fan",
  };

  const categoryLabel =
    categoryLabels[product.category] || t("category");

  const categoryUrl =
    categoryUrls[product.category] || "/products";

  const whatsappUrl = createProductWhatsAppUrl(
    product.name,
    product.model
  );

  const imageList = product.images?.filter(Boolean) ?? [];

  const activeImage =
    imageList[activeImageIndex] ?? imageList[0] ?? null;

  const specRows = [
    {
      label: t("specSizeSweep"),
      value:
        product.specifications.size ||
        product.specifications.sweep,
    },
    {
      label: t("specRatedSpeed"),
      value: product.specifications.rpm,
    },
    {
      label: t("specPowerInput"),
      value: product.specifications.wattage,
    },
    {
      label: t("specRatedVoltage"),
      value: product.specifications.voltage,
    },
    {
      label: t("specFrequency"),
      value: product.specifications.frequency,
    },
    {
      label: t("specMotorType"),
      value: product.specifications.motorType,
    },
    {
      label: t("specMotorWinding"),
      value: product.specifications.winding,
    },
    {
      label: t("specBlades"),
      value: product.specifications.blades,
    },
    {
      label: t("specAirDelivery"),
      value: product.specifications.airDelivery,
    },
    {
      label: t("specNoise"),
      value: product.specifications.noise,
    },
    {
      label: t("specBodyMaterial"),
      value: product.specifications.bodyMaterial,
    },
    {
      label: t("specBladeMaterial"),
      value: product.specifications.bladeMaterial,
    },
  ].filter((row) => Boolean(row.value));

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* =====================================================
          BREADCRUMB
      ===================================================== */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav
            className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500"
            aria-label="Breadcrumb"
          >
            <Link
              href="/products"
              className="font-semibold transition hover:text-[#0b2f5c]"
            >
              {t("navProducts")}
            </Link>

            <ChevronRight className="h-3.5 w-3.5" />

            <Link
              href={categoryUrl}
              className="font-semibold transition hover:text-[#0b2f5c]"
            >
              {categoryLabel}
            </Link>

            <ChevronRight className="h-3.5 w-3.5" />

            <span className="font-medium text-slate-700">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* =====================================================
          MAIN PRODUCT
      ===================================================== */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* =================================================
                LEFT - PRODUCT GALLERY
            ================================================= */}
            <div className="lg:col-span-6">
              <div className="space-y-4">
                {/* MAIN IMAGE */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {activeImage ? (
                    <Image
                      src={activeImage}
                      alt={product.name}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <ProductImagePlaceholder
                      label={t("productImageComingSoon")}
                    />
                  )}

                  <span className="absolute left-4 top-4 rounded-lg bg-[#07192f] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                    {categoryLabel}
                  </span>

                  {product.featured && (
                    <span className="absolute right-4 top-4 rounded-lg bg-amber-400 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-950 shadow">
                      {t("featured")}
                    </span>
                  )}

                  {/* IMAGE ARROWS */}
                  {imageList.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveImageIndex(
                            activeImageIndex === 0
                              ? imageList.length - 1
                              : activeImageIndex - 1
                          )
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-slate-700 shadow-md backdrop-blur transition hover:bg-white"
                        aria-label={t("previousImage")}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setActiveImageIndex(
                            activeImageIndex ===
                              imageList.length - 1
                              ? 0
                              : activeImageIndex + 1
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-slate-700 shadow-md backdrop-blur transition hover:bg-white"
                        aria-label={t("nextImage")}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* THUMBNAILS */}
                {imageList.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {imageList.map((image, index) => (
                      <button
                        type="button"
                        key={`${image}-${index}`}
                        onClick={() =>
                          setActiveImageIndex(index)
                        }
                        className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                          activeImageIndex === index
                            ? "border-[#0b2f5c] shadow-sm"
                            : "border-slate-200 opacity-70 hover:opacity-100"
                        }`}
                        aria-label={`${product.name} ${index + 1}`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} - ${index + 1}`}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* DISPATCH INFORMATION */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                    <Truck className="h-4 w-4 shrink-0 text-[#0b2f5c]" />
                    <span>{t("panIndiaDispatch")}</span>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                    <Layers className="h-4 w-4 shrink-0 text-[#0b2f5c]" />
                    <span>{t("bulkOrdersAvailable")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                RIGHT - PRODUCT INFORMATION
            ================================================= */}
            <div className="flex flex-col lg:col-span-6">
              {/* BRAND */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#174e8c]">
                  LIMRA INDUSTRY
                </span>

                {product.model && (
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-medium text-slate-600">
                    {t("model")}: {product.model}
                  </span>
                )}
              </div>

              {/* PRODUCT NAME */}
              <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">
                {product.name}
              </h1>

              {/* DESCRIPTION */}
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {product.description ||
                  product.shortDescription}
              </p>

              {/* PRICE */}
              <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    {product.price ? (
                      <div className="flex flex-wrap items-baseline gap-3">
                        <span className="text-3xl font-black text-slate-900">
                          ₹
                          {product.price.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                        {product.mrp &&
                          product.mrp > product.price && (
                            <span className="text-sm text-slate-400 line-through">
                              {t("mrpLabel")} ₹
                              {product.mrp.toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          )}
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-slate-800">
                        {t("onRequest")}
                      </span>
                    )}

                    <p className="mt-1 text-xs text-slate-500">
                      {t("taxesExtraWholesale")}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-lg px-3 py-1.5 text-xs font-bold ${
                      product.available
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {product.available
                      ? t("inStock")
                      : t("onRequest")}
                  </span>
                </div>
              </div>

              {/* COLORS */}
              {product.specifications.colors &&
                product.specifications.colors.length > 0 && (
                  <div className="mt-7">
                    <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-slate-500">
                      {t("availableColors")}
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {product.specifications.colors.map(
                        (color) => (
                          <button
                            type="button"
                            key={color}
                            onClick={() =>
                              setSelectedColor(color)
                            }
                            className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition ${
                              selectedColor === color
                                ? "border-[#0b2f5c] bg-[#0b2f5c] text-white"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                            }`}
                          >
                            {color}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* ACTIONS */}
              <div className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow transition hover:bg-emerald-700"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>{t("topBarWhatsApp")}</span>
                </a>

                <button
                  type="button"
                  onClick={() =>
                    setShowWholesaleModal(true)
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b2f5c] px-5 py-3.5 text-sm font-bold text-white shadow transition hover:bg-[#07192f]"
                >
                  <Building2 className="h-5 w-5" />
                  <span>{t("navGetQuote")}</span>
                </button>
              </div>

              {/* FEATURES */}
              {product.features &&
                product.features.length > 0 && (
                  <div className="mt-8 border-t border-slate-200 pt-6">
                    <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-700">
                      {t("keyHighlights")}
                    </h2>

                    <ul className="space-y-3">
                      {product.features.map(
                        (feature, index) => (
                          <li
                            key={`${feature}-${index}`}
                            className="flex items-start gap-2.5 text-sm leading-6 text-slate-600"
                          >
                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                            <span>{feature}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
            </div>
          </div>

          {/* =================================================
              TECHNICAL SPECIFICATIONS
          ================================================= */}
          {specRows.length > 0 && (
            <section className="mt-12 border-t border-slate-200 pt-10">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  {t("technicalSpecifications")}
                </h2>

                <span className="text-xs text-slate-400">
                  {t("standardTestConditions")}
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-slate-200">
                    {specRows.map((row, index) => (
                      <tr
                        key={row.label}
                        className={
                          index % 2 === 0
                            ? "bg-slate-50/70"
                            : "bg-white"
                        }
                      >
                        <td className="w-1/2 px-4 py-3 font-semibold text-slate-700 sm:w-1/3">
                          {row.label}
                        </td>

                        <td className="px-4 py-3 font-medium text-slate-900">
                          {row.value}
                        </td>
                      </tr>
                    ))}

                    {product.warranty && (
                      <tr className="bg-emerald-50/40">
                        <td className="px-4 py-3 font-semibold text-emerald-900">
                          {t("warranty")}
                        </td>

                        <td className="px-4 py-3 font-bold text-emerald-900">
                          {product.warranty}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <p className="mt-3 flex items-center gap-1 text-[11px] text-slate-400">
                <Info className="h-3.5 w-3.5" />
                {t("specificationsDisclaimer")}
              </p>
            </section>
          )}
        </section>

        {/* =====================================================
            RELATED PRODUCTS
        ===================================================== */}
        {relatedProducts.length > 0 && (
          <section className="mt-14">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {t("relatedProducts")}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {t("relatedProductsDescription")}
                </p>
              </div>

              <Link
                href={categoryUrl}
                className="inline-flex items-center gap-1 text-sm font-bold text-[#0b2f5c] hover:underline"
              >
                {t("viewAllProducts")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((related) => (
                <ProductCard
                  key={related.id}
                  product={related}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* =====================================================
          WHOLESALE MODAL
      ===================================================== */}
      {showWholesaleModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowWholesaleModal(false);
            }
          }}
        >
          <div className="relative my-8 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {t("requestWholesaleQuotation")}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {t("productLabel")}: {product.name}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowWholesaleModal(false)
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label={t("close")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <WholesaleForm
              defaultProduct={`${product.name} (Bulk)`}
            />
          </div>
        </div>
      )}
    </main>
  );
}

/* ============================================================
   PRODUCT IMAGE PLACEHOLDER
============================================================ */

function ProductImagePlaceholder({
  label,
}: {
  label: string;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 text-slate-400">
      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white">
        <Layers className="h-7 w-7" />
      </div>

      <span className="text-xs font-medium">
        {label}
      </span>
    </div>
  );
}

/* ============================================================
   WHATSAPP URL
============================================================ */

function createProductWhatsAppUrl(
  productName: string,
  model?: string
) {
  const number = "910000000000";

  const message = encodeURIComponent(
    [
      "Hello LIMRA INDUSTRY,",
      "",
      "I am interested in this product:",
      `Product: ${productName}`,
      model ? `Model: ${model}` : "",
      "",
      "Please share product details and quotation.",
    ]
      .filter(Boolean)
      .join("\n")
  );

  return `https://wa.me/${number}?text=${message}`;
}