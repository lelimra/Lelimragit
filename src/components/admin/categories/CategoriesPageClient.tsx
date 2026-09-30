"use client";

import { useEffect, useMemo, useState } from "react";
import type { Category } from "@/types/category";

type FormState = {
  name: string;
  slug: string;
  description: string;
  image: string;
  is_active: boolean;
  sort_order: number;
};

const initialForm: FormState = {
  name: "",
  slug: "",
  description: "",
  image: "",
  is_active: true,
  sort_order: 0,
};

type StatusFilter = "all" | "active" | "inactive";

export default function CategoriesPageClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [form, setForm] = useState<FormState>(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD CATEGORIES
  ========================================================= */

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/categories", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load categories"
        );
      }

      setCategories(data.categories || []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  /* =========================================================
     METRICS
  ========================================================= */

  const stats = useMemo(() => {
    const total = categories.length;

    const active = categories.filter(
      (category) => Boolean(category.is_active)
    ).length;

    const inactive = total - active;

    return {
      total,
      active,
      inactive,
    };
  }, [categories]);

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesSearch =
        !query ||
        category.name.toLowerCase().includes(query) ||
        category.slug.toLowerCase().includes(query) ||
        Boolean(
          category.description
            ?.toLowerCase()
            .includes(query)
        );

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
            ? Boolean(category.is_active)
            : !category.is_active;

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  /* =========================================================
     SLUG
  ========================================================= */

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleNameChange(value: string) {
    setForm((current) => ({
      ...current,
      name: value,
      slug: editingCategory
        ? current.slug
        : createSlug(value),
    }));
  }

  /* =========================================================
     MODAL
  ========================================================= */

  function openAddModal() {
    setEditingCategory(null);

    setForm({
      ...initialForm,
      sort_order: categories.length,
    });

    setError("");
    setShowModal(true);
  }

  function openEditModal(category: Category) {
    setEditingCategory(category);

    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image: category.image || "",
      is_active: Boolean(category.is_active),
      sort_order: category.sort_order,
    });

    setError("");
    setShowModal(true);
  }

  function closeModal() {
    if (saving) return;

    setShowModal(false);
    setEditingCategory(null);
    setForm(initialForm);
    setError("");
  }

  /* =========================================================
     CREATE / UPDATE
  ========================================================= */

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }

    if (!form.slug.trim()) {
      setError("Category slug is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const isEditing = Boolean(editingCategory);

      const url = isEditing
        ? `/api/admin/categories/${editingCategory!.id}`
        : "/api/admin/categories";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          slug: form.slug.trim(),
          description:
            form.description.trim() || null,
          image: form.image.trim() || null,
          is_active: form.is_active,
          sort_order: Number(form.sort_order) || 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            `Failed to ${
              isEditing ? "update" : "create"
            } category`
        );
      }

      closeModal();
      await loadCategories();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     TOGGLE STATUS
  ========================================================= */

  async function toggleStatus(category: Category) {
    try {
      const response = await fetch(
        `/api/admin/categories/${category.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: category.name,
            slug: category.slug,
            description: category.description,
            image: category.image,
            is_active: !category.is_active,
            sort_order: category.sort_order,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update category"
        );
      }

      await loadCategories();
    } catch (err) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to update category"
      );
    }
  }

  /* =========================================================
     DELETE
  ========================================================= */

  async function deleteCategory(category: Category) {
    const confirmed = window.confirm(
      `Delete "${category.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/admin/categories/${category.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete category"
        );
      }

      await loadCategories();
    } catch (err) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete category"
      );
    }
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="min-h-screen bg-transparent p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Categories
              </h1>

              <span className="inline-flex items-center rounded-full border border-slate-200/70 bg-white/50 px-2.5 py-0.5 text-xs font-semibold text-slate-600 backdrop-blur-sm">
                {categories.length} Total
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Manage and organize product taxonomy, visibility,
              and sorting across your store.
            </p>
          </div>

          <div className="flex items-center gap-3">

            {/* Refresh */}

            <button
              type="button"
              onClick={loadCategories}
              disabled={loading}
              title="Refresh categories"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200/70 bg-white/50 p-2.5 text-slate-600 shadow-sm backdrop-blur-sm transition hover:bg-white/80 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                className={`h-4 w-4 ${
                  loading ? "animate-spin" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>

            {/* Add Category */}

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:bg-slate-950"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>

              Add Category
            </button>
          </div>
        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && !showModal && (
          <div className="flex items-center justify-between rounded-xl border border-red-200/70 bg-red-50/70 p-4 text-sm text-red-800 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <svg
                className="h-5 w-5 shrink-0 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 1.732 3.34z"
                />
              </svg>

              <p className="font-medium">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-500 transition hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* =====================================================
            KPI CARDS
        ===================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* Total */}

          <div className="rounded-xl border border-slate-200/70 bg-white/55 p-5 shadow-sm backdrop-blur-sm transition hover:border-slate-300/80">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Total Categories
              </span>

              <div className="rounded-md border border-slate-200/70 bg-slate-100/60 p-2">
                <svg
                  className="h-4 w-4 text-slate-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>

            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              {stats.total}
            </p>
          </div>

          {/* Active */}

          <div className="rounded-xl border border-slate-200/70 bg-white/55 p-5 shadow-sm backdrop-blur-sm transition hover:border-slate-300/80">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Active Categories
              </span>

              <div className="rounded-md bg-emerald-50/80 p-2">
                <svg
                  className="h-4 w-4 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <p className="mt-3 text-3xl font-bold tracking-tight text-emerald-600">
              {stats.active}
            </p>
          </div>

          {/* Inactive */}

          <div className="rounded-xl border border-slate-200/70 bg-white/55 p-5 shadow-sm backdrop-blur-sm transition hover:border-slate-300/80">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Inactive
              </span>

              <div className="rounded-md bg-amber-50/80 p-2">
                <svg
                  className="h-4 w-4 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
              </div>
            </div>

            <p className="mt-3 text-3xl font-bold tracking-tight text-amber-600">
              {stats.inactive}
            </p>
          </div>
        </div>

        {/* =====================================================
            TOOLBAR
        ===================================================== */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          {/* Status Tabs */}

          <div className="flex rounded-lg border border-slate-200/70 bg-white/50 p-1 shadow-sm backdrop-blur-sm">
            {(["all", "active", "inactive"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() =>
                    setStatusFilter(tab)
                  }
                  className={`rounded-md px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
                    statusFilter === tab
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          {/* Search */}

          <div className="relative w-full sm:max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-4 w-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search categories..."
              className="w-full rounded-lg border border-slate-200/70 bg-white/60 py-2 pl-9 pr-8 text-sm text-slate-900 outline-none backdrop-blur-sm transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 transition hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* =====================================================
            TABLE
        ===================================================== */}

        <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white/55 shadow-sm backdrop-blur-sm">
          {loading ? (
            <div className="divide-y divide-slate-200/60 p-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="flex animate-pulse items-center justify-between py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-slate-200/70" />

                    <div className="space-y-2">
                      <div className="h-4 w-32 rounded bg-slate-200/70" />
                      <div className="h-3 w-48 rounded bg-slate-100/80" />
                    </div>
                  </div>

                  <div className="h-6 w-16 rounded-full bg-slate-200/70" />

                  <div className="h-8 w-20 rounded-lg bg-slate-200/70" />
                </div>
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            /* Empty State */

            <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200/70 bg-slate-100/60">
                <svg
                  className="h-6 w-6 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">
                No categories found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                {search
                  ? `No categories matching "${search}". Try clearing your search query.`
                  : "Get started by adding your first product category."}
              </p>

              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-4 text-xs font-semibold text-slate-900 underline underline-offset-4 hover:text-slate-600"
                >
                  Clear search
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openAddModal}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  + Add Category
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200/70 bg-white/25 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th
                        scope="col"
                        className="px-6 py-3.5"
                      >
                        Category
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3.5"
                      >
                        Slug
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3.5"
                      >
                        Status
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3.5"
                      >
                        Sort Order
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3.5 text-right"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200/60">
                    {filteredCategories.map(
                      (category) => (
                        <tr
                          key={category.id}
                          className="group transition hover:bg-white/35"
                        >
                          {/* Category */}

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3.5">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200/70 bg-slate-100/60">
                                {category.image ? (
                                  <img
                                    src={category.image}
                                    alt={category.name}
                                    className="h-full w-full object-cover"
                                    onError={(event) => {
                                      (
                                        event.target as HTMLElement
                                      ).style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <svg
                                    className="h-5 w-5 text-slate-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="1.5"
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate font-semibold text-slate-900">
                                  {category.name}
                                </p>

                                {category.description ? (
                                  <p className="max-w-xs truncate text-xs text-slate-500">
                                    {category.description}
                                  </p>
                                ) : (
                                  <span className="text-xs italic text-slate-400">
                                    No description
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Slug */}

                          <td className="px-6 py-4">
                            <code className="rounded bg-slate-100/70 px-2.5 py-1 font-mono text-xs font-medium text-slate-700">
                              {category.slug}
                            </code>
                          </td>

                          {/* Status */}

                          <td className="px-6 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                toggleStatus(category)
                              }
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition hover:opacity-80 ${
                                category.is_active
                                  ? "bg-emerald-50/80 text-emerald-700 ring-1 ring-emerald-600/20"
                                  : "bg-slate-100/80 text-slate-600 ring-1 ring-slate-500/10"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  category.is_active
                                    ? "bg-emerald-500"
                                    : "bg-slate-400"
                                }`}
                              />

                              {category.is_active
                                ? "Active"
                                : "Inactive"}
                            </button>
                          </td>

                          {/* Sort Order */}

                          <td className="px-6 py-4">
                            <span className="inline-flex items-center rounded-md bg-slate-100/70 px-2 py-1 text-xs font-medium text-slate-600">
                              #{category.sort_order}
                            </span>
                          </td>

                          {/* Actions */}

                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(category)
                                }
                                className="rounded-lg border border-slate-200/70 bg-white/50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-slate-900"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteCategory(category)
                                }
                                className="rounded-lg border border-red-200/70 bg-red-50/40 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}

              <div className="flex items-center justify-between border-t border-slate-200/70 bg-white/20 px-6 py-3 text-xs text-slate-500">
                <span>
                  Showing{" "}
                  <strong className="text-slate-700">
                    {filteredCategories.length}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-slate-700">
                    {categories.length}
                  </strong>{" "}
                  categories
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingCategory
                    ? "Edit Category"
                    : "Add New Category"}
                </h2>

                <p className="text-xs text-slate-500">
                  {editingCategory
                    ? "Update the configuration for this category."
                    : "Create a new product taxonomy entry."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-6"
            >
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {error}
                </div>
              )}

              {/* Name */}

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Category Name{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    handleNameChange(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Ceiling Fans"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
                  required
                />
              </div>

              {/* Slug */}

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Slug{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  value={form.slug}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      slug: createSlug(
                        event.target.value
                      ),
                    }))
                  }
                  placeholder="ceiling-fans"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
                  required
                />

                <p className="mt-1 text-xs text-slate-400">
                  Auto-generated from name. Used in website route URLs.
                </p>
              </div>

              {/* Description */}

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description:
                        event.target.value,
                    }))
                  }
                  rows={3}
                  placeholder="Brief overview of items in this category..."
                  className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              {/* Image */}

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Image URL / Path
                </label>

                <input
                  type="text"
                  value={form.image}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      image: event.target.value,
                    }))
                  }
                  placeholder="/images/categories/ceiling-fans.jpg"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              {/* Sort + Status */}

              <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">

                {/* Sort */}

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Display Order
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.sort_order}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        sort_order: Number(
                          event.target.value
                        ),
                      }))
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>

                {/* Status */}

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Visibility Status
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        is_active:
                          !current.is_active,
                      }))
                    }
                    className={`flex w-full items-center justify-between rounded-lg border p-2.5 transition ${
                      form.is_active
                        ? "border-emerald-200 bg-emerald-50/60"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <span className="text-xs font-medium text-slate-800">
                      {form.is_active
                        ? "Active"
                        : "Hidden"}
                    </span>

                    <div
                      className={`relative h-5 w-9 rounded-full transition-colors ${
                        form.is_active
                          ? "bg-emerald-500"
                          : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                          form.is_active
                            ? "translate-x-4"
                            : "translate-x-0"
                        }`}
                      />
                    </div>
                  </button>
                </div>
              </div>

              {/* Footer */}

              <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving && (
                    <svg
                      className="h-3.5 w-3.5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />

                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  )}

                  {saving
                    ? "Saving..."
                    : editingCategory
                      ? "Update Category"
                      : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}