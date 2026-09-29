"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Search,
  SlidersHorizontal,
  X,
  Fan,
  Wind,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { products, ProductCategory } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";
import DownloadCatalogue from "../common/DownloadCatalogue";

interface ProductsPageProps {
  initialCategory?: ProductCategory;
}

export default function ProductsPage({
  initialCategory,
}: ProductsPageProps) {
  const t = useTranslations();

  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategory | "all"
  >(initialCategory ?? "all");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSize, setSelectedSize] = useState("all");

  const [priceSort, setPriceSort] = useState<
    "default" | "low-high" | "high-low"
  >("default");

  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // =====================================================
  // CATEGORY LABELS
  // =====================================================

  const categoryTitles = {
    all: t("navAllProducts"),
    "ceiling-fan": t("navCeilingFans"),
    "table-fan": t("navTableFans"),
    "pedestal-fan": t("navPedestalFans"),
  };

  // =====================================================
  // AVAILABLE PRODUCT SIZES
  // =====================================================

  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();

    products.forEach((product) => {
      if (product.specifications.size) {
        sizes.add(product.specifications.size);
      }
    });

    return Array.from(sizes).sort();
  }, []);

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      // Category
      if (
        selectedCategory !== "all" &&
        product.category !== selectedCategory
      ) {
        return false;
      }

      // Size
      if (
        selectedSize !== "all" &&
        product.specifications.size !== selectedSize
      ) {
        return false;
      }

      // Featured
      if (featuredOnly && !product.featured) {
        return false;
      }

      // Availability
      if (inStockOnly && !product.available) {
        return false;
      }

      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();

        const matchesName = product.name.toLowerCase().includes(query);
        const matchesModel = product.model?.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesDescription = product.shortDescription
          .toLowerCase()
          .includes(query);
        const matchesFeatures = product.features.some((feature) =>
          feature.toLowerCase().includes(query)
        );

        if (
          !matchesName &&
          !matchesModel &&
          !matchesCategory &&
          !matchesDescription &&
          !matchesFeatures
        ) {
          return false;
        }
      }

      return true;
    });

    // =====================================================
    // PRICE SORTING
    // =====================================================

    if (priceSort === "low-high") {
      return result.sort(
        (a, b) => (a.price ?? 999999) - (b.price ?? 999999)
      );
    }

    if (priceSort === "high-low") {
      return result.sort(
        (a, b) => (b.price ?? 0) - (a.price ?? 0)
      );
    }

    return result;
  }, [
    selectedCategory,
    selectedSize,
    searchQuery,
    priceSort,
    featuredOnly,
    inStockOnly,
  ]);

  // =====================================================
  // RESET FILTERS
  // =====================================================

  const resetFilters = () => {
    setSelectedCategory(initialCategory ?? "all");
    setSelectedSize("all");
    setSearchQuery("");
    setPriceSort("default");
    setFeaturedOnly(false);
    setInStockOnly(false);
  };

  const hasActiveFilters =
    selectedCategory !== (initialCategory ?? "all") ||
    selectedSize !== "all" ||
    searchQuery !== "" ||
    priceSort !== "default" ||
    featuredOnly ||
    inStockOnly;

  const pageTitle = categoryTitles[selectedCategory];

  return (
    <main className="min-h-screen bg-slate-50/70 pb-24">

   {/* =====================================================
          PAGE HEADER / HERO SECTION
      ===================================================== */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-white shadow-2xs">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>{t("Navbar.home")}</span>
            </Link>

            <span className="text-slate-300" aria-hidden="true">/</span>

            <span className="rounded-md bg-slate-100/60 px-2 py-1 font-semibold text-slate-800" aria-current="page">
              {pageTitle}
            </span>
          </nav>

          {/* 2-Column Main Row */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            
            {/* Left Column: Title, Description, Search, & Category Tabs (Span 8) */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  {pageTitle}
                </h1>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  {t("productsPageDescription")}
                </p>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("productsSearchPlaceholder")}
                  className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-2.5 pl-10 pr-9 text-xs font-medium text-slate-800 outline-none transition-all focus:border-[#0b2f5c] focus:bg-white focus:ring-2 focus:ring-[#0b2f5c]/10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Category Pill Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {[
                  ["all", t("navAllProducts"), Sparkles],
                  ["ceiling-fan", t("navCeilingFans"), Fan],
                  ["table-fan", t("navTableFans"), Wind],
                  ["pedestal-fan", t("navPedestalFans"), ShieldCheck],
                ].map(([id, label, Icon]) => {
                  const categoryId = id as string;
                  const categoryLabel = label as string;
                  const IconComp = Icon as any;
                  const isActive = selectedCategory === categoryId;

                  return (
                    <button
                      key={categoryId}
                      onClick={() => setSelectedCategory(categoryId as any)}
                      className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200 active:scale-95 ${
                        isActive
                          ? "bg-slate-900 text-white shadow-sm"
                          : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <IconComp className={`h-3.5 w-3.5 ${isActive ? "text-sky-400" : "text-slate-400"}`} />
                      <span>{categoryLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Quick Actions / Badges (Span 4) */}
            <div className="lg:col-span-4 flex flex-row lg:flex-col lg:items-end justify-start gap-2.5">
              <span className="inline-flex items-center rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-600 border border-slate-200/80">
                {t("productsShowing", {
                  count: filteredProducts.length,
                  total: products.length,
                })}
              </span>

              <Link
                href="/wholesale"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0b2f5c] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#082243] active:scale-95"
              >
                {t("navGetQuote")}
              </Link>

              <DownloadCatalogue />
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          SEARCH + CONTROLS BAR
      ===================================================== */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs md:flex-row md:items-center md:justify-between">

        

          {/* Sorting & Filter Toggle */}
          <div className="flex items-center gap-2.5">
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value as any)}
              className="rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none transition-all hover:bg-slate-50 focus:border-[#0b2f5c] focus:ring-2 focus:ring-[#0b2f5c]/10"
            >
              <option value="default">{t("sortDefault")}</option>
              <option value="low-high">{t("sortPriceLowHigh")}</option>
              <option value="high-low">{t("sortPriceHighLow")}</option>
            </select>

            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all lg:hidden ${
                isFilterOpen
                  ? "border-[#0b2f5c] bg-[#0b2f5c] text-white"
                  : "border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>{t("filters")}</span>
            </button>
          </div>
        </div>

        {/* =====================================================
            MAIN GRID & SIDEBAR
        ===================================================== */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">

          {/* =====================================================
              FILTER SIDEBAR
          ===================================================== */}
          <aside
            className={`lg:col-span-1 ${
              isFilterOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="sticky top-24 space-y-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  <SlidersHorizontal className="h-4 w-4 text-[#0b2f5c]" />
                  <span>{t("filterProducts")}</span>
                </span>

                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0b2f5c] transition-colors hover:text-sky-800"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>{t("reset")}</span>
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <label className="mb-2.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  {t("category")}
                </label>
                <div className="space-y-2 text-xs font-medium">
                  {[
                    ["all", t("navAllProducts")],
                    ["ceiling-fan", t("navCeilingFans")],
                    ["table-fan", t("navTableFans")],
                    ["pedestal-fan", t("navPedestalFans")],
                  ].map(([id, label]) => (
                    <label
                      key={id}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-50 text-slate-700"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === id}
                        onChange={() => setSelectedCategory(id as any)}
                        className="h-4 w-4 accent-[#0b2f5c]"
                      />
                      <span className={selectedCategory === id ? "font-bold text-slate-900" : ""}>
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              {availableSizes.length > 0 && (
                <div className="border-t border-slate-100 pt-4">
                  <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    {t("sweepSize")}
                  </label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#0b2f5c] focus:bg-white"
                  >
                    <option value="all">{t("allSizes")}</option>
                    {availableSizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Preferences / Checkboxes */}
              <div className="space-y-2.5 border-t border-slate-100 pt-4">
                <label className="mb-2.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  {t("preferences")}
                </label>

                <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={featuredOnly}
                    onChange={(e) => setFeaturedOnly(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#0b2f5c]"
                  />
                  <span>{t("featuredOnly")}</span>
                </label>

                <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#0b2f5c]"
                  />
                  <span>{t("inStockOnly")}</span>
                </label>
              </div>

              {/* Bulk Note Card */}
              <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-3.5 text-[11px] leading-relaxed text-slate-600">
                <span className="mb-1 block font-bold text-[#0b2f5c]">
                  {t("bulkQuantities")}
                </span>
                {t("bulkQuantitiesDescription")}
              </div>

            </div>
          </aside>

          {/* =====================================================
              PRODUCT CARDS GRID AREA
          ===================================================== */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-16 text-center shadow-xs">
                <Search className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                <h3 className="text-base font-bold text-slate-900">
                  {t("noProductsFound")}
                </h3>
                <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">
                  {t("noProductsFoundDescription")}
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0b2f5c] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-transform active:scale-95"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{t("resetAllFilters")}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}