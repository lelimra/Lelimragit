"use client";

import { usePathname } from "next/navigation";
import { Menu, Bell, ShieldCheck } from "lucide-react";

type AdminNavbarProps = {
  onMenuClick?: () => void;
};

export default function AdminNavbar({
  onMenuClick,
}: AdminNavbarProps) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.includes("/admin/login")) {
      return "Login";
    }

    if (pathname.includes("products")) {
      return "Products";
    }

    if (pathname.includes("settings")) {
      return "Settings";
    }

    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      {/* Left */}
      <div className="flex items-center gap-4">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={21} />
        </button>

        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            {getPageTitle()}
          </h1>

          <p className="hidden text-xs text-slate-500 sm:block">
            LIMRA Industry Administration
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Status */}
        <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 sm:flex">
          <ShieldCheck
            size={16}
            className="text-emerald-600"
          />

          <span className="text-xs font-medium text-emerald-700">
            Admin
          </span>
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="Notifications"
        >
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
          A
        </div>
      </div>
    </header>
  );
}