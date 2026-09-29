import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function getProductId(id: string) {
  const productId = Number(id);

  return Number.isInteger(productId) && productId > 0
    ? productId
    : null;
}

/**
 * GET
 * /api/admin/products/:id/images
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const productId = getProductId(id);

    if (!productId) {
      return NextResponse.json(
        {
          error: "Invalid product ID.",
        },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
      `
        SELECT
          id,
          product_id,
          image_url,
          alt_text,
          sort_order,
          is_primary,
          created_at
        FROM product_images
        WHERE product_id = ?
        ORDER BY
          is_primary DESC,
          sort_order ASC,
          id ASC
      `,
      [productId]
    );

    return NextResponse.json({
      images: rows,
    });
  } catch (error) {
    console.error(
      "Failed to fetch product images:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch product images.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST
 * /api/admin/products/:id/images
 */
export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const productId = getProductId(id);

    if (!productId) {
      return NextResponse.json(
        {
          error: "Invalid product ID.",
        },
        { status: 400 }
      );
    }

    /* Check product */

    const [productRows] = await db.query(
      `
        SELECT id
        FROM products
        WHERE id = ?
        LIMIT 1
      `,
      [productId]
    );

    if ((productRows as unknown[]).length === 0) {
      return NextResponse.json(
        {
          error: "Product not found.",
        },
        { status: 404 }
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

    /* Validate image */

    if (!imageUrl) {
      return NextResponse.json(
        {
          error: "Image URL is required.",
        },
        { status: 400 }
      );
    }

    /*
     * Only allow images from your local
     * /images directory.
     */
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
     * If this image becomes primary,
     * remove primary status from all
     * other images first.
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

    /*
     * If this is the first image and the
     * admin didn't explicitly select primary,
     * automatically make it primary.
     */
    let isPrimary = requestedPrimary;

    if (!requestedPrimary) {
      const [existingRows] = await db.query(
        `
          SELECT id
          FROM product_images
          WHERE product_id = ?
          LIMIT 1
        `,
        [productId]
      );

      if ((existingRows as unknown[]).length === 0) {
        isPrimary = true;
      }
    }

    const [result] = await db.query(
      `
        INSERT INTO product_images
        (
          product_id,
          image_url,
          alt_text,
          sort_order,
          is_primary
        )
        VALUES (?, ?, ?, ?, ?)
      `,
      [
        productId,
        imageUrl,
        altText,
        sortOrder,
        isPrimary ? 1 : 0,
      ]
    );

    const insertResult = result as {
      insertId: number;
    };

    const [rows] = await db.query(
      `
        SELECT
          id,
          product_id,
          image_url,
          alt_text,
          sort_order,
          is_primary,
          created_at
        FROM product_images
        WHERE id = ?
        LIMIT 1
      `,
      [insertResult.insertId]
    );

    return NextResponse.json(
      {
        message: "Product image added successfully.",
        image: (rows as unknown[])[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Failed to add product image:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to add product image.",
      },
      { status: 500 }
    );
  }
}