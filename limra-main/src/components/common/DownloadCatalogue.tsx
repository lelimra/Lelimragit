"use client";

import { Download, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

type DownloadCatalogueProps = {
  className?: string;
};

export default function DownloadCatalogue({
  className = "",
}: DownloadCatalogueProps) {
  const t = useTranslations();

  return (
    <a
      href="/catalogue/limra-catalogue.pdf"
      download="LIMRA-Catalogue.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative inline-flex items-center gap-3.5 overflow-hidden rounded-xl bg-gradient-to-r from-[#0b2f5c] via-[#0e3d77] to-[#144d93] px-6 py-3.5 text-white shadow-md shadow-sky-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-950/30 active:translate-y-0 ${className}`}
    >
      {/* Subtle background glow effect on hover */}
      <div className="absolute inset-0 bg-white/0 transition-colors duration-300 group-hover:bg-white/5" />

      {/* Leading Icon with soft backdrop container */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
        <FileText className="h-4 w-4 text-sky-200" />
      </div>

      {/* Text Container */}
      <div className="flex flex-col text-left">
        <span className="text-sm font-bold tracking-wide text-white">
          {t("downloadCatalogue")}
        </span>
        <span className="text-[10px] font-medium tracking-wider text-sky-200/80 uppercase">
          PDF Format • Latest Edition
        </span>
      </div>

      {/* Trailing Animated Download Icon */}
      <div className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#0b2f5c] shadow-xs transition-transform duration-300 group-hover:translate-y-0.5">
        <Download className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
      </div>
    </a>
  );
}