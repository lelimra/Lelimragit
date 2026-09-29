"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, ArrowUpRight, Fan, Wind, ShieldCheck } from "lucide-react";

import { Link } from "@/lib/navigation";
import type { Product, ProductCategory } from "@/data/products";

type SearchVariant = "navbar" | "mobile";

interface NavSearchBarProps {
  variant?: SearchVariant;
  className?: string;
  products?: Product[];
  onCloseMobile?: () => void;
}

type SearchCategory = {
  id: ProductCategory;
  label: string;
  href: string;
  keywords: string[];
};

const CATEGORIES: SearchCategory[] = [
  {
    id: "ceiling-fan",
    label: "Ceiling Fans",
    href: "/products?category=ceiling-fan",
    keywords: [
      "ceiling",
      "ceiling fan",
      "roof",
      "room",
      "hall",
      "1200mm",
      "1200 mm",
      "bldc",
      "decorative",
    ],
  },
  {
    id: "table-fan",
    label: "Table Fans",
    href: "/products?category=table-fan",
    keywords: [
      "table",
      "table fan",
      "desk",
      "office",
      "portable",
    ],
  },
  {
    id: "pedestal-fan",
    label: "Pedestal Fans",
    href: "/products?category=pedestal-fan",
    keywords: [
      "pedestal",
      "pedestal fan",
      "stand fan",
      "high speed",
      "commercial",
    ],
  },
];

const POPULAR_SEARCHES = [
  "Avencer Prime",
  "Enticer 1200mm",
  "Ceiling Fans",
  "Table Fans",
  "Pedestal Fans",
  "1200 mm Sweep",
  "50 Watts Motor",
  "Double Ball Bearing",
  "High Speed 390 RPM",
  "Jazz Decorative",
];

