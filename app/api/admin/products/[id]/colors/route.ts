import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function getProductId(id: string) {
  const productId = Number(id);
  return Number.isInteger(productId) && productId > 0
    ? productId
    : null;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const productId = getProductId(id);

    if (!productId) {
      return NextResponse.json(
        { error: "Invalid product ID." },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
      `
        SELECT id, product_id, color_name, color_code, sort_order
        FROM product_colors
        WHERE product_id = ?
        ORDER BY sort_order ASC, id ASC
      `,
      [productId]
    );

    return NextResponse.json({
      colors: rows,
    });
  } catch (error) {
    console.error("Failed to fetch colors:", error);

    return NextResponse.json(
      { error: "Failed to fetch colors." },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const productId = getProductId(id);

    if (!productId) {
      return NextResponse.json(
        { error: "Invalid product ID." },
        { status: 400 }
      );
    }

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
        { error: "Product not found." },
        { status: 404 }
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
        INSERT INTO product_colors
        (
          product_id,
          color_name,
          color_code,
          sort_order
        )
        VALUES (?, ?, ?, ?)
      `,
      [
        productId,
        colorName,
        colorCode,
        sortOrder,
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
          color_name,
          color_code,
          sort_order
        FROM product_colors
        WHERE id = ?
        LIMIT 1
      `,
      [insertResult.insertId]
    );

    return NextResponse.json(
      {
        message: "Color added successfully.",
        color: (rows as unknown[])[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to add color:", error);

    return NextResponse.json(
      { error: "Failed to add color." },
      { status: 500 }
    );
  }
}