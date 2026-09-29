"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";

export const ScrollToTop: React.FC = () => {
  const pathname = usePathname();

  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll to top whenever the Next.js route changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  // Track scroll position and calculate page progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.scrollY || document.documentElement.scrollTop;

      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      setIsVisible(scrollTop > 280);

      if (scrollHeight > 0) {
        const progress = Math.min(
          100,
          Math.max(0, (scrollTop / scrollHeight) * 100)
        );

        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`fixed bottom-30 mb-20 right-5 z-40 transform transition-all duration-300 sm:bottom-20 sm:right-5 ${
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-white/95 text-slate-700 shadow-md backdrop-blur-md transition-all duration-200 hover:border-[#0b2f5c] hover:bg-[#0b2f5c] hover:text-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95"
        aria-label="Scroll to top of page"
        title="Scroll to top"
      >
        {/* Circular scroll progress */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full -rotate-90 p-0.5"
          viewBox="0 0 36 36"
          aria-hidden="true"
        >
          <path
            className="text-slate-200 transition-colors group-hover:text-blue-900/40"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />

          <path
            className="text-[#0b2f5c] transition-colors group-hover:text-amber-400"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`${scrollProgress}, 100`}
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>

        <ArrowUp className="relative z-10 h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5" />

        {/* Desktop tooltip */}
        <span className="absolute right-full mr-2.5 hidden whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white shadow-lg pointer-events-none sm:group-hover:block">
          Top
        </span>
      </button>
    </div>
  );
};

export default ScrollToTop;