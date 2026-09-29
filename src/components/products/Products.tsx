"use client";

import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  Fan,
  Wind,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { products, ProductCategory } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";
import DownloadCatalogue from "../common/DownloadCatalogue";

export default function Products() {
  const t = useTranslations();

  // =====================================================
  // FILTER STATE
  // =====================================================

  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategory | "all"
  >("all");

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

  const categoryTitles: Record<
    ProductCategory | "all",
    string
  > = {
    all: t("navAllProducts"),
    "ceiling-fan": t("navCeilingFans"),
    "table-fan": t("navTableFans"),
    "pedestal-fan": t("navPedestalFans"),
  };

  // =====================================================
  // AVAILABLE SIZES
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
      // -------------------------------------------------
      // CATEGORY
      // -------------------------------------------------

      if (
        selectedCategory !== "all" &&
        product.category !== selectedCategory
      ) {
        return false;
      }

      // -------------------------------------------------
      // SIZE
      // -------------------------------------------------

      if (
        selectedSize !== "all" &&
        product.specifications.size !== selectedSize
      ) {
        return false;
      }

      // -------------------------------------------------
      // FEATURED
      // -------------------------------------------------

      if (featuredOnly && !product.featured) {
        return false;
      }

      // -------------------------------------------------
      // AVAILABILITY
      // -------------------------------------------------

      if (inStockOnly && !product.available) {
        return false;
      }

      // -------------------------------------------------
      // SEARCH
      // -------------------------------------------------

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();

        const matchesName = product.name
          .toLowerCase()
          .includes(query);

        const matchesModel =
          product.model?.toLowerCase().includes(query) ?? false;

        const matchesCategory = product.category
          .toLowerCase()
          .includes(query);

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
    setSelectedCategory("all");
    setSelectedSize("all");
    setSearchQuery("");
    setPriceSort("default");
    setFeaturedOnly(false);
    setInStockOnly(false);
  };

  // =====================================================
  // ACTIVE FILTER CHECK
  // =====================================================

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedSize !== "all" ||
    searchQuery !== "" ||
    priceSort !== "default" ||
    featuredOnly ||
    inStockOnly;

  // =====================================================
  // PAGE TITLE
  // =====================================================

  const pageTitle = categoryTitles[selectedCategory];

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="min-h-screen bg-slate-50 pb-20">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 pb-8 pt-5 sm:px-6 lg:px-8">

          {/* Breadcrumb */}

          <div className="text-xs text-slate-500">

            <a
              href="/"
              className="transition-colors hover:text-[#174e8c]"
            >
              {t("Navbar.home")}
            </a>

            <span className="mx-2">/</span>

            <span className="font-medium text-slate-700">
              {pageTitle}
            </span>
          < DownloadCatalogue/>

          </div>


          {/* Header */}

          <div className="mt-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>

              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                {pageTitle}
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                {t("productsPageDescription")}
              </p>

            </div>

            <div className="flex items-center gap-2">

              <span className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                {t("productsShowing", {
                  count: filteredProducts.length,
                  total: products.length,
                })}
              </span>

            </div>

          </div>

          {/* =================================================
              CATEGORY TABS
          ================================================= */}

          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">

            {/* ALL */}

            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`shrink-0 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                selectedCategory === "all"
                  ? "bg-[#0b2f5c] text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {t("navAllProducts")}
            </button>

            {/* CEILING */}

            <button
              type="button"
              onClick={() => setSelectedCategory("ceiling-fan")}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                selectedCategory === "ceiling-fan"
                  ? "bg-[#0b2f5c] text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Fan className="h-3.5 w-3.5" />

              {t("navCeilingFans")}
            </button>

            {/* TABLE */}

            <button
              type="button"
              onClick={() => setSelectedCategory("table-fan")}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                selectedCategory === "table-fan"
                  ? "bg-[#0b2f5c] text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Wind className="h-3.5 w-3.5" />

              {t("navTableFans")}
            </button>

            {/* PEDESTAL */}

            <button
              type="button"
              onClick={() => setSelectedCategory("pedestal-fan")}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                selectedCategory === "pedestal-fan"
                  ? "bg-[#0b2f5c] text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />

              {t("navPedestalFans")}
            </button>

          </div>

        </div>

      </section>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">

        {/* =================================================
            SEARCH BAR
        ================================================= */}

        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:p-4 md:flex-row md:items-center md:justify-between">

          {/* Search */}

          <div className="relative flex-1">

            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder={t("productsSearchPlaceholder")}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-9 text-sm outline-none transition focus:ring-2 focus:ring-[#0b2f5c]"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}

          </div>

          {/* Sort / Mobile Filter */}

          <div className="flex items-center gap-2">

            <select
              value={priceSort}
              onChange={(event) =>
                setPriceSort(
                  event.target.value as
                    | "default"
                    | "low-high"
                    | "high-low"
                )
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#0b2f5c]"
            >
              <option value="default">
                {t("sortDefault")}
              </option>

              <option value="low-high">
                {t("sortPriceLowHigh")}
              </option>

              <option value="high-low">
                {t("sortPriceHighLow")}
              </option>

            </select>

            <button
              type="button"
              onClick={() =>
                setIsFilterOpen(!isFilterOpen)
              }
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold lg:hidden ${
                hasActiveFilters
                  ? "border-[#0b2f5c] bg-[#0b2f5c] text-white"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />

              {t("filters")}
            </button>

          </div>

        </div>

        {/* =================================================
            SIDEBAR + PRODUCTS
        ================================================= */}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">

          {/* =================================================
              FILTER SIDEBAR
          ================================================= */}

          <aside
            className={`lg:col-span-1 ${
              isFilterOpen ? "block" : "hidden lg:block"
            }`}
          >

            <div className="sticky top-24 space-y-6 rounded-xl border border-slate-200 bg-white p-5">

              {/* Filter Header */}

              <div className="flex items-center justify-between border-b border-slate-100 pb-3">

                <span className="flex items-center gap-1.5 text-sm font-bold text-slate-900">

                  <SlidersHorizontal className="h-4 w-4 text-[#0b2f5c]" />

                  {t("filterProducts")}

                </span>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-xs font-semibold text-[#0b2f5c] hover:underline"
                  >
                    <RotateCcw className="h-3 w-3" />

                    {t("reset")}
                  </button>
                )}

              </div>

              {/* =================================================
                  CATEGORY FILTER
              ================================================= */}

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t("category")}
                </label>

                <div className="space-y-2 text-xs">

                  {(
                    [
                      ["all", t("navAllProducts")],
                      ["ceiling-fan", t("navCeilingFans")],
                      ["table-fan", t("navTableFans")],
                      ["pedestal-fan", t("navPedestalFans")],
                    ] as const
                  ).map(([id, label]) => (

                    <label
                      key={id}
                      className="flex cursor-pointer items-center gap-2 text-slate-700"
                    >

                      <input
                        type="radio"
                        name="product-category"
                        checked={selectedCategory === id}
                        onChange={() =>
                          setSelectedCategory(id)
                        }
                      />

                      <span>{label}</span>

                    </label>

                  ))}

                </div>

              </div>

              {/* =================================================
                  SIZE FILTER
              ================================================= */}

              {availableSizes.length > 0 && (

                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    {t("sweepSize")}
                  </label>

                  <select
                    value={selectedSize}
                    onChange={(event) =>
                      setSelectedSize(event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-[#0b2f5c]"
                  >

                    <option value="all">
                      {t("allSizes")}
                    </option>

                    {availableSizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}

                  </select>

                </div>

              )}

              {/* =================================================
                  PREFERENCES
              ================================================= */}

              <div className="space-y-2 border-t border-slate-100 pt-3">

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t("preferences")}
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700">

                  <input
                    type="checkbox"
                    checked={featuredOnly}
                    onChange={(event) =>
                      setFeaturedOnly(event.target.checked)
                    }
                  />

                  {t("featuredOnly")}

                </label>

                <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700">

                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(event) =>
                      setInStockOnly(event.target.checked)
                    }
                  />

                  {t("inStockOnly")}

                </label>

              </div>

              {/* =================================================
                  BULK ORDER NOTE
              ================================================= */}

              <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-3 text-[11px] leading-relaxed text-slate-600">

                <span className="mb-1 block font-bold text-[#0b2f5c]">
                  {t("bulkQuantities")}
                </span>

                {t("bulkQuantitiesDescription")}

              </div>

            </div>

          </aside>

          {/* =================================================
              PRODUCT GRID
          ================================================= */}

          <div className="lg:col-span-3">

            {filteredProducts.length === 0 ? (

              /* =================================================
                 EMPTY STATE
              ================================================= */

              <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">

                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">

                  <Search className="h-6 w-6" />

                </div>

                <h3 className="text-base font-bold text-slate-800">
                  {t("noProductsFound")}
                </h3>

                <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
                  {t("noProductsFoundDescription")}
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#0b2f5c] px-4 py-2 text-xs font-bold text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />

                  {t("resetAllFilters")}
                </button>

              </div>

            ) : (

              /* =================================================
                 PRODUCT CARDS
              ================================================= */

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">

                {filteredProducts.map((product) => (

                  <ProductCard
                    key={product.id}
                    product={product}
                  />

                ))}

              </div>

            )}

          </div>

        </div>

      </section>

    </main>
  );
}