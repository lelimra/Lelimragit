"use client";

import Image from "next/image";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import {
  ArrowUpRight,
  Bot,
  Building2,
  ChevronDown,
  Fan,
  FileText,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Wind,
  X,
} from "lucide-react";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import { Link } from "@/lib/navigation";
import { siteConfig } from "@/data/site";

import LanguageSwitcher from "../ui/LanguageSwitcher";
import NavSearchBar from "../common/NavSearchBar";
import { useAIAssistant } from "@/context/AiAssistantContext";
import ThemeToggle from "./ThemeToggle";

/* =========================================================
   BACKEND PRODUCT TYPE
   ---------------------------------------------------------
   The navbar no longer imports the static product catalogue.
   Product data is loaded from the backend API.
========================================================= */

export interface BackendProduct {
  id: string;
  name: string;
  slug: string;
  model?: string;
  category?: string;
  description?: string;

  image?: string;
  images?: string[];

  price?: number | string | null;
  mrp?: number | string | null;

  available?: boolean;
  featured?: boolean;

  warranty?: string | number | null;

  specifications?: Record<string, unknown>;

  [key: string]: unknown;
}

type BackendProductsResponse =
  | BackendProduct[]
  | {
      products?: unknown;
      data?: unknown;
      content?: unknown;
    };

const PRODUCTS_API_URL =
  process.env.NEXT_PUBLIC_PRODUCTS_API_URL || "/api/products";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918919854467";

const GENERAL_WHATSAPP_MESSAGE =
  "Hello LIMRA INDUSTRY, I would like to enquire about your ceiling, table and pedestal fans.";

/* =========================================================
   BACKEND RESPONSE HELPERS
========================================================= */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

function normalizeImage(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (isRecord(value)) {
    return (
      stringValue(value.url) ||
      stringValue(value.src) ||
      stringValue(value.imageUrl) ||
      stringValue(value.path)
    );
  }

  return undefined;
}

function normalizeImages(value: unknown): string[] {
  if (!Array.isArray(value)) {
    const single = normalizeImage(value);
    return single ? [single] : [];
  }

  return value
    .map(normalizeImage)
    .filter((image): image is string => Boolean(image));
}

function normalizeSpecifications(
  value: unknown
): Record<string, unknown> | undefined {
  return isRecord(value) ? value : undefined;
}

function normalizeProduct(
  raw: unknown,
  index: number
): BackendProduct | null {
  if (!isRecord(raw)) {
    return null;
  }

  const id =
    stringValue(raw.id) ||
    stringValue(raw.productId) ||
    stringValue(raw._id) ||
    `backend-product-${index}`;

  const name =
    stringValue(raw.name) ||
    stringValue(raw.productName) ||
    stringValue(raw.title) ||
    stringValue(raw.model) ||
    `Product ${index + 1}`;

  const slug =
    stringValue(raw.slug) ||
    stringValue(raw.productSlug) ||
    id;

  const images = [
    ...normalizeImages(raw.images),
    ...normalizeImages(raw.image),
    ...normalizeImages(raw.imageUrl),
    ...normalizeImages(raw.thumbnail),
  ].filter(
    (image, imageIndex, array) => array.indexOf(image) === imageIndex
  );

  return {
    ...raw,
    id,
    name,
    slug,
    model: stringValue(raw.model),
    category: stringValue(raw.category),
    description: stringValue(raw.description),
    image: images[0],
    images,
    price:
      typeof raw.price === "number" || typeof raw.price === "string"
        ? raw.price
        : null,
    mrp:
      typeof raw.mrp === "number" || typeof raw.mrp === "string"
        ? raw.mrp
        : null,
    available:
      typeof raw.available === "boolean" ? raw.available : undefined,
    featured:
      typeof raw.featured === "boolean" ? raw.featured : undefined,
    warranty:
      typeof raw.warranty === "string" || typeof raw.warranty === "number"
        ? raw.warranty
        : null,
    specifications: normalizeSpecifications(raw.specifications),
  };
}

function extractProductArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isRecord(payload)) {
    return [];
  }

  const candidates = [
    payload.products,
    payload.data,
    payload.content,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }

    if (isRecord(candidate)) {
      const nestedCandidates = [
        candidate.products,
        candidate.data,
        candidate.content,
      ];

      for (const nested of nestedCandidates) {
        if (Array.isArray(nested)) {
          return nested;
        }
      }
    }
  }

  return [];
}

async function fetchProducts(
  signal: AbortSignal
): Promise<BackendProduct[]> {
  const response = await fetch(PRODUCTS_API_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error(
      `Products API request failed with status ${response.status}`
    );
  }

  const payload: unknown =
    (await response.json()) as BackendProductsResponse;

  return extractProductArray(payload)
    .map(normalizeProduct)
    .filter((product): product is BackendProduct => product !== null);
}

/* =========================================================
   WHATSAPP
========================================================= */

const getWhatsAppUrl = () => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    GENERAL_WHATSAPP_MESSAGE
  )}`;
};

/* =========================================================
   NAVBAR
========================================================= */

export default function Navbar() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Navbar");

  const { openAssistant } = useAIAssistant();

  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [isMobileApplicationOpen, setIsMobileApplicationOpen] =
    useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  /* =========================================================
     LOAD PRODUCTS FROM BACKEND
  ========================================================== */

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        const backendProducts = await fetchProducts(controller.signal);

        if (!controller.signal.aborted) {
          setProducts(backendProducts);
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("Navbar: failed to load products", error);
        setProducts([]);
      }
    };

    loadProducts();

    return () => {
      controller.abort();
    };
  }, []);

  /* =========================================================
     SCROLL STATE
  ========================================================== */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =========================================================
     CLOSE MENUS ON ROUTE CHANGE
  ========================================================== */

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
    setIsProductsOpen(false);
    setIsApplicationOpen(false);
    setIsMobileApplicationOpen(false);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  /* =========================================================
     ACTIVE ROUTE
  ========================================================== */

  const currentPath =
    pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }

    return (
      currentPath === path ||
      currentPath.startsWith(`${path}/`) ||
      currentPath.startsWith(`${path}?`)
    );
  };

  const isApplicationActive =
    isActive("/wholesale") || isActive("/dealers");

  /* =========================================================
     MOBILE MENU HELPERS
  ========================================================== */

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
    setIsMobileApplicationOpen(false);
  };

  const openAI = () => {
    openAssistant();
  };

  return (
    <>
      {/* =========================================================
          TOP UTILITY BAR
      ========================================================== */}

      <div className="bg-slate-900 text-slate-300 text-xs py-1 px-2 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Manufacturer information */}
          <div className="flex items-center gap-2 text-[11px] sm:text-xs min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#e31e24] shrink-0" />

            <span className="font-medium text-white whitespace-nowrap">
              {t("directManufacturer")}
            </span>

            <span className="text-slate-500 hidden sm:inline">·</span>

            <span className="text-slate-400 hidden sm:inline">
              {siteConfig.city}
            </span>

            <span className="text-slate-500 hidden md:inline">·</span>

            <span className="text-slate-400 hidden md:inline">
              {t("panIndiaSupply")}
            </span>
          </div>

          {/* Contacts */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 text-xs">
            {/* Phone */}
            <a
              href={`tel:${String(siteConfig.phone || "").replace(
                /[^0-9+]/g,
                ""
              )}`}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
              title={t("callFactory")}
            >
              <Phone className="w-3.5 h-3.5 text-slate-400" />

              <span className="hidden sm:inline font-mono">
                {siteConfig.phone}
              </span>
            </a>

            {/* WhatsApp */}
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />

              <span>{t("whatsappEnquiry")}</span>
            </a>

            {/* Admin */}
            <NextLink
              href="/admin"
              className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded border border-slate-700 transition-all"
              title={t("adminDashboard")}
            >
              <span>🔒 {t("admin")}</span>
            </NextLink>

            {/* Theme */}
            <div className="hidden z-[100] sm:block pl-2 border-l border-slate-700">
              <ThemeToggle />
            </div>

            {/* Language */}
            <div className="hidden z-[100] sm:block pl-2 border-l border-slate-700">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          MAIN HEADER
      ========================================================== */}

      <header
        className={`sticky top-0 z-50 transition-all duration-200 bg-white/95 backdrop-blur-md ${
          isScrolled
            ? "shadow-sm border-b border-slate-200 py-3"
            : "border-b border-slate-200 py-2"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* ===================================================
                LOGO
            ==================================================== */}

            <Link
              href="/"
              className="flex items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#091a32] rounded"
              aria-label={t("homeAria")}
            >
              <Image
                src="/images/brand/logo.png"
                alt="LE LIMRA"
                width={100}
                height={30}
                priority
                className="h-auto w-[70px] sm:w-[80px] lg:w-[100px]"
              />
            </Link>

            {/* ===================================================
                DESKTOP NAVIGATION
            ==================================================== */}

            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {/* Home */}
              <Link
                href="/"
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                  isActive("/")
                    ? "text-[#091a32] font-semibold bg-slate-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {t("home")}
              </Link>

              {/* =================================================
                  PRODUCTS
              ================================================== */}

              <div
                className="relative"
                onMouseEnter={() => setIsProductsOpen(true)}
                onMouseLeave={() => setIsProductsOpen(false)}
              >
                <Link
                  href="/products"
                  className={`px-3 py-2 text-sm font-medium inline-flex items-center gap-1.5 rounded-md transition-colors ${
                    isActive("/products")
                      ? "text-[#091a32] font-semibold bg-slate-100"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                  onClick={() => setIsProductsOpen(false)}
                >
                  <span>{t("products")}</span>

                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                      isProductsOpen ? "rotate-180" : ""
                    }`}
                  />
                </Link>

                {isProductsOpen && (
                  <div
                    className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 mt-1 animate-in fade-in-50 duration-150 z-50"
                    onMouseEnter={() => setIsProductsOpen(true)}
                    onMouseLeave={() => setIsProductsOpen(false)}
                  >
                    {/* All Products */}
                    <Link
                      href="/products"
                      onClick={() => setIsProductsOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-xs font-bold text-slate-900 hover:bg-slate-50 border-b border-slate-100"
                    >
                      <span>{t("allProductCatalog")}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>

                    {/* Ceiling */}
                    <Link
                      href="/products?category=ceiling-fan"
                      onClick={() => setIsProductsOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#091a32]"
                    >
                      <Fan className="w-4 h-4 text-[#091a32]" />

                      <div>
                        <div className="font-semibold">
                          {t("ceilingFans")}
                        </div>

                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {t("ceilingFansDescription")}
                        </div>
                      </div>
                    </Link>

                    {/* Table */}
                    <Link
                      href="/products?category=table-fan"
                      onClick={() => setIsProductsOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#091a32]"
                    >
                      <Wind className="w-4 h-4 text-[#091a32]" />

                      <div>
                        <div className="font-semibold">
                          {t("tableFans")}
                        </div>

                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {t("tableFansDescription")}
                        </div>
                      </div>
                    </Link>

                    {/* Pedestal */}
                    <Link
                      href="/products?category=pedestal-fan"
                      onClick={() => setIsProductsOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#091a32]"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#091a32]" />

                      <div>
                        <div className="font-semibold">
                          {t("pedestalFans")}
                        </div>

                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {t("pedestalFansDescription")}
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* =================================================
                  APPLICATIONS
              ================================================== */}

              <div
                className="relative"
                onMouseEnter={() => setIsApplicationOpen(true)}
                onMouseLeave={() => setIsApplicationOpen(false)}
              >
                <Link
                  href="/wholesale"
                  className={`px-3 py-2 text-sm font-medium inline-flex items-center gap-1.5 rounded-md transition-colors ${
                    isApplicationActive
                      ? "text-[#091a32] font-semibold bg-slate-100"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>{t("application")}</span>

                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                      isApplicationOpen ? "rotate-180" : ""
                    }`}
                  />
                </Link>

                {isApplicationOpen && (
                  <div
                    className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-lg border border-slate-200 py-2 mt-1 animate-in fade-in-50 duration-150 z-50"
                    onMouseEnter={() => setIsApplicationOpen(true)}
                    onMouseLeave={() => setIsApplicationOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        {t("businessOpportunities")}
                      </div>
                    </div>

                    {/* Wholesale */}
                    <Link
                      href="/wholesale"
                      onClick={() => setIsApplicationOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50"
                    >
                      <Building2 className="w-4 h-4 mt-0.5 text-[#091a32]" />

                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          {t("wholesale")}
                        </div>

                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {t("wholesaleDescription")}
                        </div>
                      </div>
                    </Link>

                    {/* Dealer */}
                    <Link
                      href="/dealers?role=Dealer"
                      onClick={() => setIsApplicationOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50"
                    >
                      <FileText className="w-4 h-4 mt-0.5 text-[#091a32]" />

                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          {t("dealer")}
                        </div>

                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {t("dealerDescription")}
                        </div>
                      </div>
                    </Link>

                    {/* Retailer */}
                    <Link
                      href="/dealers?role=Retailer"
                      onClick={() => setIsApplicationOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50"
                    >
                      <Building2 className="w-4 h-4 mt-0.5 text-[#091a32]" />

                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          {t("retailer")}
                        </div>

                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {t("retailerDescription")}
                        </div>
                      </div>
                    </Link>

                    {/* Super Stockist */}
                    <Link
                      href="/dealers?role=Super+Stockist"
                      onClick={() => setIsApplicationOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50"
                    >
                      <ShieldCheck className="w-4 h-4 mt-0.5 text-[#091a32]" />

                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          {t("superstocker")}
                        </div>

                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {t("superstockerDescription")}
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* About */}
              <Link
                href="/about"
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                  isActive("/about")
                    ? "text-[#091a32] font-semibold bg-slate-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {t("about")}
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                  isActive("/contact")
                    ? "text-[#091a32] font-semibold bg-slate-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {t("contact")}
              </Link>
            </nav>

            {/* ===================================================
                DESKTOP ACTIONS
            ==================================================== */}

            <div className="hidden lg:flex items-center gap-2.5">
              {/* Search */}
              <NavSearchBar
                variant="navbar"
                className="w-40 xl:w-48"
                products={products}
              />

              {/* AI */}
              <button
                type="button"
                onClick={openAI}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#091a32] text-xs font-bold transition-colors shrink-0 border border-slate-200 shadow-2xs group"
                title={t("aiAssistantTitle")}
                aria-label={t("aiAssistantAria")}
              >
                <Bot className="w-3.5 h-3.5 text-[#e31e24] group-hover:rotate-12 transition-transform" />

                <span>{t("aiAssist")}</span>

                <Sparkles className="w-3 h-3 text-amber-500" />
              </button>

              {/* Stockist */}
              <Link
                href="/dealers?role=Super+Stockist"
                className="bg-[#e31e24] hover:bg-[#c4181d] text-white px-3.5 py-2 rounded-lg text-xs font-bold tracking-wide shadow-xs transition-colors shrink-0 inline-flex items-center gap-1.5"
              >
                <span>{t("applyAsStockist")}</span>

                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* ===================================================
                MOBILE CONTROLS
            ==================================================== */}

            <div className="flex items-center lg:hidden gap-1.5">
              {/* AI */}
              <button
                type="button"
                onClick={openAI}
                className="p-2 rounded-md text-[#091a32] bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1"
                aria-label={t("aiAssistantAria")}
                title={t("aiAssistantTitle")}
              >
                <Bot className="w-4 h-4 text-[#e31e24]" />

                <span className="text-[10px] font-extrabold uppercase">
                  AI
                </span>
              </button>

              {/* Search */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileSearchOpen((prev) => !prev);

                  if (isMobileMenuOpen) {
                    setIsMobileMenuOpen(false);
                  }
                }}
                className={`p-2 rounded-md transition-colors ${
                  isMobileSearchOpen
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-700 hover:text-slate-900"
                }`}
                aria-label={t("searchFans")}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Language */}
              <LanguageSwitcher />

              {/* Hamburger */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen((prev) => !prev);

                  if (isMobileSearchOpen) {
                    setIsMobileSearchOpen(false);
                  }
                }}
                className="p-2 rounded-md text-slate-700 hover:text-slate-900"
                aria-label={t("toggleNavigation")}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* =====================================================
              MOBILE SEARCH
          ====================================================== */}

          {isMobileSearchOpen && (
            <div className="lg:hidden border-t border-slate-200 bg-slate-50 px-0 py-3 mt-3 animate-in slide-in-from-top-2 duration-150">
              <NavSearchBar
                variant="mobile"
                products={products}
                onCloseMobile={() => setIsMobileSearchOpen(false)}
              />
            </div>
          )}

          {/* =====================================================
              MOBILE MENU
          ====================================================== */}

          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-slate-200 bg-white pt-4 pb-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
              {/* Home */}
              <Link
                href="/"
                onClick={closeMobileMenu}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive("/")
                    ? "bg-slate-100 text-[#091a32] font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {t("home")}
              </Link>

              {/* Products */}
              <div className="space-y-1 pt-1">
                <Link
                  href="/products"
                  onClick={closeMobileMenu}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive("/products")
                      ? "bg-slate-100 text-[#091a32] font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {t("allProductCatalog")}
                </Link>

                <div className="pl-4 space-y-1 border-l-2 border-slate-100 ml-3">
                  <Link
                    href="/products?category=ceiling-fan"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 text-xs text-slate-600 hover:text-[#091a32]"
                  >
                    {t("ceilingFans")}
                  </Link>

                  <Link
                    href="/products?category=table-fan"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 text-xs text-slate-600 hover:text-[#091a32]"
                  >
                    {t("tableFans")}
                  </Link>

                  <Link
                    href="/products?category=pedestal-fan"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 text-xs text-slate-600 hover:text-[#091a32]"
                  >
                    {t("pedestalFans")}
                  </Link>
                </div>
              </div>

              {/* Applications */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() =>
                    setIsMobileApplicationOpen((prev) => !prev)
                  }
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isApplicationActive
                      ? "bg-slate-100 text-[#091a32] font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                  aria-expanded={isMobileApplicationOpen}
                >
                  <span>{t("application")}</span>

                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isMobileApplicationOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isMobileApplicationOpen && (
                  <div className="pl-4 ml-3 mt-1 space-y-1 border-l-2 border-slate-100">
                    <Link
                      href="/wholesale"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 text-xs text-slate-600 hover:text-[#091a32]"
                    >
                      {t("wholesale")}
                    </Link>

                    <Link
                      href="/dealers?role=Dealer"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 text-xs text-slate-600 hover:text-[#091a32]"
                    >
                      {t("dealer")}
                    </Link>

                    <Link
                      href="/dealers?role=Retailer"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 text-xs text-slate-600 hover:text-[#091a32]"
                    >
                      {t("retailer")}
                    </Link>

                    <Link
                      href="/dealers?role=Super+Stockist"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 text-xs text-slate-600 hover:text-[#091a32]"
                    >
                      {t("superstocker")}
                    </Link>
                  </div>
                )}
              </div>

              {/* About */}
              <Link
                href="/about"
                onClick={closeMobileMenu}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive("/about")
                    ? "bg-slate-100 text-[#091a32] font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {t("about")}
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                onClick={closeMobileMenu}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive("/contact")
                    ? "bg-slate-100 text-[#091a32] font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {t("contact")}
              </Link>

              {/* =================================================
                  MOBILE ACTIONS
              ================================================== */}

              <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
                {/* AI */}
                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    openAI();
                  }}
                  className="w-full bg-[#091a32] hover:bg-[#0d274c] text-white text-center py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Bot className="w-4 h-4 text-[#e31e24]" />

                  <span>{t("askLimraAI")}</span>

                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </button>

                {/* Super Stockist */}
                <Link
                  href="/dealers?role=Super+Stockist"
                  onClick={closeMobileMenu}
                  className="w-full bg-[#e31e24] hover:bg-[#c4181d] text-white text-center py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
                >
                  <span>{t("applyForSuperStockist")}</span>

                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>

                {/* WhatsApp */}
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
                >
                  <WhatsAppIcon className="w-4 h-4" />

                  <span>{t("whatsappEnquiry")}</span>
                </a>

                {/* Call */}
                <a
                  href={`tel:${String(siteConfig.phone || "").replace(
                    /[^0-9+]/g,
                    ""
                  )}`}
                  className="w-full border border-slate-200 bg-white hover:bg-slate-50 text-[#091a32] text-center py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />

                  <span>{t("call")}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
