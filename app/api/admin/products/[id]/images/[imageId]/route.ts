import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
    imageId: string;
  }>;
};

function getId(value: string) {
  const id = Number(value);

  return Number.isInteger(id) && id > 0
    ? id
    : null;
}

/**
 * PUT
 *
 * Update image information.
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
          error: "Invalid ID.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const imageUrl = String(
      body.image_url ?? ""
    ).trim();

    const altText = body.alt_text
      ? String(body.alt_text).trim()
      : null;

    const sortOrder = Number.isFinite(
      Number(body.sort_order)
    )
      ? Number(body.sort_order)
      : 0;

    const requestedPrimary =
      body.is_primary === true;

    if (!imageUrl) {
      return NextResponse.json(
        {
          error: "Image URL is required.",
        },
        { status: 400 }
      );
    }

    if (!imageUrl.startsWith("/images/")) {
      return NextResponse.json(
        {
          error:
            "Image must be inside the /images/ directory.",
        },
        { status: 400 }
      );
    }

    /*
     * Make this image the only primary image.
     */
    if (requestedPrimary) {
      await db.query(
        `
          UPDATE product_images
          SET is_primary = 0
          WHERE product_id = ?
        `,
        [productId]
      );
    }

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
          error: "Image not found.",
        },
        { status: 404 }
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
 * Delete product image.
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
          error: "Invalid ID.",
        },
        { status: 400 }
      );
    }

    /*
     * Check whether the image being deleted
     * is currently the primary image.
     */
    const [imageRows] = await db.query(
      `
        SELECT
          id,
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
     * automatically promote the first
     * remaining image.
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