function normalize(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function getCategoryIcon(category: ProductCategory) {
  if (category === "ceiling-fan") {
    return Fan;
  }

  if (category === "table-fan") {
    return Wind;
  }

  return ShieldCheck;
}

function getProductSearchText(product: Product) {
  return [
    product.name,
    product.model,
    product.category,
    product.shortDescription,
    product.description,
    product.warranty,
    ...product.features,
    product.specifications.size,
    product.specifications.sweep,
    product.specifications.rpm,
    product.specifications.wattage,
    product.specifications.voltage,
    product.specifications.frequency,
    product.specifications.motorType,
    product.specifications.winding,
    product.specifications.blades,
    product.specifications.airDelivery,
    product.specifications.noise,
    product.specifications.bodyMaterial,
    product.specifications.bladeMaterial,
    ...(product.specifications.colors ?? []),
  ]
    .filter(Boolean)
    .join(" ");
}

export default function NavSearchBar({
  variant = "navbar",
  className = "",
  products = [],
  onCloseMobile,
}: NavSearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const normalizedQuery = normalize(query);

  const matchingProducts = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return products
      .map((product) => {
        const text = normalize(getProductSearchText(product));

        let score = 0;

        if (normalize(product.name).includes(normalizedQuery)) {
          score += 100;
        }

        if (
          product.model &&
          normalize(product.model).includes(normalizedQuery)
        ) {
          score += 80;
        }

        if (normalize(product.category).includes(normalizedQuery)) {
          score += 50;
        }

        if (text.includes(normalizedQuery)) {
          score += 20;
        }

        const words = normalizedQuery.split(" ");

        words.forEach((word) => {
          if (word.length < 2) {
            return;
          }

          if (text.includes(word)) {
            score += 5;
          }
        });

        return {
          product,
          score,
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((item) => item.product);
  }, [normalizedQuery, products]);

  const matchingCategories = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return CATEGORIES.filter((category) => {
      const categoryText = normalize(
        `${category.label} ${category.keywords.join(" ")}`
      );

      return (
        categoryText.includes(normalizedQuery) ||
        normalizedQuery
          .split(" ")
          .some((word) => word.length > 1 && categoryText.includes(word))
      );
    }).slice(0, 3);
  }, [normalizedQuery]);

  const popularResults = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return POPULAR_SEARCHES.filter((item) =>
      normalize(item).includes(normalizedQuery)
    ).slice(0, 5);
  }, [normalizedQuery]);

  const resultCount =
    matchingCategories.length +
    matchingProducts.length +
    popularResults.length;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  const clearSearch = () => {
    setQuery("");
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleSearch = () => {
    if (!query.trim()) {
      return;
    }

    setIsOpen(true);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (resultCount === 0) {
        return;
      }

      setSelectedIndex((current) =>
        current >= resultCount - 1 ? 0 : current + 1
      );

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (resultCount === 0) {
        return;
      }

      setSelectedIndex((current) =>
        current <= 0 ? resultCount - 1 : current - 1
      );

      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const isMobile = variant === "mobile";

  return (
    <div
      ref={wrapperRef}
      className={`relative ${isMobile ? "w-full" : ""} ${className}`}
    >
      {/* =====================================================
          SEARCH INPUT
      ====================================================== */}
      <div
        className={`relative flex items-center ${
          isMobile
            ? "w-full"
            : "w-full"
        }`}
      >
        <Search
          className={`absolute left-3 pointer-events-none ${
            isMobile
              ? "w-4 h-4 text-slate-400"
              : "w-3.5 h-3.5 text-slate-400"
          }`}
        />

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search fans..."
          aria-label="Search fans"
          autoComplete="off"
          className={`w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-[#091a32] focus:ring-2 focus:ring-[#091a32]/10 ${
            isMobile
              ? "h-11 rounded-xl pl-10 pr-20 text-sm"
              : "h-9 rounded-lg pl-9 pr-16 text-xs"
          }`}
        />

        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className={`absolute ${
              isMobile ? "right-10" : "right-8"
            } p-1 text-slate-400 hover:text-slate-700`}
            aria-label="Clear search"
          >
            <X
              className={
                isMobile ? "w-4 h-4" : "w-3.5 h-3.5"
              }
            />
          </button>
        )}

        {isMobile && onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="absolute right-2 p-1.5 text-slate-400 hover:text-slate-800"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* =====================================================
          SEARCH DROPDOWN
      ====================================================== */}
      {isOpen && (
        <div
          className={`absolute ${
            isMobile
              ? "left-0 right-0 top-full mt-2"
              : "right-0 top-full mt-2 w-[390px]"
          } z-[100] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl`}
        >
          {/* Empty state */}
          {!query.trim() && (
            <div className="p-4">
              <div className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Popular Searches
              </div>

              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setQuery(item);
                      setIsOpen(true);
                      inputRef.current?.focus();
                    }}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-[#091a32]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search results */}
          {query.trim() && (
            <div className="max-h-[480px] overflow-y-auto">
              {/* Categories */}
              {matchingCategories.length > 0 && (
                <div className="border-b border-slate-100 p-2">
                  <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Categories
                  </div>

                  {matchingCategories.map((category) => {
                    const Icon = getCategoryIcon(category.id);

                    return (
                      <Link
                        key={category.id}
                        href={category.href}
                        onClick={() => {
                          setIsOpen(false);
                          onCloseMobile?.();
                        }}
                        className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-slate-50"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                          <Icon className="h-4 w-4 text-[#091a32]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-800">
                            {category.label}
                          </div>

                          <div className="text-[10px] text-slate-400">
                            Browse this product category
                          </div>
                        </div>

                        <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Products */}
              {matchingProducts.length > 0 && (
                <div className="border-b border-slate-100 p-2">
                  <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Products
                  </div>

                  {matchingProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={() => {
                        setIsOpen(false);
                        onCloseMobile?.();
                      }}
                      className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-slate-50"
                    >
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Fan className="h-4 w-4 text-slate-300" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-bold text-slate-800">
                          {product.name}
                        </div>

                        {product.model && (
                          <div className="truncate text-[10px] text-slate-400">
                            {product.model}
                          </div>
                        )}

                        {product.specifications?.sweep && (
                          <div className="text-[10px] text-slate-500">
                            {product.specifications.sweep}
                          </div>
                        )}
                      </div>

                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    </Link>
                  ))}
                </div>
              )}

              {/* Popular search matches */}
              {popularResults.length > 0 && (
                <div className="p-2">
                  <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Search Suggestions
                  </div>

                  {popularResults.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setQuery(item);
                        inputRef.current?.focus();
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs text-slate-600 hover:bg-slate-50 hover:text-[#091a32]"
                    >
                      <Search className="h-3.5 w-3.5 text-slate-400" />

                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* No results */}
              {resultCount === 0 && (
                <div className="px-5 py-8 text-center">
                  <Search className="mx-auto mb-3 h-7 w-7 text-slate-300" />

                  <div className="text-sm font-bold text-slate-700">
                    No results found
                  </div>

                  <div className="mt-1 text-xs text-slate-400">
                    Try a product name, model, category or specification.
                  </div>

                  <Link
                    href="/products"
                    onClick={() => {
                      setIsOpen(false);
                      onCloseMobile?.();
                    }}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#091a32] px-3 py-2 text-xs font-bold text-white hover:bg-[#0d274c]"
                  >
                    View Product Catalogue
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}

              {/* View all */}
              {resultCount > 0 && (
                <Link
                  href={`/products?q=${encodeURIComponent(query)}`}
                  onClick={() => {
                    setIsOpen(false);
                    onCloseMobile?.();
                  }}
                  className="flex items-center justify-center gap-1.5 border-t border-slate-100 bg-slate-50 px-4 py-3 text-[11px] font-bold text-[#091a32] hover:bg-slate-100"
                >
                  View all results for "{query}"
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}