import { ChevronRight, Home } from "lucide-react";
import { Link } from "@/lib/navigation";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export default function Breadcrumbs({
  items,
  className = "",
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`w-full ${className}`}
    >
      <div className="mx-auto max-w-7xl px-1 sm:px-2 lg:px-2">
        <ol className="flex min-w-0 items-center gap-1.5 overflow-x-auto py-3 text-xs sm:gap-2 sm:py-4 sm:text-sm">
          {/* Home */}
          <li className="shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 whitespace-nowrap text-slate-500 transition-colors hover:text-[#174e8c]"
            >
              <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Home</span>
            </Link>
          </li>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li
                key={`${item.label}-${index}`}
                className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2"
              >
                <ChevronRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 text-slate-400 sm:h-4 sm:w-4"
                />

                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="max-w-[180px] truncate whitespace-nowrap text-slate-500 transition-colors hover:text-[#174e8c] sm:max-w-[240px]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className={`max-w-[200px] truncate whitespace-nowrap sm:max-w-[320px] ${
                      isLast
                        ? "font-semibold text-slate-900"
                        : "text-slate-500"
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}