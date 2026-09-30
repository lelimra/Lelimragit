"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Inbox,
  Store,
  Handshake,
  MessageSquare,
  Images,
  Settings,
  ExternalLink,
  LogOut,
  X,
  ChevronRight,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  LockKeyhole,
} from "lucide-react";

type AdminSidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggle?: () => void;
};

type NavigationItem = {
  name: string;
  description: string;
  href: string;
  icon: React.ElementType;
  comingSoon?: boolean;
};

const navigationSections: {
  title: string;
  items: NavigationItem[];
}[] = [
  {
    title: "Management",
    items: [
      {
        name: "Dashboard",
        description: "Overview",
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        name: "Products",
        description: "Manage catalogue",
        href: "/admin/products",
        icon: Package,
      },
      {
        name: "Categories",
        description: "Product categories",
        href: "/admin/categories",
        icon: FolderTree,
      },
    ],
  },

  {
    title: "Communication",
    items: [
      {
        name: "Enquiries",
        description: "Customer enquiries",
        href: "/admin/enquiries",
        icon: Inbox,
        comingSoon: true,
      },
      {
        name: "Wholesale Enquiries",
        description: "B2B & bulk enquiries",
        href: "/admin/wholesale",
        icon: Store,
        comingSoon: true,
      },
      {
        name: "Dealer Applications",
        description: "Dealer & trade partners",
        href: "/admin/dealers",
        icon: Handshake,
      },
      {
        name: "Contact Messages",
        description: "Website messages",
        href: "/admin/contact-messages",
        icon: MessageSquare,
        comingSoon: true,
      },
    ],
  },

  {
    title: "Content",
    items: [
      {
        name: "Media Library",
        description: "Images & media",
        href: "/admin/media",
        icon: Images,
        comingSoon: true,
      },
    ],
  },

  {
    title: "System",
    items: [
      {
        name: "Settings",
        description: "Website configuration",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];
export default function AdminSidebar({
  mobileOpen = false,
  onClose,
  collapsed = false,
  onToggle,
}: AdminSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      window.location.href = "/admin/login";
    }
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar Container */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col overflow-hidden
          border-r border-slate-200/80 bg-white/95 backdrop-blur-xl
          shadow-xl lg:shadow-none
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-[80px]" : "w-[280px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div
          className={`
            flex h-20 shrink-0 items-center border-b border-slate-100 px-4
            ${collapsed ? "justify-center" : "justify-between"}
          `}
        >
          <Link
            href="/admin"
            onClick={onClose}
            className="group flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 font-bold text-white shadow-md shadow-slate-900/10">
              LI
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-bold tracking-tight text-slate-900">LIMRA</p>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[11px] font-medium text-slate-500">Admin Console</p>
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Toggle Button */}
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 lg:block"
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navigationSections.map((section) => (
            <div key={section.title}>
              {!collapsed ? (
                <div className="mb-2 flex items-center justify-between px-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {section.title}
                  </p>
                  <Sparkles size={12} className="text-slate-300" />
                </div>
              ) : (
                <div className="my-2 px-2">
                  <div className="h-px bg-slate-200/80" />
                </div>
              )}

              <nav className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;

                  if (item.comingSoon) {
                    return (
                      <div
                        key={item.name}
                        title={collapsed ? `${item.name} (Coming Soon)` : undefined}
                        aria-disabled="true"
                        className={`
                          flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-400 cursor-not-allowed opacity-75
                          ${collapsed ? "justify-center" : ""}
                        `}
                      >
                        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                          <Icon size={18} />
                          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                            <LockKeyhole size={9} />
                          </span>
                        </span>

                        {!collapsed && (
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium">{item.name}</p>
                            <p className="truncate text-[10px] text-slate-400">Coming soon</p>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      title={collapsed ? item.name : undefined}
                      aria-current={active ? "page" : undefined}
                      className={`
                        group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all
                        ${
                          active
                            ? "bg-slate-900 text-white shadow-sm shadow-slate-900/10"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }
                        ${collapsed ? "justify-center" : ""}
                      `}
                    >
                      <span
                        className={`
                          flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors
                          ${
                            active
                              ? "bg-white/10 text-white"
                              : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-900"
                          }
                        `}
                      >
                        <Icon size={18} />
                      </span>

                      {!collapsed && (
                        <>
                          <div className="min-w-0 flex-1">
                            <p className="truncate">{item.name}</p>
                            <p
                              className={`truncate text-[10px] font-normal ${
                                active ? "text-slate-300" : "text-slate-400"
                              }`}
                            >
                              {item.description}
                            </p>
                          </div>
                          <ChevronRight
                            size={14}
                            className={`transition-transform duration-200 ${
                              active
                                ? "text-white"
                                : "text-slate-300 group-hover:translate-x-0.5 group-hover:text-slate-500"
                            }`}
                          />
                        </>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Footer Area */}
        <div className="border-t border-slate-100 p-3 space-y-1">
          {!collapsed && (
            <div className="mb-2 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white shadow-xs">
                A
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-800">Administrator</p>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-slate-500">Active session</span>
                </div>
              </div>
            </div>
          )}

          {/* View Website */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            title={collapsed ? "View Website" : undefined}
            className={`
              flex items-center gap-3 rounded-xl p-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <ExternalLink size={16} />
            </span>
            {!collapsed && <span>View Website</span>}
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className={`
              flex w-full items-center gap-3 rounded-xl p-2.5 text-xs font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <LogOut size={16} />
            </span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}