"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "@/lib/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Product } from "@/types/product";
import { getProductEnquiryWhatsAppUrl } from "@/utils/whatsapp";
import WhatsappIcon from "@mui/icons-material/WhatsApp";

import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap,
  Gauge,
  Wind,
  CheckCircle2,
  Pause,
  Play,
  Factory,
  Layers,
} from "lucide-react";
export interface HeroSlide {
  id: string;
  type: "new-arrival" | "best-seller" | "featured";
  badge: string;
  badgeIcon: React.ElementType;
  badgeColor: string;
  title: string;
  subtitle: string;
  description: string;
  modelCode: string;
  productSlug?: string;
  price?: number;
  mrp?: number;
  discountPercentage?: number;
  specs: {
    label: string;
    value: string;
    icon: React.ElementType;
  }[];
  colors?: { name: string; hex?: string }[];
  image: string | null;
  secondaryImage?: string;
  ctaPrimary: {
    label: string;
    link: string;
  };
  ctaSecondary?: {
    label: string;
    link: string;
    isWhatsApp?: boolean;
  };
}
export const HeroCarousel: React.FC<{ products: Product[] }> = ({ products }) => {
  const t = useTranslations();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [slideProgress, setSlideProgress] = useState(0);
  /* ============================================================
   * BACKEND-DRIVEN HERO DATA
   * ============================================================
   *
   * Exactly four active products are selected from the backend.
   * Featured products are preferred, then the remaining active
   * products follow the order supplied by the backend.
   *
   * No product name, slug, specification, price, image, warranty,
   * description, or color is hardcoded here.
   */
  const getProductImage = (product: Product): string | null => {
    const image = product.images?.find((value) => typeof value === "string" && value.trim().length > 0);
    return image ? image.trim() : null;
  };
  const getSpec = (
    product: Product,
    key: keyof Product["specifications"],
  ): string => {
    const value = product.specifications?.[key];
    if (value === undefined || value === null) {
      return "—";
    }
    const normalized = String(value).trim();
    return normalized || "—";
  };
  const getCategoryLabel = (product: Product): string => {
    switch (product.category) {
      case "ceiling-fan":
        return t("navCeilingFans");
      case "table-fan":
        return t("navTableFans");
      case "pedestal-fan":
        return t("navPedestalFans");
      default:
        return product.category;
    }
  };
  const getBadgeIcon = (product: Product): React.ElementType => {
    if (product.featured) {
      return Flame;
    }
    switch (product.category) {
      case "table-fan":
        return Zap;
      case "pedestal-fan":
        return Wind;
      case "ceiling-fan":
      default:
        return Sparkles;
    }
  };
  const getBadgeColor = (product: Product): string => {
    return product.featured
      ? "bg-[#e31e24] text-white"
      : "bg-[#091a32] text-white border border-slate-700";
  };
  const getDynamicSpecs = (product: Product) => [
    {
      label: t("HeroCarousel.specs.ratedSpeed"),
      value: getSpec(product, "rpm"),
      icon: Gauge,
    },
    {
      label: t("HeroCarousel.specs.powerInput"),
      value: getSpec(product, "wattage"),
      icon: Zap,
    },
    {
      label: t("HeroCarousel.specs.sweepSize"),
      value:
        getSpec(product, "sweep") !== "—"
          ? getSpec(product, "sweep")
          : getSpec(product, "size"),
      icon: Layers,
    },
    {
      label: t("HeroCarousel.specs.warranty"),
      value: product.warranty?.trim() || "—",
      icon: ShieldCheck,
    },
  ];
  const availableProducts = [...products]
    .filter((product) => product.available)
    .sort((a, b) => {
      if (a.featured !== b.featured) {
        return Number(b.featured) - Number(a.featured);
      }
      return 0;
    });
  const selectedProducts = availableProducts.slice(0, 4);
  const heroSlides: HeroSlide[] = selectedProducts.map(
    (product, index) => {
      const primaryImage = getProductImage(product);
      const secondaryImage = product.images?.find(
        (image) =>
          typeof image === "string" &&
          image.trim().length > 0 &&
          image !== primaryImage
      ) || undefined;
      return {
        id: `slide-${product.id}-${index}`,
        type: product.featured ? "featured" : "new-arrival",
        badge: getCategoryLabel(product),
        badgeIcon: getBadgeIcon(product),
        badgeColor: getBadgeColor(product),
        title: product.name,
        subtitle:
          product.shortDescription?.trim() ||
          getCategoryLabel(product),
        description:
          product.description?.trim() ||
          product.shortDescription?.trim() ||
          "",
        modelCode: product.model?.trim() || String(product.id),
        productSlug: product.slug,
        price: product.price,
        mrp: product.mrp,
        discountPercentage:
          product.price != null &&
            product.mrp != null &&
            product.mrp > product.price
            ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
            : undefined,
        specs: getDynamicSpecs(product),
        colors:
          product.specifications?.colors?.filter(Boolean).map((name) => ({
            name,
          })),
        image: primaryImage,
        secondaryImage,
        ctaPrimary: {
          label: t("HeroCarousel.actions.details"),
          link: `/products/${product.slug}`,
        },
        ctaSecondary: {
          label: t("HeroCarousel.actions.whatsappTradeInquiry"),
          link: getProductEnquiryWhatsAppUrl(
            product.name,
            product.model || String(product.id),
          ),
          isWhatsApp: true,
        },
      };
    },
  );
  const totalSlides = heroSlides.length;
  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
    setSlideProgress(0);
  }, [totalSlides]);
  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setSlideProgress(0);
  }, [totalSlides]);
  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index);
    setSlideProgress(0);
  };
  // Timer for auto-play and animated progress bar
  useEffect(() => {
    if (isPaused) return;
    const intervalTime = 4000; // 4 seconds per slide
    const tickTime = 60; // 60ms updates
    const increment = (tickTime / intervalTime) * 100;
    progressTimerRef.current = setInterval(() => {
      setSlideProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + increment;
      });
    }, tickTime);
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPaused, nextSlide, currentSlideIndex]);
  if (totalSlides === 0) {
    return null;
  }
  // Touch handlers for mobile swipe
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };
  const currentSlide = heroSlides[currentSlideIndex];
  const BadgeIcon = currentSlide.badgeIcon;
  return (
    <section
      id="hero-carousel-section"
      className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 overflow-hidden border-b border-slate-200 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-label={t("HeroCarousel.aria.carousel")}
    >
      {/* Background Ambient FX */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#091a320f_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-12 sm:pt-4 sm:pb-16 lg:py-14">
        {/* Slide Content with AnimatePresence */}
        <div className="relative min-h-[540px] sm:min-h-[500px] lg:min-h-[480px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* Product Information, Specs & CTAs (Order 2 on mobile, Order 1 on desktop) */}
              <div className="order-2 lg:order-1 lg:col-span-7 space-y-5 text-left z-10">
                {/* Badge Tag & Model Code */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide shadow-xs uppercase ${currentSlide.badgeColor}`}
                  >
                    <BadgeIcon className="w-3.5 h-3.5" />
                    <span>{currentSlide.badge}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[#091a32] text-xs font-mono font-bold">
                    {t("HeroCarousel.trust.model")}: {currentSlide.modelCode}
                  </span>
                </div>
                {/* Main Titles */}
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-[1.15] font-['Cabinet_Grotesk',sans-serif]">
                    {currentSlide.title}
                  </h1>
                  <p className="text-base sm:text-lg font-bold text-[#091a32] mt-1">
                    {currentSlide.subtitle}
                  </p>
                </div>
                {/* Description */}
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                  {currentSlide.description}
                </p>
                {/* Specification Badges Bento Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {currentSlide.specs.map((spec, i) => {
                    const SpecIcon = spec.icon;
                    return (
                      <div
                        key={i}
                        className="bg-white border border-slate-200 rounded-xl p-2.5 hover:border-slate-300 shadow-2xs transition-colors"
                      >
                        <div className="flex items-center gap-1.5 text-[#e31e24] mb-1">
                          <SpecIcon className="w-3.5 h-3.5" />
                          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                            {spec.label}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 block truncate">
                          {spec.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {/* Factory Direct Trust Strip & Designer Color Swatches */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200">
                  <div className="text-xs sm:text-sm font-bold text-[#091a32] flex items-center gap-2">
                    <Factory className="w-4 h-4 text-[#e31e24]" />
                    <span>{t("HeroCarousel.trust.directFactorySupply")}</span>
                  </div>
                  {/* Available finishes */}
                  {currentSlide.colors && currentSlide.colors.length > 0 && (
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="shrink-0 text-[11px] font-medium text-slate-500">
                        {t("HeroCarousel.trust.finishes")}:
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {currentSlide.colors.map((color, index) => (
                          <span
                            key={`${color.name}-${index}`}
                            title={color.name}
                            className="rounded-full border border-slate-300 bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-700"
                          >
                            {color.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href={currentSlide.ctaPrimary.link}
                    className="bg-[#e31e24] hover:bg-[#c4181d] text-white font-bold px-6 py-3 rounded-lg text-sm sm:text-base shadow-sm hover:shadow transition-all duration-200 inline-flex items-center gap-2 group"
                  >
                    <span>{currentSlide.ctaPrimary.label}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  {currentSlide.ctaSecondary && (
                    <>
                      {currentSlide.ctaSecondary.isWhatsApp ? (
                        <a
                          href={currentSlide.ctaSecondary.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#091a32] hover:bg-[#112d52] text-white px-5 py-3 rounded-lg text-sm sm:text-base font-bold transition-all inline-flex items-center gap-2 shadow-xs"
                        >
                          <WhatsappIcon className="w-4 h-4 text-[#00b003]" />
                          <span>{currentSlide.ctaSecondary.label}</span>
                        </a>
                      ) : (
                        <Link
                          href={currentSlide.ctaSecondary.link}
                          className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400 px-5 py-3 rounded-lg text-sm sm:text-base font-bold transition-all shadow-xs"
                        >
                          {currentSlide.ctaSecondary.label}
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>
              {/* Product & Showcase Imagery (Order 1 on mobile to keep image UP, Order 2 on desktop) */}
              <div className="order-1 lg:order-2 lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Container */}
                  <div className="relative rounded-2xl bg-white p-3 sm:p-4 border border-slate-200 shadow-xl overflow-hidden">
                    {/* Primary Image View */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 border border-slate-100 group">
                      {currentSlide.image ? (
                        <Image
                          src={currentSlide.image}
                          alt={currentSlide.title}
                          fill
                          priority={currentSlideIndex === 0}
                          sizes="(max-width: 1024px) 100vw, 42vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-50">
                          <div className="text-center">
                            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200">
                              <Wind className="h-7 w-7 text-slate-400" />
                            </div>
                            <p className="text-xs font-semibold text-slate-400">
                              {t("HeroCarousel.dynamic.imageComingSoon")}
                            </p>
                          </div>
                        </div>
                      )}
                      {/* Top Overlay Badge */}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-slate-200 text-[#091a32] px-2.5 py-1 rounded-md text-[11px] font-bold shadow-xs flex items-center gap-1.5">
                        <BadgeIcon className="w-3.5 h-3.5 text-[#e31e24]" />
                        <span>{t("HeroCarousel.trust.series")}</span>
                      </div>
                      {/* Bottom Overlay Info Strip */}
                      <div className="absolute bottom-3 inset-x-3 bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg p-2.5 flex items-center justify-between text-xs shadow-xs">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#e31e24]" />
                          <span className="font-semibold text-slate-800">
                            {t("HeroCarousel.trust.qualityInspected")}
                          </span>
                        </div>
                        {currentSlide.productSlug && (
                          <Link
                            href={`/products/${currentSlide.productSlug}`}
                            className="text-[#091a32] hover:text-[#e31e24] font-bold flex items-center gap-0.5 text-[11px] transition-colors"
                          >
                            <span>{t("HeroCarousel.actions.details")}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                    {/* Secondary Visual Strip / Thumbnail Highlights */}
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-1">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Factory className="w-3.5 h-3.5 text-[#091a32]" />
                        <span>{t("HeroCarousel.trust.hyderabadFactoryBuilt")}</span>
                      </span>
                      <span className="text-[11px] text-[#e31e24] font-mono font-bold">
                        {t("HeroCarousel.trust.twoYearDirectGuarantee")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Carousel Bottom Controls & Model Selector Tabs */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Slide Tab Buttons */}
          <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
            {heroSlides.map((slide, index) => {
              const isActive = index === currentSlideIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(index)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 text-left ${isActive
                    ? "bg-[#091a32] text-white font-bold shadow-xs ring-1 ring-[#091a32]"
                    : "bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                    }`}
                  aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${isActive ? "bg-[#e31e24] animate-pulse" : "bg-slate-400"
                      }`}
                  />
                  <span className="truncate max-w-[130px] sm:max-w-[180px]">
                    {slide.title}
                  </span>
                </button>
              );
            })}
          </div>
          {/* Navigation Arrows, Progress & Pause/Play Control */}
          <div className="flex items-center gap-3">
            {/* Auto-play status / toggle */}
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs transition-colors shadow-2xs"
              title={
                isPaused
                  ? t("HeroCarousel.controls.resumeSlideshow")
                  : t("HeroCarousel.controls.pauseSlideshow")
              }
              aria-label={
                isPaused
                  ? t("HeroCarousel.controls.resumeSlideshow")
                  : t("HeroCarousel.controls.pauseSlideshow")
              }
            >
              {isPaused ? (
                <Play className="w-4 h-4" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
            </button>
            {/* Left Chevron */}
            <button
              onClick={prevSlide}
              className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 hover:border-slate-300 shadow-2xs transition-all active:scale-95"
              aria-label={t("HeroCarousel.controls.previousModel")}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {/* Slide Count & Mini Progress bar */}
            <div className="flex flex-col items-center min-w-[70px]">
              <span className="text-xs font-mono font-bold text-slate-700">
                0{currentSlideIndex + 1} / 0{totalSlides}
              </span>
              <div className="w-full h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-[#e31e24] transition-all duration-100 ease-linear rounded-full"
                  style={{ width: `${slideProgress}%` }}
                />
              </div>
            </div>
            {/* Right Chevron */}
            <button
              onClick={nextSlide}
              className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 hover:border-slate-300 shadow-2xs transition-all active:scale-95"
              aria-label={t("HeroCarousel.controls.nextModel")}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
