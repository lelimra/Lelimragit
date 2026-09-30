"use client";

import { useState } from "react";
import {
  Home,
  Fan,
  ClipboardList,
  Truck,
  ChevronUp,
  X,
} from "lucide-react";
import WhatsappIcon from "@mui/icons-material/WhatsApp";
import { usePathname, Link } from "@/lib/navigation";
import { siteConfig } from "@/data/site";

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: "Home", path: "", icon: Home },
  { name: "Fans", path: "products", icon: Fan },
  { name: "Freight", path: "freight", icon: Truck },
];

const applicationItems = [
  {
    name: "Dealer Application",
    path: "dealers",
  },
  {
    name: "Wholesale Enquiry",
    path: "wholesale",
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [applicationsOpen, setApplicationsOpen] = useState(false);

  const isApplicationActive =
    pathname === "/dealers" ||
    pathname.startsWith("/dealers/") ||
    pathname === "/wholesale" ||
    pathname.startsWith("/wholesale/");

  return (
    <>
      {/* Application Dropdown */}
      {applicationsOpen && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close applications menu"
            onClick={() => setApplicationsOpen(false)}
            className="fixed inset-0 z-[95] bg-slate-950/20 lg:hidden"
          />

          {/* Dropdown */}
          <div className="fixed inset-x-4 bottom-[76px] z-[100] mx-auto max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl lg:hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Applications & Enquiries
                </p>
                <p className="text-xs text-slate-500">
                  Choose an option
                </p>
              </div>

              <button
                type="button"
                onClick={() => setApplicationsOpen(false)}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-2">
              {applicationItems.map((item) => {
                const targetPath = `/${item.path}`;

                const active =
                  pathname === targetPath ||
                  pathname.startsWith(`${targetPath}/`);

                return (
                  <Link
                    key={item.path}
                    href={targetPath}
                    onClick={() => setApplicationsOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3.5 transition-colors ${
                      active
                        ? "bg-blue-50 text-blue-800"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <p
                        className={`text-sm ${
                          active ? "font-bold" : "font-semibold"
                        }`}
                      >
                        {item.name}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {item.path === "dealers"
                          ? "Become a LIMRA dealer"
                          : "Bulk & B2B requirements"}
                      </p>
                    </div>

                    <span className="text-lg text-slate-400">›</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Bottom Navigation */}
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-[90] border-t border-slate-200 bg-white/95 text-slate-800 shadow-xl backdrop-blur-md lg:hidden"
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="mx-auto grid h-16 max-w-lg grid-cols-5">
          {/* Home / Fans / Freight */}
          {navItems.map((item) => {
            const targetPath = item.path ? `/${item.path}` : "/";

            const active =
              item.path === ""
                ? pathname === "/"
                : pathname === targetPath ||
                  pathname.startsWith(`${targetPath}/`);

            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={targetPath}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center justify-center gap-1 text-[11px] transition-colors ${
                  active
                    ? "font-bold text-blue-800"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon size={21} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Applications */}
          <button
            type="button"
            onClick={() => setApplicationsOpen((prev) => !prev)}
            aria-expanded={applicationsOpen}
            aria-haspopup="menu"
            className={`flex flex-col items-center justify-center gap-1 text-[11px] transition-colors ${
              applicationsOpen || isApplicationActive
                ? "font-bold text-blue-800"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {applicationsOpen ? (
              <ChevronUp size={21} />
            ) : (
              <ClipboardList size={21} />
            )}

            <span>Applications</span>
          </button>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${siteConfig.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact us on WhatsApp"
            className="flex flex-col items-center justify-center gap-1 text-[11px] text-emerald-700 transition-colors hover:text-emerald-800"
          >
            <WhatsappIcon sx={{ fontSize: 21 }} />
            <span>WhatsApp</span>
          </a>
        </div>
      </nav>
    </>
  );
}