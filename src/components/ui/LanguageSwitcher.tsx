"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Languages } from "lucide-react";
import { useState } from "react";

const languages = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "ur", label: "Urdu", native: "اردو" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const currentLocale =
    pathname?.split("/")[1] || "en";

  const currentLanguage =
    languages.find((language) => language.code === currentLocale) ||
    languages[0];

  const changeLanguage = (locale: string) => {
    if (!pathname) return;

    const segments = pathname.split("/");

    if (languages.some((language) => language.code === segments[1])) {
      segments[1] = locale;
    } else {
      segments.splice(1, 0, locale);
    }

    const newPath = segments.join("/") || `/${locale}`;

    setOpen(false);
    router.push(newPath);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        aria-expanded={open}
      >
        <Languages className="h-4 w-4 font-bold text-[#0b5cab]" />

        <span className="hidden sm:inline">
          {currentLanguage.native}
        </span>

        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <>
          {/* Click outside */}
          <button
            type="button"
            aria-label="Close language menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
            {languages.map((language) => {
              const isActive =
                currentLocale === language.code;

              return (
                <button
                  key={language.code}
                  type="button"
                  onClick={() =>
                    changeLanguage(language.code)
                  }
                  className={`flex w-full items-center justify-between font-bold rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    isActive
                      ? "bg-blue-50 font-bold text-[#0b2f5c]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>{language.native}</span>

                  <span className="text-[10px] uppercase text-slate-400">
                    {language.code}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}