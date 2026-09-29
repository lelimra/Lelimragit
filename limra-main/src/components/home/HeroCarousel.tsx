"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "@/lib/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { getAllProducts } from "@/data/products";
import { getProductEnquiryWhatsAppUrl } from "@/utils/whatsapp";
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
  MessageCircle,
  Factory,
  Layers,
  Star,
  Eye,
} from "lucide-react";

export interface HeroSlide {
  id: string;
  type: "new-arrival" | "best-seller" | "featured" | "wholesale";
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
  colors?: { name: string; hex: string }[];
  image: string;
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

export const HeroCarousel: React.FC = () => {
  const t  = useTranslations();
const products = getAllProducts();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [slideProgress, setSlideProgress] = useState(0);

  // Find real product for Enticer and Avencer Prime
  const enticerProd = products.find(
    (p) => p.slug.includes("enticer") || p.id === "cf-enticer"
  );
  const avencerProd = products.find(
    (p) => p.slug.includes("avencer") || p.id === "cf-avencer-prime"
  );
  const aeroFlowProd = products.find(
    (p) => p.slug.includes("aeroflow") || p.category === "ceiling-fan"
  );
  const tableProd = products.find(
    (p) => p.category === "table-fan"
  );

  const heroSlides: HeroSlide[] = [
    {
      id: "slide-enticer",
      type: "new-arrival",
      badge: "EXOTIC RICH STYLING",
      badgeIcon: Sparkles,
      badgeColor: "bg-[#e31e24] text-white",
      title: "LE LIMRA Enticer 1200 mm",
      subtitle: "Energy-Efficient Induction Motor • Dust Resistant",
      description:
        "Exotic rich looks with modern styling. Built with an energy-efficient 50W induction motor, double ball bearing, high-grade motor winding, and wider tip blades for expansive air spread.",
      modelCode: enticerProd?.model || "LIMRA-ENT-1200",
      productSlug: enticerProd?.slug || "enticer-1200-mm-decorative-ceiling-fan",
      specs: [
        { label: "Rated Speed", value: "350 RPM", icon: Gauge },
        { label: "Power Input", value: "50 Watts (230V)", icon: Zap },
        { label: "Bearings", value: "Double Ball Bearing", icon: ShieldCheck },
        { label: "Blade Design", value: "Wider Tip Spread", icon: Wind },
      ],
      colors: [
        { name: "Royal Pearl White", hex: "#f8fafc" },
        { name: "Rich Walnut Brown", hex: "#451a03" },
        { name: "Titanium Silver", hex: "#94a3b8" },
        { name: "Ivory Gold", hex: "#fef08a" },
      ],
      image: enticerProd?.images?.[0] || "/src/assets/images/hero_decorative_fan_1789988751718.jpg",
      secondaryImage: "/images/products/ceiling-fan-01.jpg",
      ctaPrimary: {
        label: "Explore Enticer Model",
        link: `/products/${enticerProd?.slug || "enticer-1200-mm-decorative-ceiling-fan"}`,
      },
      ctaSecondary: {
        label: "WhatsApp Trade Inquiry",
        link: getProductEnquiryWhatsAppUrl(
          enticerProd?.name || "Enticer 1200 mm Decorative Ceiling Fan",
          enticerProd?.model || "LIMRA-ENT-1200"
        ),
        isWhatsApp: true,
      },
    },
    {
      id: "slide-avencer-prime",
      type: "new-arrival",
      badge: "PREMIUM DECORATIVE",
      badgeIcon: Sparkles,
      badgeColor: "bg-[#e31e24] text-white",
      title: "Avencer Prime 1200 mm",
      subtitle: "Designer Decorative Ceiling Fan",
      description:
        "Architectural luxury meets 380 RPM supercharged airflow. Precision aerodynamic blades with high-grade aluminium winding and 4 royal metallic finishes.",
      modelCode: avencerProd?.model || "LIMRA-AP-1200",
      productSlug: avencerProd?.slug || "avencer-prime-1200-mm-decorative-ceiling-fan",
      specs: [
        { label: "Rated Speed", value: "380 RPM", icon: Gauge },
        { label: "Air Delivery", value: "207 CFM", icon: Wind },
        { label: "Motor Build", value: "Aluminium Winding", icon: Zap },
        { label: "Warranty", value: "2 Years Direct", icon: ShieldCheck },
      ],
      colors: [
        { name: "Viola Blue", hex: "#1e3a8a" },
        { name: "Satin Gold", hex: "#d97706" },
        { name: "Baker's Brown", hex: "#78350f" },
        { name: "Pearl Ivory", hex: "#fef3c7" },
      ],
      image: avencerProd?.images?.[0] || "/images/products/avencer-prime-viola-blue.jpg",
      secondaryImage: "/src/assets/images/hero_decorative_fan_1789988751718.jpg",
      ctaPrimary: {
        label: "Explore Avencer Prime",
        link: `/products/${avencerProd?.slug || "avencer-prime-1200-mm-decorative-ceiling-fan"}`,
      },
      ctaSecondary: {
        label: "WhatsApp Trade Inquiry",
        link: getProductEnquiryWhatsAppUrl(
          avencerProd?.name || "Avencer Prime 1200 mm Decorative Ceiling Fan",
          avencerProd?.model || "LIMRA-AP-1200"
        ),
        isWhatsApp: true,
      },
    },
    {
      id: "slide-aeroflow-bestseller",
      type: "best-seller",
      badge: "#1 BEST SELLER",
      badgeIcon: Flame,
      badgeColor: "bg-[#e31e24] text-white",
      title: "LE LIMRA AeroFlow Series",
      subtitle: "High-Speed Heavy Duty Ceiling Fan",
      description:
        "Engineered for relentless cooling performance during peak Indian summers. 100% heavy-duty motor, precision dynamic balancing, and ultra-quiet energy efficiency.",
      modelCode: aeroFlowProd?.model || "LL-CF-1200-AF",
      productSlug: aeroFlowProd?.slug || "le-limra-aeroflow-ceiling-fan",
      specs: [
        { label: "High Speed", value: "400 RPM", icon: Gauge },
        { label: "Air Delivery", value: "220 CMM", icon: Wind },
        { label: "Sweep Size", value: "1200 mm (48″)", icon: Layers },
        { label: "Certified", value: "IS Quality Tested", icon: ShieldCheck },
      ],
      colors: [
        { name: "Pure White", hex: "#f8fafc" },
        { name: "Smoky Brown", hex: "#451a03" },
        { name: "Ivory Gold", hex: "#fef08a" },
      ],
      image: "/src/assets/images/hero_bestseller_fan_1789988765878.jpg",
      secondaryImage: aeroFlowProd?.images?.[0] || "/images/products/ceiling-fan-01.jpg",
      ctaPrimary: {
        label: "View AeroFlow Model",
        link: `/products/${aeroFlowProd?.slug || "le-limra-aeroflow-ceiling-fan"}`,
      },
      ctaSecondary: {
        label: "Request Wholesale Rate",
        link: "/wholesale",
      },
    },
    {
      id: "slide-turbo-table",
      type: "new-arrival",
      badge: "HIGH AIRFLOW SERIES",
      badgeIcon: Zap,
      badgeColor: "bg-[#091a32] text-white border border-slate-700",
      title: "LE LIMRA Turbo Air 300 mm",
      subtitle: "High-Velocity Aerodynamic Table Fan",
      description:
        "Compact footprint with high-velocity air throw. Features 2100 RPM motor speed, wide-angle 90° smooth oscillation, and built-in thermal overload protection.",
      modelCode: tableProd?.model || "LL-TF-300-TA",
      productSlug: tableProd?.slug || "le-limra-turbo-air-table-fan",
      specs: [
        { label: "RPM Speed", value: "2100 RPM", icon: Gauge },
        { label: "Air Throw", value: "Wide Angle 90°", icon: Wind },
        { label: "Safety", value: "Thermal Overload", icon: ShieldCheck },
        { label: "Power", value: "55W Low Wattage", icon: Zap },
      ],
      colors: [
        { name: "Gloss White & Blue", hex: "#0284c7" },
        { name: "Charcoal Grey", hex: "#334155" },
      ],
      image: "/src/assets/images/hero_table_cooling_1789988779515.jpg",
      secondaryImage: tableProd?.images?.[0] || "/images/products/table-fan-01.jpg",
      ctaPrimary: {
        label: "Explore Table Fans",
        link: `/products/${tableProd?.slug || "le-limra-turbo-air-table-fan"}`,
      },
      ctaSecondary: {
        label: "Order Sample / Quote",
        link: "/wholesale",
      },
    },
    {
      id: "slide-factory-direct",
      type: "wholesale",
      badge: "DIRECT FACTORY SUPPLY",
      badgeIcon: Factory,
      badgeColor: "bg-[#091a32] text-white border border-slate-700",
      title: "Wholesale & Project Supply",
      subtitle: "Bulk Ceiling & Table Fans for Hostels & Builders",
      description:
        "Direct manufacturer supply from our Hyderabad factory. Benefit from verified warranty, custom color batches, and PAN-India shipping.",
      modelCode: "LIMRA-BULK-B2B",
      specs: [
        { label: "Min Order", value: "30+ Units", icon: Layers },
        { label: "Dispatch", value: "PAN-India Logistics", icon: Wind },
        { label: "Pricing", value: "Ex-Factory Rates", icon: Zap },
        { label: "Support", value: "Dedicated Trade Desk", icon: Star },
      ],
      image: "/src/assets/images/hero_ceiling_fan_1789886901252.jpg",
      secondaryImage: "/images/products/hero-fan.jpg",
      ctaPrimary: {
        label: "Submit Bulk Inquiry",
        link: "/wholesale",
      },
      ctaSecondary: {
        label: "Browse Full Catalog",
        link: "/products",
      },
    },
  ];

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
      aria-label="New arrivals and featured fan models carousel"
    >
      {/* Background Ambient FX */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#091a320f_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16 lg:py-16">
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
                    MODEL: {currentSlide.modelCode}
                  </span>
                </div>

                {/* Main Titles */}
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-[1.15] font-['Cabinet_Grotesk',sans-serif]">
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
                    <span>Direct Factory Supply • Hyderabad Plant</span>
                  </div>

                  {/* Designer Colors if available */}
                  {currentSlide.colors && currentSlide.colors.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-medium">Finishes:</span>
                      <div className="flex items-center gap-1.5">
                        {currentSlide.colors.map((c, idx) => (
                          <span
                            key={idx}
                            title={c.name}
                            className="w-4 h-4 rounded-full border border-slate-300 shadow-xs cursor-help transition-transform hover:scale-125"
                            style={{ backgroundColor: c.hex }}
                          />
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
                          <MessageCircle className="w-4 h-4 text-[#e31e24]" />
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
                      <img
                        src={currentSlide.image}
                        alt={currentSlide.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Top Overlay Badge */}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-slate-200 text-[#091a32] px-2.5 py-1 rounded-md text-[11px] font-bold shadow-xs flex items-center gap-1.5">
                        <BadgeIcon className="w-3.5 h-3.5 text-[#e31e24]" />
                        <span>LE LIMRA Series</span>
                      </div>

                      {/* Bottom Overlay Info Strip */}
                      <div className="absolute bottom-3 inset-x-3 bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg p-2.5 flex items-center justify-between text-xs shadow-xs">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#e31e24]" />
                          <span className="font-semibold text-slate-800">
                            100% Quality Inspected
                          </span>
                        </div>
                        {currentSlide.productSlug && (
                          <Link
                            href={`/products/${currentSlide.productSlug}`}
                            className="text-[#091a32] hover:text-[#e31e24] font-bold flex items-center gap-0.5 text-[11px] transition-colors"
                          >
                            <span>Details</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Secondary Visual Strip / Thumbnail Highlights */}
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-1">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Factory className="w-3.5 h-3.5 text-[#091a32]" />
                        <span>Hyderabad Factory Built</span>
                      </span>
                      <span className="text-[11px] text-[#e31e24] font-mono font-bold">
                        ✦ 2-Year Direct Guarantee
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
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 text-left ${
                    isActive
                      ? "bg-[#091a32] text-white font-bold shadow-xs ring-1 ring-[#091a32]"
                      : "bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                  }`}
                  aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? "bg-[#e31e24] animate-pulse" : "bg-slate-400"
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
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs transition-colors shadow-2xs"
              title={isPaused ? "Resume Auto-slide" : "Pause Auto-slide"}
              aria-label={isPaused ? "Resume slideshow" : "Pause slideshow"}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>

            {/* Left Chevron */}
            <button
              onClick={prevSlide}
              className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 hover:border-slate-300 shadow-2xs transition-all active:scale-95"
              aria-label="Previous fan model"
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
              aria-label="Next fan model"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
