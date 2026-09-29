import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const connection = await db.getConnection();

  try {
    const { id } = await params;

    const productId = Number(id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const imageIds = body.image_ids;

    if (!Array.isArray(imageIds)) {
      return NextResponse.json(
        { error: "image_ids must be an array" },
        { status: 400 }
      );
    }

    const normalizedIds = imageIds.map(Number);

    if (
      normalizedIds.some(
        (imageId) => !Number.isInteger(imageId) || imageId <= 0
      )
    ) {
      return NextResponse.json(
        { error: "Invalid image ID" },
        { status: 400 }
      );
    }

    await connection.beginTransaction();

    // Make sure all images belong to this product.
    const [rows] = await connection.query(
      `
      SELECT id
      FROM product_images
      WHERE product_id = ?
      `,
      [productId]
    );

    const existingIds = (rows as Array<{ id: number }>).map(
      (row) => Number(row.id)
    );

    const existingSet = new Set(existingIds);

    const validIds = normalizedIds.filter((imageId) =>
      existingSet.has(imageId)
    );

    if (validIds.length !== existingIds.length) {
      await connection.rollback();

      return NextResponse.json(
        {
          error:
            "The supplied image list does not match this product's images.",
        },
        { status: 400 }
      );
    }

    for (let index = 0; index < validIds.length; index++) {
      await connection.query(
        `
        UPDATE product_images
        SET sort_order = ?
        WHERE id = ?
          AND product_id = ?
        `,
        [index, validIds[index], productId]
      );
    }

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: "Image order updated successfully.",
    });
  } catch (error) {
    await connection.rollback();

    console.error("PRODUCT IMAGE REORDER ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to reorder product images.",
      },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}