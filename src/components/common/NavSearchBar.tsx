"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  X,
  ArrowUpRight,
  Fan,
  Wind,
  ShieldCheck,
} from "lucide-react";

import { Link } from "@/lib/navigation";
import type {
  BackendProduct,
  ProductCategory,
} from "@/types/product";

type SearchVariant = "navbar" | "mobile";

interface NavSearchBarProps {
  variant?: SearchVariant;
  className?: string;
  products?: BackendProduct[];
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

function normalize(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => normalize(item))
      .filter(Boolean)
      .join(" ");
  }

  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>)
      .map((item) => normalize(item))
      .filter(Boolean)
      .join(" ");
  }

  return String(value)
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

/**
 * Converts the complete backend product into searchable text.
 *
 * This intentionally works with BackendProduct instead of Product
 * because products are loaded directly from the backend API.
 */
function getProductSearchText(product: BackendProduct): string {
  const specificationText = product.specifications
    ? Object.values(product.specifications)
        .map((value) => normalize(value))
        .filter(Boolean)
        .join(" ")
    : "";

  return [
    product.name,
    product.model,
    product.category,
    product.description,
    product.warranty,
    product.image,
    product.images,
    product.price,
    product.mrp,
    product.available,
    product.featured,
    product.features,
    product.shortDescription,
    product.company,
    specificationText,
  ]
    .map((value) => normalize(value))
    .filter(Boolean)
    .join(" ");
}

function getProductCategory(
  product: BackendProduct
): ProductCategory | null {
  const category = normalize(product.category);

  if (
    category === "ceiling-fan" ||
    category.includes("ceiling")
  ) {
    return "ceiling-fan";
  }

  if (
    category === "table-fan" ||
    category.includes("table")
  ) {
    return "table-fan";
  }

  if (
    category === "pedestal-fan" ||
    category.includes("pedestal")
  ) {
    return "pedestal-fan";
  }

  return null;
}

function getProductImage(product: BackendProduct): string | undefined {
  if (
    Array.isArray(product.images) &&
    typeof product.images[0] === "string" &&
    product.images[0].trim()
  ) {
    return product.images[0];
  }

  if (
    typeof product.image === "string" &&
    product.image.trim()
  ) {
    return product.image;
  }

  return undefined;
}

function getSpecification(
  product: BackendProduct,
  key: string
): string | undefined {
  const value = product.specifications?.[key];

  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return undefined;
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

        const productName = normalize(product.name);
        const productModel = normalize(product.model);
        const productCategory = normalize(product.category);

        if (
          productName &&
          productName.includes(normalizedQuery)
        ) {
          score += 100;
        }

        if (
          productModel &&
          productModel.includes(normalizedQuery)
        ) {
          score += 80;
        }

        if (
          productCategory &&
          productCategory.includes(normalizedQuery)
        ) {
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
          .some(
            (word) =>
              word.length > 1 &&
              categoryText.includes(word)
          )
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
        !wrapperRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
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
      className={`relative ${
        isMobile ? "w-full" : ""
      } ${className}`}
    >
      {/* SEARCH INPUT */}
      <div
        className={`relative flex items-center ${
          isMobile ? "w-full" : "w-full"
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
                isMobile
                  ? "w-4 h-4"
                  : "w-3.5 h-3.5"
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

      {/* SEARCH DROPDOWN */}
      {isOpen && (
        <div
          className={`absolute ${
            isMobile
              ? "left-0 right-0 top-full mt-2"
              : "right-0 top-full mt-2 w-[390px]"
          } z-[100] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl`}
        >
          {/* POPULAR SEARCHES */}
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

          {/* SEARCH RESULTS */}
          {query.trim() && (
            <div className="max-h-[480px] overflow-y-auto">
              {/* CATEGORIES */}
              {matchingCategories.length > 0 && (
                <div className="border-b border-slate-100 p-2">
                  <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Categories
                  </div>

                  {matchingCategories.map((category) => {
                    const Icon = getCategoryIcon(
                      category.id
                    );

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

              {/* PRODUCTS */}
              {matchingProducts.length > 0 && (
                <div className="border-b border-slate-100 p-2">
                  <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Products
                  </div>

                  {matchingProducts.map((product) => {
                    const image = getProductImage(product);
                    const sweep = getSpecification(
                      product,
                      "sweep"
                    );

                    return (
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
                          {image ? (
                            <img
                              src={image}
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

                          {sweep && (
                            <div className="text-[10px] text-slate-500">
                              {sweep}
                            </div>
                          )}
                        </div>

                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* POPULAR SEARCH MATCHES */}
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

              {/* NO RESULTS */}
              {resultCount === 0 && (
                <div className="px-5 py-8 text-center">
                  <Search className="mx-auto mb-3 h-7 w-7 text-slate-300" />

                  <div className="text-sm font-bold text-slate-700">
                    No results found
                  </div>

                  <div className="mt-1 text-xs text-slate-400">
                    Try a product name, model, category or
                    specification.
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

              {/* VIEW ALL */}
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