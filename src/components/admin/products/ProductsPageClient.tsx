"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Search,
  RotateCcw,
  Package,
  Image as ImageIcon,
  Pencil,
  Trash2,
} from "lucide-react";

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
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {/* Back button */}
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
              <Package className="h-5 w-5 text-slate-700" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Products
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your product catalogue, specifications,
                images and publishing status.
              </p>
            </div>
          </div>
        </div>

        {/* Add Product */}
        <Link
          href="/admin/products/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={loadData}
            className="shrink-0 font-semibold underline underline-offset-2 hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filters */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="p-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search products..."
                className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
              />
            </div>

            {/* Category */}
            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
              className="h-11 rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
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
              className="h-11 rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
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
              className="h-11 rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
            >
              <option value="all">All Products</option>
              <option value="featured">Featured</option>
              <option value="not-featured">
                Not Featured
              </option>
            </select>
          </div>

          {/* Filter summary */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {filteredProducts.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">
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
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Clear filters
                </button>
              )}
          </div>
        </div>
      </section>

      {/* Loading */}
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading products...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Empty */
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100">
            <Package className="h-6 w-6 text-slate-500" />
          </div>

          <h2 className="mt-4 font-semibold text-slate-900">
            No products found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Try changing your search or filters.
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <section className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Product
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Category
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Price
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Featured
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => {
                    const available = Boolean(
                      product.is_available,
                    );

                    const featured = Boolean(
                      product.is_featured,
                    );

                    return (
                      <tr
                        key={product.id}
                        className="transition hover:bg-slate-50"
                      >
                        {/* Product */}
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {product.name}
                            </p>

                            {product.model && (
                              <p className="mt-0.5 text-xs text-slate-500">
                                Model: {product.model}
                              </p>
                            )}

                            <p className="mt-0.5 text-xs text-slate-400">
                              /{product.slug}
                            </p>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700">
                            {product.category_name}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-5 py-4">
                          {product.price !== null ? (
                            <div>
                              <p className="font-medium text-slate-900">
                                ₹
                                {Number(
                                  product.price,
                                ).toLocaleString("en-IN")}
                              </p>

                              {product.mrp !== null && (
                                <p className="text-xs text-slate-400 line-through">
                                  ₹
                                  {Number(
                                    product.mrp,
                                  ).toLocaleString("en-IN")}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">
                              —
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${available
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                              }`}
                          >
                            {available
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                        {/* Featured */}
                        <td className="px-5 py-4">
                          {featured ? (
                            <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                              Featured
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">
                              —
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/products/${product.id}/images`}
                              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              <ImageIcon className="h-3.5 w-3.5" />
                              Images
                            </Link>

                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              <Pencil className="h-3.5 w-3.5" />
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
                              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />

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

          {/* Mobile / Tablet */}
          <div className="grid gap-4 lg:hidden">
            {filteredProducts.map((product) => {
              const available = Boolean(
                product.is_available,
              );

              const featured = Boolean(
                product.is_featured,
              );

              return (
                <article
                  key={product.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="font-semibold text-slate-900">
                        {product.name}
                      </h2>

                      {product.model && (
                        <p className="mt-1 text-xs text-slate-500">
                          Model: {product.model}
                        </p>
                      )}

                      <p className="mt-1 truncate text-xs text-slate-400">
                        /{product.slug}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${available
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                        }`}
                    >
                      {available
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">
                        Category
                      </p>

                      <p className="mt-1 font-medium text-slate-800">
                        {product.category_name}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">
                        Price
                      </p>

                      <p className="mt-1 font-medium text-slate-800">
                        {product.price !== null
                          ? `₹${Number(
                            product.price,
                          ).toLocaleString("en-IN")}`
                          : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {featured
                        ? "Featured product"
                        : "Not featured"}
                    </span>

                    <span className="text-xs text-slate-400">
                      Sort: {product.sort_order}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Link
                      href={`/admin/products/${product.id}/images`}
                      className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      Images
                    </Link>

                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
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
                      className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-red-200 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />

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
  );
}