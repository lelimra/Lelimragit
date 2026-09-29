"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Category = {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  model: string | null;
  short_description: string | null;
  description: string | null;
  price: number | null;
  mrp: number | null;
  warranty: string | null;
  is_available: boolean | number;
  is_featured: boolean | number;
  sort_order: number;
  category_id: number;
  category_name: string;
  category_slug: string;
};

export default function ProductsPageClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");

  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [productsResponse, categoriesResponse] =
        await Promise.all([
          fetch("/api/admin/products", {
            cache: "no-store",
          }),
          fetch("/api/admin/categories", {
            cache: "no-store",
          }),
        ]);

      const productsData = await productsResponse.json();
      const categoriesData = await categoriesResponse.json();

      if (!productsResponse.ok) {
        throw new Error(
          productsData.error || "Failed to load products."
        );
      }

      if (!categoriesResponse.ok) {
        throw new Error(
          categoriesData.error || "Failed to load categories."
        );
      }

      setProducts(productsData.products || []);
      setCategories(categoriesData.categories || []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.model || "").toLowerCase().includes(query) ||
        product.slug.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "all" ||
        String(product.category_id) === categoryFilter;

      const available = Boolean(product.is_available);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && available) ||
        (statusFilter === "inactive" && !available);

      const featured = Boolean(product.is_featured);

      const matchesFeatured =
        featuredFilter === "all" ||
        (featuredFilter === "featured" && featured) ||
        (featuredFilter === "not-featured" && !featured);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesFeatured
      );
    });
  }, [
    products,
    search,
    categoryFilter,
    statusFilter,
    featuredFilter,
  ]);

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Delete "${product.name}"?\n\nThis will also delete its specifications, colors, features and images.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(product.id);
      setError("");

      const response = await fetch(
        `/api/admin/products/${product.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete product."
        );
      }

      setProducts((current) =>
        current.filter((item) => item.id !== product.id)
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  }

  function resetFilters() {
    setSearch("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setFeaturedFilter("all");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-black sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Products
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your product catalogue, specifications,
              images and publishing status.
            </p>
          </div>

          <Link
            href="/en/admin/products/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            <span className="text-lg leading-none">+</span>
            Add Product
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            <span>{error}</span>

            <button
              type="button"
              onClick={loadData}
              className="shrink-0 font-medium underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Filters */}
        <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search products..."
                className="w-full rounded-xl border border-gray-200 bg-transparent py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-gray-500 dark:border-gray-700"
              />
            </div>

            {/* Category */}
            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 dark:border-gray-700 dark:bg-gray-950"
            >
              <option value="all">All Categories</option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 dark:border-gray-700 dark:bg-gray-950"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Featured */}
            <select
              value={featuredFilter}
              onChange={(event) =>
                setFeaturedFilter(event.target.value)
              }
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 dark:border-gray-700 dark:bg-gray-950"
            >
              <option value="all">All Products</option>
              <option value="featured">Featured</option>
              <option value="not-featured">
                Not Featured
              </option>
            </select>
          </div>

          {/* Filter summary */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {filteredProducts.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {products.length}
              </span>{" "}
              products
            </p>

            {(search ||
              categoryFilter !== "all" ||
              statusFilter !== "all" ||
              featuredFilter !== "all") && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm font-medium text-gray-700 underline underline-offset-4 hover:text-black dark:text-gray-300 dark:hover:text-white"
              >
                Clear filters
              </button>
            )}
          </div>
        </section>

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-700 dark:border-t-white" />

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Loading products...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty */
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-950">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-900">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M6 2h12v20H6z" />
                <path d="M9 6h6" />
                <path d="M9 10h6" />
                <path d="M9 14h4" />
              </svg>
            </div>

            <h2 className="mt-4 font-semibold text-gray-900 dark:text-white">
              No products found
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try changing your search or filters.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <section className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 lg:block">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Product
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Category
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Price
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Featured
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredProducts.map((product) => {
                      const available = Boolean(
                        product.is_available
                      );

                      const featured = Boolean(
                        product.is_featured
                      );

                      return (
                        <tr
                          key={product.id}
                          className="transition hover:bg-gray-50/70 dark:hover:bg-gray-900/40"
                        >
                          <td className="px-5 py-4">
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {product.name}
                              </p>

                              {product.model && (
                                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                  Model: {product.model}
                                </p>
                              )}

                              <p className="mt-0.5 text-xs text-gray-400">
                                /{product.slug}
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                              {product.category_name}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            {product.price !== null ? (
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  ₹
                                  {Number(
                                    product.price
                                  ).toLocaleString("en-IN")}
                                </p>

                                {product.mrp !== null && (
                                  <p className="text-xs text-gray-400 line-through">
                                    ₹
                                    {Number(
                                      product.mrp
                                    ).toLocaleString("en-IN")}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">
                                —
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                available
                                  ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                                  : "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400"
                              }`}
                            >
                              {available
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            {featured ? (
                              <span className="text-sm font-medium text-amber-600">
                                Featured
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">
                                —
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <Link
                                href={`/en/admin/products/${product.id}/images`}
                                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
                              >
                                Images
                              </Link>

                              <Link
                                href={`/en/admin/products/${product.id}/edit`}
                                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
                              >
                                Edit
                              </Link>

                              <button
                                type="button"
                                disabled={
                                  deletingId === product.id
                                }
                                onClick={() =>
                                  deleteProduct(product)
                                }
                                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950/30"
                              >
                                {deletingId === product.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Mobile/tablet cards */}
            <div className="grid gap-4 lg:hidden">
              {filteredProducts.map((product) => {
                const available = Boolean(
                  product.is_available
                );

                const featured = Boolean(
                  product.is_featured
                );

                return (
                  <article
                    key={product.id}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                          {product.name}
                        </h2>

                        {product.model && (
                          <p className="mt-1 text-xs text-gray-500">
                            Model: {product.model}
                          </p>
                        )}

                        <p className="mt-1 truncate text-xs text-gray-400">
                          /{product.slug}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          available
                            ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400"
                        }`}
                      >
                        {available ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-900">
                        <p className="text-xs text-gray-400">
                          Category
                        </p>

                        <p className="mt-1 font-medium text-gray-800 dark:text-gray-200">
                          {product.category_name}
                        </p>
                      </div>

                      <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-900">
                        <p className="text-xs text-gray-400">
                          Price
                        </p>

                        <p className="mt-1 font-medium text-gray-800 dark:text-gray-200">
                          {product.price !== null
                            ? `₹${Number(
                                product.price
                              ).toLocaleString("en-IN")}`
                            : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {featured
                          ? "Featured product"
                          : "Not featured"}
                      </span>

                      <span className="text-xs text-gray-400">
                        Sort: {product.sort_order}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <Link
                        href={`/en/admin/products/${product.id}/images`}
                        className="rounded-lg border border-gray-200 px-2 py-2 text-center text-xs font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
                      >
                        Images
                      </Link>

                      <Link
                        href={`/en/admin/products/${product.id}/edit`}
                        className="rounded-lg border border-gray-200 px-2 py-2 text-center text-xs font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        disabled={
                          deletingId === product.id
                        }
                        onClick={() =>
                          deleteProduct(product)
                        }
                        className="rounded-lg border border-red-200 px-2 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950/30"
                      >
                        {deletingId === product.id
                          ? "..."
                          : "Delete"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}