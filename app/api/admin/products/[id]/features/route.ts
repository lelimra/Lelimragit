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
        SELECT
          id,
          product_id,
          feature,
          sort_order
        FROM product_features
        WHERE product_id = ?
        ORDER BY sort_order ASC, id ASC
      `,
      [productId]
    );

    return NextResponse.json({
      features: rows,
    });
  } catch (error) {
    console.error("Failed to fetch features:", error);

    return NextResponse.json(
      { error: "Failed to fetch features." },
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

    const feature = String(
      body.feature ?? ""
    ).trim();

    const sortOrder = Number.isFinite(
      Number(body.sort_order)
    )
      ? Number(body.sort_order)
      : 0;

    if (!feature) {
      return NextResponse.json(
        { error: "Feature is required." },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      `
        INSERT INTO product_features
        (
          product_id,
          feature,
          sort_order
        )
        VALUES (?, ?, ?)
      `,
      [
        productId,
        feature,
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
          feature,
          sort_order
        FROM product_features
        WHERE id = ?
        LIMIT 1
      `,
      [insertResult.insertId]
    );

    return NextResponse.json(
      {
        message: "Feature added successfully.",
        feature: (rows as unknown[])[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to add feature:", error);

    return NextResponse.json(
      { error: "Failed to add feature." },
      { status: 500 }
    );
  }
}