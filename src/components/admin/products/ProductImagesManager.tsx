"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type ProductImage = {
  id: number;
  product_id: number;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at?: string;
};

type Props = {
  productId: number;
};

type SortableImageCardProps = {
  image: ProductImage;
  onPrimary: (id: number) => void;
  onDelete: (image: ProductImage) => void;
  onAltTextUpdate: (id: number, altText: string) => void;
};

function SortableImageCard({
  image,
  onPrimary,
  onDelete,
  onAltTextUpdate,
}: SortableImageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: image.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`overflow-hidden rounded-2xl border bg-white dark:bg-gray-950 ${isDragging
          ? "border-primary shadow-2xl opacity-90"
          : "border-gray-200 dark:border-gray-800"
        }`}
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-900">
        <img
          src={image.image_url}
          alt={image.alt_text || "Product image"}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {image.is_primary && (
          <div className="absolute left-2 top-2 rounded-full bg-black px-3 py-1 text-xs font-medium text-white dark:bg-white dark:text-black">
            Primary
          </div>
        )}

        {/* Drag handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Drag ${image.alt_text || "image"} to reorder`}
          className="absolute right-2 top-2 flex h-9 w-9 cursor-grab touch-none items-center justify-center rounded-lg bg-white/95 text-gray-700 shadow-md backdrop-blur active:cursor-grabbing dark:bg-black/90 dark:text-white"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="5" r="1" />
            <circle cx="15" cy="5" r="1" />
            <circle cx="9" cy="12" r="1" />
            <circle cx="15" cy="12" r="1" />
            <circle cx="9" cy="19" r="1" />
            <circle cx="15" cy="19" r="1" />
          </svg>
        </button>
      </div>

      {/* Details */}
      <div className="space-y-3 p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Position {image.sort_order + 1}
          </span>

          <span className="text-xs text-gray-400">
            ID #{image.id}
          </span>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
            Alt Text
          </label>

          <input
            type="text"
            defaultValue={image.alt_text || ""}
            onBlur={(event) =>
              onAltTextUpdate(image.id, event.target.value)
            }
            placeholder="Describe this image"
            className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-primary dark:border-gray-700"
          />
        </div>

        <div className="flex gap-2">
          {!image.is_primary && (
            <button
              type="button"
              onClick={() => onPrimary(image.id)}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
            >
              Make Primary
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(image)}
            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductImagesManager({
  productId,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [images, setImages] = useState<ProductImage[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [reordering, setReordering] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    loadImages();

    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  async function loadImages() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/admin/products/${productId}/images`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load images"
        );
      }

      const sortedImages = [...(data.images || [])].sort(
        (a: ProductImage, b: ProductImage) =>
          a.sort_order - b.sort_order
      );

      setImages(sortedImages);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load images"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleFileSelect(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      return;
    }

    const validFiles = files.filter((file) => {
      const validType = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type);

      const validSize = file.size <= 5 * 1024 * 1024;

      return validType && validSize;
    });

    if (validFiles.length !== files.length) {
      setError(
        "Some files were skipped. Only JPG, PNG and WEBP images up to 5 MB are allowed."
      );
    } else {
      setError("");
    }

    setSelectedFiles(validFiles);

    const urls = validFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewUrls(urls);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function removeSelectedFile(index: number) {
    const url = previewUrls[index];

    if (url) {
      URL.revokeObjectURL(url);
    }

    setSelectedFiles((current) =>
      current.filter((_, i) => i !== index)
    );

    setPreviewUrls((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  async function uploadImages() {
    if (selectedFiles.length === 0) {
      return;
    }

    try {
      setUploading(true);
      setError("");
      setMessage("");

      let uploadedCount = 0;

      for (const file of selectedFiles) {
        const formData = new FormData();

        formData.append("file", file);

        const response = await fetch(
          `/api/admin/products/${productId}/images/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || `Failed to upload ${file.name}`
          );
        }

        uploadedCount++;
      }

      setMessage(
        `${uploadedCount} image${uploadedCount > 1 ? "s" : ""
        } uploaded successfully.`
      );

      previewUrls.forEach((url) => URL.revokeObjectURL(url));

      setSelectedFiles([]);
      setPreviewUrls([]);

      await loadImages();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload images."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = images.findIndex(
      (image) => image.id === active.id
    );

    const newIndex = images.findIndex(
      (image) => image.id === over.id
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reorderedImages = arrayMove(
      images,
      oldIndex,
      newIndex
    ).map((image, index) => ({
      ...image,
      sort_order: index,
    }));

    // Update UI immediately.
    setImages(reorderedImages);

    try {
      setReordering(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `/api/admin/products/${productId}/images/reorder`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image_ids: reorderedImages.map(
              (image) => image.id
            ),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save image order"
        );
      }

      setMessage("Image order saved.");
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save image order."
      );

      // Restore database order if request failed.
      await loadImages();
    } finally {
      setReordering(false);
    }
  }

  async function setPrimary(imageId: number) {
    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `/api/admin/products/${productId}/images/${imageId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_primary: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to set primary image"
        );
      }

      setMessage("Primary image updated.");

      await loadImages();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update primary image."
      );
    }
  }

  async function deleteImage(image: ProductImage) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `/api/admin/products/${productId}/images/${image.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete image"
        );
      }

      setMessage("Image deleted successfully.");

      await loadImages();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete image."
      );
    }
  }

  async function updateAltText(
    imageId: number,
    altText: string
  ) {
    try {
      const response = await fetch(
        `/api/admin/products/${productId}/images/${imageId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            alt_text: altText,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update alt text"
        );
      }

      setImages((current) =>
        current.map((image) =>
          image.id === imageId
            ? {
              ...image,
              alt_text: altText,
            }
            : image
        )
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update alt text."
      );
    }
  }

  if (loading) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Loading product images...
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Product Images
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Upload, reorder and manage product photos.
          </p>
        </div>

        {reordering && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
            Saving order...
          </div>
        )}
      </div>

      {/* Messages */}
      {message && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Upload area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center transition hover:border-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-900"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M12 16V4" />
            <path d="M7 9l5-5 5 5" />
            <path d="M5 20h14" />
          </svg>
        </div>

        <p className="mt-4 font-medium text-gray-900 dark:text-white">
          Click to select product images
        </p>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          JPG, PNG or WEBP • Maximum 5 MB per image
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Selected previews */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Ready to upload ({selectedFiles.length})
            </h3>

            <button
              type="button"
              onClick={uploadImages}
              disabled={uploading}
              className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {uploading ? "Uploading..." : "Upload Images"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
              >
                <div className="relative aspect-square">
                  <img
                    src={previewUrls[index]}
                    alt={file.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>

                <div className="flex items-center justify-between gap-2 p-2">
                  <span className="min-w-0 truncate text-xs text-gray-600 dark:text-gray-400">
                    {file.name}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      removeSelectedFile(index)
                    }
                    className="shrink-0 rounded-lg px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing images */}
      <div className="border-t border-gray-200 pt-6 dark:border-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              Uploaded Images
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Drag images to change their order.
            </p>
          </div>
        </div>

        {images.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            No product images uploaded yet.
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((image) => image.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {images.map((image) => (
                  <SortableImageCard
                    key={image.id}
                    image={image}
                    onPrimary={setPrimary}
                    onDelete={deleteImage}
                    onAltTextUpdate={updateAltText}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </section>
  );
}