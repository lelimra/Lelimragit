"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/lib/navigation";

import WhatsappIcon from "@mui/icons-material/WhatsApp";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronDown,
  Fan,
  Globe,
  Menu,
  MessageSquare,
  Phone,
  ShieldCheck,
  Wind,
  X,
} from "lucide-react";

import LanguageSwitcher from "../ui/LanguageSwitcher";

const WHATSAPP_NUMBER = "918919854467";

const getGeneralWhatsAppUrl = () => {
  const message = encodeURIComponent(
    "Hello LIMRA INDUSTRY, I would like to enquire about your ceiling, table and pedestal fans."
  );

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
};

export default function Navbar() {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const locale = useLocale();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [isMobileApplicationOpen, setIsMobileApplicationOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  /*
   * Convert:
   * /en/products
   * /hi/products
   * /te/products
   *
   * into:
   * /products
   */
  const currentPath =
    pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProductsOpen(false);
    setIsApplicationOpen(false);
    setIsMobileApplicationOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

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
    currentPath.startsWith("/wholesale") ||
    currentPath.startsWith("/dealers");

  const navItemClass = (path: string) =>
    `rounded-lg px-3.5 py-2 text-sm font-bold tracking-tight transition-all duration-200 ${isActive(path)
      ? "bg-blue-50 text-[#0b2f5c] shadow-sm"
      : "text-slate-600 hover:bg-slate-50 hover:text-[#0b2f5c]"
    }`;

  const applicationNavClass = () =>
    `inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-bold tracking-tight transition-all duration-200 ${isApplicationActive
      ? "bg-blue-50 text-[#0b2f5c] shadow-sm"
      : "text-slate-600 hover:bg-slate-50 hover:text-[#0b2f5c]"
    }`;

  return (
    <>
      {/* =====================================================
          TOP INFORMATION BAR
      ===================================================== */}
      <div className="border-b border-slate-800 bg-[#07192f] px-4 py-2 text-xs text-slate-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          {/* LEFT INFORMATION */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-bold tracking-wider text-white">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              LIMRA INDUSTRY
            </span>

            <span className="hidden text-slate-600 sm:inline">|</span>

            <span className="hidden font-medium text-slate-300 sm:inline">
              {t("certification")}
            </span>
          </div>

          {/* RIGHT QUICK ACTIONS */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* PHONE */}
            <a
              href="tel:+918919854467"
              className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
              aria-label={t("call")}
            >
              <Phone className="h-3.5 w-3.5 text-cyan-400" />

              <span className="hidden font-medium sm:inline">
                +91 89198 54467
              </span>

              <span className="font-medium sm:hidden">{t("call")}</span>
            </a>

            {/* WHATSAPP */}
            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 transition-colors hover:text-emerald-300"
            >
              <WhatsappIcon className="h-3.5 w-3.5" />

              <span className="font-semibold">
                {t("whatsappInquiry")}
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN STICKY HEADER
      ===================================================== */}
      <header
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-all duration-300 ${isScrolled
          ? "border-b border-slate-200 py-2.5 shadow-lg shadow-slate-900/5"
          : "border-b border-slate-200 py-3.5"
          }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-2 sm:px-3 lg:gap-8 lg:px-8">
          {/* =================================================
              LOGO
          ================================================= */}
          <Link
            href="/"
            className="group shrink-0 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b2f5c]"
            aria-label={t("homeAria")}
          >
            <Image
              src="/images/brand/logo.png"
              alt="LIMRA Industry Logo"
              width={200}
              height={80}
              priority
              className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}
          <nav className="hidden shrink-0 items-center space-x-1 lg:flex xl:space-x-2">
            {/* HOME */}
            <Link href="/" className={navItemClass("/")}>
              {t("home")}
            </Link>

            {/* =================================================
                PRODUCTS DROPDOWN
            ================================================= */}
            <div
              className="relative"
              onMouseEnter={() => setIsProductsOpen(true)}
              onMouseLeave={() => setIsProductsOpen(false)}
            >
              <Link
                href="/products"
                className={`${navItemClass(
                  "/products"
                )} inline-flex items-center gap-1.5`}
              >
                <span>{t("products")}</span>

                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isProductsOpen ? "rotate-180" : ""
                    }`}
                />
              </Link>

              {isProductsOpen && (
                <div className="absolute left-0 top-full z-50 mt-1.5 w-72 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2 shadow-2xl shadow-slate-900/10">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {t("fanProductLines")}
                  </div>

                  <div className="space-y-1">
                    {/* ALL PRODUCTS */}
                    <Link
                      href="/products"
                      className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#0b2f5c]"
                    >
                      <span>{t("allProductCatalog")}</span>

                      <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
                    </Link>

                    {/* CEILING FANS */}
                    <Link
                      href="/products?category=ceiling-fan"
                      className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-colors hover:bg-blue-50"
                    >
                      <div className="rounded-lg bg-blue-100 p-2 text-[#0b2f5c] transition-colors group-hover:bg-[#0b2f5c] group-hover:text-white">
                        <Fan className="h-4 w-4" />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {t("ceilingFans")}
                        </div>

                        <div className="text-[11px] text-slate-500">
                          {t("ceilingFansDescription")}
                        </div>
                      </div>
                    </Link>

                    {/* TABLE FANS */}
                    <Link
                      href="/products?category=table-fan"
                      className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-colors hover:bg-blue-50"
                    >
                      <div className="rounded-lg bg-blue-100 p-2 text-[#0b2f5c] transition-colors group-hover:bg-[#0b2f5c] group-hover:text-white">
                        <Wind className="h-4 w-4" />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {t("tableFans")}
                        </div>

                        <div className="text-[11px] text-slate-500">
                          {t("tableFansDescription")}
                        </div>
                      </div>
                    </Link>

                    {/* PEDESTAL FANS */}
                    <Link
                      href="/products?category=pedestal-fan"
                      className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-colors hover:bg-blue-50"
                    >
                      <div className="rounded-lg bg-blue-100 p-2 text-[#0b2f5c] transition-colors group-hover:bg-[#0b2f5c] group-hover:text-white">
                        <ShieldCheck className="h-4 w-4" />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {t("pedestalFans")}
                        </div>

                        <div className="text-[11px] text-slate-500">
                          {t("pedestalFansDescription")}
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* ABOUT */}
            <Link href="/about" className={navItemClass("/about")}>
              {t("about")}
            </Link>

            {/* =================================================
                BUSINESS DROPDOWN
            ================================================= */}
            <div
              className="relative"
              onMouseEnter={() => setIsApplicationOpen(true)}
              onMouseLeave={() => setIsApplicationOpen(false)}
            >
              <button
                type="button"
                className={applicationNavClass()}
                aria-haspopup="true"
                aria-expanded={isApplicationOpen}
              >
                <span>{t("application")}</span>

                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isApplicationOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isApplicationOpen && (
                <div className="absolute left-0 top-full z-50 mt-1.5 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10">
                  {/* DROPDOWN HEADER */}
                  <div className="flex items-center gap-2 px-3 py-2">
                    <BriefcaseBusiness className="h-3.5 w-3.5 text-slate-400" />

                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {t("businessOpportunities")}
                    </span>
                  </div>

                  {/* WHOLESALE */}
                  <Link
                    href="/wholesale"
                    className={`group block rounded-xl px-3.5 py-3 transition-colors ${isActive("/wholesale")
                      ? "bg-blue-50"
                      : "hover:bg-blue-50"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-slate-900">
                        {t("wholesale")}
                      </div>

                      <ArrowUpRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>

                    <div className="mt-0.5 text-[11px] text-slate-500">
                      {t("wholesaleDescription")}
                    </div>
                  </Link>

                  {/* DEALER */}
                  <Link
                    href="/dealers"
                    className={`group mt-1 block rounded-xl px-3.5 py-3 transition-colors ${isActive("/dealers")
                      ? "bg-blue-50"
                      : "hover:bg-blue-50"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-slate-900">
                        {t("dealer")}
                      </div>

                      <ArrowUpRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>

                    <div className="mt-0.5 text-[11px] text-slate-500">
                      {t("dealerDescription")}
                    </div>
                  </Link>

                  {/* DEALER */}
                  <Link
                    href="/dealers"
                    className={`group mt-1 block rounded-xl px-3.5 py-3 transition-colors ${isActive("/dealers")
                      ? "bg-blue-50"
                      : "hover:bg-blue-50"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-slate-900">
                        {t("retailer")}
                      </div>

                      <ArrowUpRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>

                    <div className="mt-0.5 text-[11px] text-slate-500">
                      {t("dealerDescription")}
                    </div>
                  </Link>

                  {/* DEALER */}
                  <Link
                    href="/dealers"
                    className={`group mt-1 block rounded-xl px-3.5 py-3 transition-colors ${isActive("/dealers")
                      ? "bg-blue-50"
                      : "hover:bg-blue-50"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-slate-900">
                        {t("superstocker")}
                      </div>

                      <ArrowUpRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>

                    <div className="mt-0.5 text-[11px] text-slate-500">
                      {t("dealerDescription")}
                    </div>
                  </Link>



                </div>
              )}
            </div>

            {/* CONTACT */}
            <Link href="/contact" className={navItemClass("/contact")}>
              {t("contact")}
            </Link>
          </nav>

          {/* =================================================
    DESKTOP ACTIONS
================================================= */}
          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher />

            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-[#0b2f5c] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#07192f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b2f5c] focus-visible:ring-offset-2"
            >
              {t("quote")}
            </Link>
          </div>

          {/* =================================================
    MOBILE CONTROLS
================================================= */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Only ONE language selector on mobile */}
            <LanguageSwitcher />

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b2f5c] focus-visible:ring-offset-2"
              aria-label={t("toggleNavigation")}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* =====================================================
            MOBILE MENU
        ===================================================== */}
        {isMobileMenuOpen && (
          <div className="absolute inset-x-0 top-full border-b border-slate-200 bg-white px-4 pb-6 pt-4 shadow-2xl lg:hidden">
            <div className="space-y-1.5">
              {/* HOME */}
              <Link
                href="/"
                className={`block rounded-xl px-4 py-3 text-sm font-bold ${isActive("/")
                  ? "bg-blue-50 text-[#0b2f5c]"
                  : "text-slate-700 hover:bg-slate-50"
                  }`}
              >
                {t("home")}
              </Link>

              {/* MOBILE PRODUCTS */}
              <div className="space-y-1 rounded-xl bg-slate-50 p-2">
                <Link
                  href="/products"
                  className="flex items-center justify-between px-3 py-2 text-sm font-bold text-[#0b2f5c]"
                >
                  <span>{t("productsCatalog")}</span>

                  <ArrowUpRight className="h-4 w-4" />
                </Link>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <Link
                    href="/products?category=ceiling-fan"
                    className="rounded-lg border border-slate-200 bg-white p-2.5 text-center text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-blue-50 hover:text-[#0b2f5c]"
                  >
                    {t("ceilingFans")}
                  </Link>

                  <Link
                    href="/products?category=table-fan"
                    className="rounded-lg border border-slate-200 bg-white p-2.5 text-center text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-blue-50 hover:text-[#0b2f5c]"
                  >
                    {t("tableFans")}
                  </Link>

                  <Link
                    href="/products?category=pedestal-fan"
                    className="col-span-2 rounded-lg border border-slate-200 bg-white p-2.5 text-center text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-blue-50 hover:text-[#0b2f5c]"
                  >
                    {t("pedestalFans")}
                  </Link>
                </div>
              </div>

              {/* ABOUT */}
              <Link
                href="/about"
                className={`block rounded-xl px-4 py-3 text-sm font-bold ${isActive("/about")
                  ? "bg-blue-50 text-[#0b2f5c]"
                  : "text-slate-700 hover:bg-slate-50"
                  }`}
              >
                {t("about")}
              </Link>

              {/* MOBILE BUSINESS DROPDOWN */}
              <div className="overflow-hidden rounded-xl">
                <button
                  type="button"
                  onClick={() =>
                    setIsMobileApplicationOpen(!isMobileApplicationOpen)
                  }
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-bold ${isApplicationActive
                    ? "bg-blue-50 text-[#0b2f5c]"
                    : "text-slate-700 hover:bg-slate-50"
                    }`}
                  aria-expanded={isMobileApplicationOpen}
                >
                  <span>{t("application")}</span>

                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${isMobileApplicationOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {isMobileApplicationOpen && (
                  <div className="mt-1 space-y-1 rounded-xl bg-slate-50 p-2">
                    {/* WHOLESALE */}
                    <Link
                      href="/wholesale"
                      className={`block rounded-lg px-4 py-3 ${isActive("/wholesale")
                        ? "bg-white text-[#0b2f5c] shadow-sm"
                        : "text-slate-700 hover:bg-white"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">
                          {t("wholesale")}
                        </span>

                        <ArrowUpRight className="h-4 w-4 text-slate-400" />
                      </div>

                      <p className="mt-1 text-[11px] text-slate-500">
                        {t("wholesaleDescription")}
                      </p>
                    </Link>

                    {/* DEALER */}
                    <Link
                      href="/dealers"
                      className={`block rounded-lg px-4 py-3 ${isActive("/dealers")
                        ? "bg-white text-[#0b2f5c] shadow-sm"
                        : "text-slate-700 hover:bg-white"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">
                          {t("dealer")}
                        </span>

                        <ArrowUpRight className="h-4 w-4 text-slate-400" />
                      </div>

                      <p className="mt-1 text-[11px] text-slate-500">
                        {t("dealerDescription")}
                      </p>
                    </Link>
                  </div>
                )}
              </div>

              {/* CONTACT */}
              <Link
                href="/contact"
                className={`block rounded-xl px-4 py-3 text-sm font-bold ${isActive("/contact")
                  ? "bg-blue-50 text-[#0b2f5c]"
                  : "text-slate-700 hover:bg-slate-50"
                  }`}
              >
                {t("contact")}
              </Link>
            </div>

            {/* =================================================
                MOBILE ACTION BUTTONS
            ================================================= */}
            <div className="mt-4 flex flex-col gap-2.5 border-t border-slate-200 pt-4">
              <Link
                href="/contact"
                className="w-full rounded-xl bg-[#0b2f5c] py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white shadow-md"
              >
                {t("quote")}
              </Link>

              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/50 bg-emerald-50 py-3 text-center text-xs font-bold text-emerald-800"
              >
                <MessageSquare className="h-4 w-4 text-emerald-600" />

                <span>{t("chatWhatsApp")}</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}