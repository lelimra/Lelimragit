import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { unlink } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
    imageId: string;
  }>;
};

const PRODUCT_IMAGE_URL_PREFIX = "/images/products/";
const PRODUCT_IMAGE_DIRECTORY =
  "/home/u315645729/domains/lelimra.com/product-images/products";

function getId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

type ExistingImage = {
  id: number;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: number;
};

/**
 * PUT
 *
 * Update product image information.
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id, imageId } = await params;

    const productId = getId(id);
    const imageIdNumber = getId(imageId);

    if (!productId || !imageIdNumber) {
      return NextResponse.json(
        {
          error: "Invalid product ID or image ID.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    /*
     * Get the existing image first.
     * This allows partial updates such as:
     *
     * { "is_primary": true }
     */
    const [existingRows] = await db.query(
      `
        SELECT
          id,
          image_url,
          alt_text,
          sort_order,
          is_primary
        FROM product_images
        WHERE id = ?
          AND product_id = ?
        LIMIT 1
      `,
      [imageIdNumber, productId]
    );

    const existingImage = (
      existingRows as ExistingImage[]
    )[0];

    if (!existingImage) {
      return NextResponse.json(
        {
          error: "Image not found.",
        },
        { status: 404 }
      );
    }

    /*
     * Keep existing values when a field
     * is not included in the request.
     */
    const imageUrl =
      body.image_url !== undefined
        ? String(body.image_url).trim()
        : existingImage.image_url;

    const altText =
      body.alt_text !== undefined
        ? body.alt_text === null
          ? null
          : String(body.alt_text).trim()
        : existingImage.alt_text;

    const sortOrder =
      body.sort_order !== undefined &&
      Number.isFinite(Number(body.sort_order))
        ? Number(body.sort_order)
        : existingImage.sort_order;

    const requestedPrimary =
      body.is_primary !== undefined
        ? body.is_primary === true
        : existingImage.is_primary === 1;

    /*
     * Validate image URL.
     *
     * Only product images are allowed.
     */
    if (!imageUrl) {
      return NextResponse.json(
        {
          error: "Image URL is required.",
        },
        { status: 400 }
      );
    }

    if (!imageUrl.startsWith(PRODUCT_IMAGE_URL_PREFIX)) {
      return NextResponse.json(
        {
          error:
            "Image must be inside the /images/products/ directory.",
        },
        { status: 400 }
      );
    }

    /*
     * If this image becomes primary,
     * remove primary status from all
     * other images of this product.
     */
    if (requestedPrimary) {
      await db.query(
        `
          UPDATE product_images
          SET is_primary = 0
          WHERE product_id = ?
            AND id != ?
        `,
        [productId, imageIdNumber]
      );
    }

    /*
     * Update the image record.
     */
    const [result] = await db.query(
      `
        UPDATE product_images
        SET
          image_url = ?,
          alt_text = ?,
          sort_order = ?,
          is_primary = ?
        WHERE id = ?
          AND product_id = ?
      `,
      [
        imageUrl,
        altText,
        sortOrder,
        requestedPrimary ? 1 : 0,
        imageIdNumber,
        productId,
      ]
    );

    const updateResult = result as {
      affectedRows: number;
    };

    if (updateResult.affectedRows === 0) {
      return NextResponse.json(
        {
          error: "Image update failed.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Product image updated successfully.",
    });
  } catch (error) {
    console.error(
      "Failed to update product image:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update product image.",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE
 *
 * Delete product image from:
 * 1. Persistent filesystem
 * 2. Database
 *
 * If the deleted image was primary,
 * the first remaining image becomes primary.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id, imageId } = await params;

    const productId = getId(id);
    const imageIdNumber = getId(imageId);

    if (!productId || !imageIdNumber) {
      return NextResponse.json(
        {
          error: "Invalid product ID or image ID.",
        },
        { status: 400 }
      );
    }

    /*
     * Get the image before deleting it.
     * We need the image URL for filesystem deletion
     * and is_primary for primary-image handling.
     */
    const [imageRows] = await db.query(
      `
        SELECT
          id,
          image_url,
          is_primary
        FROM product_images
        WHERE id = ?
          AND product_id = ?
        LIMIT 1
      `,
      [imageIdNumber, productId]
    );

    const image = (
      imageRows as Array<{
        id: number;
        image_url: string;
        is_primary: number;
      }>
    )[0];

    if (!image) {
      return NextResponse.json(
        {
          error: "Image not found.",
        },
        { status: 404 }
      );
    }

    /*
     * Delete the physical image file.
     *
     * Only files inside /images/products/
     * are deleted from the persistent directory.
     */
    if (
      image.image_url.startsWith(
        PRODUCT_IMAGE_URL_PREFIX
      )
    ) {
      const filename = path.basename(image.image_url);

      /*
       * Prevent unexpected path traversal.
       */
      if (
        filename &&
        filename !== "." &&
        filename !== ".."
      ) {
        const filePath = path.join(
          PRODUCT_IMAGE_DIRECTORY,
          filename
        );

        try {
          await unlink(filePath);
        } catch (error: unknown) {
          const nodeError =
            error as NodeJS.ErrnoException;

          /*
           * If the file is already missing,
           * continue with database deletion.
           *
           * Any other filesystem error should
           * stop the operation.
           */
          if (nodeError.code !== "ENOENT") {
            throw error;
          }
        }
      }
    }

    /*
     * Delete the image record from database.
     */
    await db.query(
      `
        DELETE FROM product_images
        WHERE id = ?
          AND product_id = ?
      `,
      [imageIdNumber, productId]
    );

    /*
     * If the deleted image was primary,
     * promote the first remaining image.
     */
    if (image.is_primary === 1) {
      const [remainingRows] = await db.query(
        `
          SELECT id
          FROM product_images
          WHERE product_id = ?
          ORDER BY sort_order ASC, id ASC
          LIMIT 1
        `,
        [productId]
      );

      const nextImage = (
        remainingRows as Array<{
          id: number;
        }>
      )[0];

      if (nextImage) {
        await db.query(
          `
            UPDATE product_images
            SET is_primary = 1
            WHERE id = ?
              AND product_id = ?
          `,
          [nextImage.id, productId]
        );
      }
    }

    return NextResponse.json({
      message: "Product image deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Failed to delete product image:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to delete product image.",
      },
      { status: 500 }
    );
  }
}