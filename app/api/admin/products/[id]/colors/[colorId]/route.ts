import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
    colorId: string;
  }>;
};

function getId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id, colorId } = await params;

    const productId = getId(id);
    const colorIdNumber = getId(colorId);

    if (!productId || !colorIdNumber) {
      return NextResponse.json(
        { error: "Invalid ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const colorName = String(
      body.color_name ?? ""
    ).trim();

    const colorCode = body.color_code
      ? String(body.color_code).trim()
      : null;

    const sortOrder = Number.isFinite(
      Number(body.sort_order)
    )
      ? Number(body.sort_order)
      : 0;

    if (!colorName) {
      return NextResponse.json(
        { error: "Color name is required." },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      `
        UPDATE product_colors
        SET
          color_name = ?,
          color_code = ?,
          sort_order = ?
        WHERE id = ?
          AND product_id = ?
      `,
      [
        colorName,
        colorCode,
        sortOrder,
        colorIdNumber,
        productId,
      ]
    );

    const updateResult = result as {
      affectedRows: number;
    };

    if (updateResult.affectedRows === 0) {
      return NextResponse.json(
        { error: "Color not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Color updated successfully.",
    });
  } catch (error) {
    console.error("Failed to update color:", error);

    return NextResponse.json(
      { error: "Failed to update color." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id, colorId } = await params;

    const productId = getId(id);
    const colorIdNumber = getId(colorId);

    if (!productId || !colorIdNumber) {
      return NextResponse.json(
        { error: "Invalid ID." },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      `
        DELETE FROM product_colors
        WHERE id = ?
          AND product_id = ?
      `,
      [colorIdNumber, productId]
    );

    const deleteResult = result as {
      affectedRows: number;
    };

    if (deleteResult.affectedRows === 0) {
      return NextResponse.json(
        { error: "Color not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Color deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete color:", error);

    return NextResponse.json(
      { error: "Failed to delete color." },
      { status: 500 }
    );
  }
}