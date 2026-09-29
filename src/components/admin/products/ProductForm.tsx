"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductSpecificationsForm from "./ProductSpecificationsForm";

type Category = {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    is_active: boolean | number;
};

type ProductFormProps = {
    mode: "create" | "edit";
    productId?: number;
};

type FormData = {
    name: string;
    model: string;
    slug: string;
    category_id: string;
    short_description: string;
    description: string;

    price: string;
    mrp: string;
    warranty: string;

    is_available: boolean;
    is_featured: boolean;
    sort_order: string;
};

const initialForm: FormData = {
    name: "",
    model: "",
    slug: "",
    category_id: "",
    short_description: "",
    description: "",

    price: "",
    mrp: "",
    warranty: "",

    is_available: true,
    is_featured: false,
    sort_order: "0",
};

export default function ProductForm({
    mode,
    productId,
}: ProductFormProps) {
    const [form, setForm] = useState<FormData>(initialForm);

    const [categories, setCategories] = useState<Category[]>([]);

    const [loadingCategories, setLoadingCategories] =
        useState(true);

    const [loadingProduct, setLoadingProduct] =
        useState(mode === "edit");

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadCategories();

        if (mode === "edit" && productId) {
            loadProduct(productId);
        }
    }, [mode, productId]);

    async function loadCategories() {
        try {
            setLoadingCategories(true);

            const response = await fetch(
                "/api/admin/categories",
                {
                    cache: "no-store",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to load categories."
                );
            }

            setCategories(
                (data.categories || []).filter(
                    (category: Category) =>
                        Boolean(category.is_active)
                )
            );
        } catch (err) {
            console.error(err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load categories."
            );
        } finally {
            setLoadingCategories(false);
        }
    }

    async function loadProduct(id: number) {
        try {
            setLoadingProduct(true);
            setError("");

            const response = await fetch(
                `/api/admin/products/${id}`,
                {
                    cache: "no-store",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to load product."
                );
            }

            const product = data.product;

            setForm({
                name: product.name || "",
                model: product.model || "",
                slug: product.slug || "",
                category_id: String(
                    product.category_id || ""
                ),
                short_description:
                    product.short_description || "",
                description: product.description || "",

                price:
                    product.price !== null &&
                        product.price !== undefined
                        ? String(product.price)
                        : "",

                mrp:
                    product.mrp !== null &&
                        product.mrp !== undefined
                        ? String(product.mrp)
                        : "",

                warranty: product.warranty || "",

                is_available: Boolean(product.is_available),

                is_featured: Boolean(product.is_featured),

                sort_order:
                    product.sort_order !== undefined
                        ? String(product.sort_order)
                        : "0",
            });
        } catch (err) {
            console.error(err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load product."
            );
        } finally {
            setLoadingProduct(false);
        }
    }

    function updateField<K extends keyof FormData>(
        field: K,
        value: FormData[K]
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function generateSlug(value: string) {
        return value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    }

    function handleNameChange(value: string) {
        updateField("name", value);

        // Automatically generate slug only while creating.
        if (mode === "create") {
            updateField("slug", generateSlug(value));
        }
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!form.name.trim()) {
            setError("Product name is required.");
            return;
        }

        if (!form.slug.trim()) {
            setError("Product slug is required.");
            return;
        }

        if (!form.category_id) {
            setError("Please select a category.");
            return;
        }

        const price =
            form.price.trim() === ""
                ? null
                : Number(form.price);

        const mrp =
            form.mrp.trim() === ""
                ? null
                : Number(form.mrp);

        const sortOrder =
            form.sort_order.trim() === ""
                ? 0
                : Number(form.sort_order);

        if (
            price !== null &&
            (!Number.isFinite(price) || price < 0)
        ) {
            setError("Selling price must be a valid number.");
            return;
        }

        if (
            mrp !== null &&
            (!Number.isFinite(mrp) || mrp < 0)
        ) {
            setError("MRP must be a valid number.");
            return;
        }

        if (!Number.isInteger(sortOrder) || sortOrder < 0) {
            setError(
                "Sort order must be a non-negative integer."
            );
            return;
        }

        try {
            setSaving(true);

            const payload = {
                name: form.name.trim(),
                model: form.model.trim() || null,
                slug: form.slug.trim(),

                category_id: Number(form.category_id),

                short_description:
                    form.short_description.trim() || null,

                description: form.description.trim() || null,

                price,
                mrp,

                warranty: form.warranty.trim() || null,

                is_available: form.is_available,
                is_featured: form.is_featured,

                sort_order: sortOrder,
            };

            const url =
                mode === "create"
                    ? "/api/admin/products"
                    : `/api/admin/products/${productId}`;

            const response = await fetch(url, {
                method: mode === "create" ? "POST" : "PUT",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to save product."
                );
            }

            if (mode === "create") {
                const createdId =
                    data.product?.id || data.id;

                setSuccess(
                    "Product created successfully."
                );

                /*
                 * Redirect to the edit page after creation.
                 * This gives us the newly-created product ID,
                 * which we'll use for specifications, colors,
                 * features and images.
                 */
                if (createdId) {
                    window.location.href = `/en/admin/products/${createdId}/edit`;
                    return;
                }
            } else {
                setSuccess(
                    "Product updated successfully."
                );
            }
        } catch (err) {
            console.error(err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to save product."
            );
        } finally {
            setSaving(false);
        }
    }

    if (loadingProduct) {
        return (
            <main className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-black sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-950">
                    <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-700 dark:border-t-white" />

                    <p className="mt-4 text-sm text-gray-500">
                        Loading product...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-black sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2">
                            <Link
                                href="/en/admin/products"
                                className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white"
                            >
                                ← Back to Products
                            </Link>
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {mode === "create"
                                ? "Add Product"
                                : "Edit Product"}
                        </h1>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {mode === "create"
                                ? "Create a new product for the catalogue."
                                : "Update the product information."}
                        </p>
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
                        {success}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {/* Basic information */}
                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Basic Information
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Basic product information used throughout
                                the catalogue.
                            </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            {/* Name */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Product Name *
                                </label>

                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(event) =>
                                        handleNameChange(
                                            event.target.value
                                        )
                                    }
                                    placeholder="e.g. AeroFlow"
                                    required
                                    className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-gray-500 dark:border-gray-700"
                                />
                            </div>

                            {/* Model */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Model
                                </label>

                                <input
                                    type="text"
                                    value={form.model}
                                    onChange={(event) =>
                                        updateField(
                                            "model",
                                            event.target.value
                                        )
                                    }
                                    placeholder="e.g. CF-01"
                                    className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-gray-500 dark:border-gray-700"
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Slug *
                                </label>

                                <input
                                    type="text"
                                    value={form.slug}
                                    onChange={(event) =>
                                        updateField(
                                            "slug",
                                            generateSlug(
                                                event.target.value
                                            )
                                        )
                                    }
                                    placeholder="aeroflow"
                                    required
                                    className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-gray-500 dark:border-gray-700"
                                />

                                <p className="mt-1.5 text-xs text-gray-400">
                                    Used in the product URL.
                                </p>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Category *
                                </label>

                                <select
                                    value={form.category_id}
                                    onChange={(event) =>
                                        updateField(
                                            "category_id",
                                            event.target.value
                                        )
                                    }
                                    required
                                    disabled={loadingCategories}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-500 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-950"
                                >
                                    <option value="">
                                        {loadingCategories
                                            ? "Loading categories..."
                                            : "Select category"}
                                    </option>

                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Short description */}
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Short Description
                                </label>

                                <textarea
                                    value={form.short_description}
                                    onChange={(event) =>
                                        updateField(
                                            "short_description",
                                            event.target.value
                                        )
                                    }
                                    rows={3}
                                    maxLength={500}
                                    placeholder="A short description for product cards and listings."
                                    className="w-full resize-y rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-gray-500 dark:border-gray-700"
                                />

                                <p className="mt-1.5 text-right text-xs text-gray-400">
                                    {form.short_description.length}/500
                                </p>
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Product Description
                                </label>

                                <textarea
                                    value={form.description}
                                    onChange={(event) =>
                                        updateField(
                                            "description",
                                            event.target.value
                                        )
                                    }
                                    rows={6}
                                    placeholder="Detailed product description."
                                    className="w-full resize-y rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-gray-500 dark:border-gray-700"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Pricing */}
                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Pricing & Warranty
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Pricing information displayed for the
                                product.
                            </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-3">
                            {/* MRP */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    MRP
                                </label>

                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                        ₹
                                    </span>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.mrp}
                                        onChange={(event) =>
                                            updateField(
                                                "mrp",
                                                event.target.value
                                            )
                                        }
                                        placeholder="2999"
                                        className="w-full rounded-xl border border-gray-200 bg-transparent py-3 pl-8 pr-4 text-sm outline-none transition focus:border-gray-500 dark:border-gray-700"
                                    />
                                </div>
                            </div>

                            {/* Selling price */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Selling Price
                                </label>

                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                        ₹
                                    </span>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.price}
                                        onChange={(event) =>
                                            updateField(
                                                "price",
                                                event.target.value
                                            )
                                        }
                                        placeholder="2499"
                                        className="w-full rounded-xl border border-gray-200 bg-transparent py-3 pl-8 pr-4 text-sm outline-none transition focus:border-gray-500 dark:border-gray-700"
                                    />
                                </div>
                            </div>

                            {/* Warranty */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Warranty
                                </label>

                                <input
                                    type="text"
                                    value={form.warranty}
                                    onChange={(event) =>
                                        updateField(
                                            "warranty",
                                            event.target.value
                                        )
                                    }
                                    placeholder="e.g. 2 Year"
                                    className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-gray-500 dark:border-gray-700"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Publishing */}
                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Publishing
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Control how this product appears on the
                                website.
                            </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-3">
                            {/* Available */}
                            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                                <input
                                    type="checkbox"
                                    checked={form.is_available}
                                    onChange={(event) =>
                                        updateField(
                                            "is_available",
                                            event.target.checked
                                        )
                                    }
                                    className="mt-0.5 h-4 w-4"
                                />

                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Available
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Product is available on the website.
                                    </p>
                                </div>
                            </label>

                            {/* Featured */}
                            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                                <input
                                    type="checkbox"
                                    checked={form.is_featured}
                                    onChange={(event) =>
                                        updateField(
                                            "is_featured",
                                            event.target.checked
                                        )
                                    }
                                    className="mt-0.5 h-4 w-4"
                                />

                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Featured
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Show this product in featured sections.
                                    </p>
                                </div>
                            </label>

                            {/* Sort order */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Sort Order
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={form.sort_order}
                                    onChange={(event) =>
                                        updateField(
                                            "sort_order",
                                            event.target.value
                                        )
                                    }
                                    className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-gray-500 dark:border-gray-700"
                                />

                                <p className="mt-1.5 text-xs text-gray-400">
                                    Lower numbers appear first.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href="/en/admin/products"
                            className="rounded-xl border border-gray-200 px-5 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            {saving
                                ? mode === "create"
                                    ? "Creating..."
                                    : "Saving..."
                                : mode === "create"
                                    ? "Create Product"
                                    : "Save Changes"}
                        </button>
                    </div>
                </form>
                {mode === "edit" && productId && (
                    <ProductSpecificationsForm productId={productId} />
                )}
            </div>
        </main>
    );
}