import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // Use the same admin-auth check as your other protected admin APIs.
    // Example:
    // await requireAdmin();

    const { searchParams } = new URL(request.url);

    const daysParam = Number(searchParams.get("days") || "30");
    const limitParam = Number(searchParams.get("limit") || "10");

    const days = [7, 30, 90].includes(daysParam) ? daysParam : 30;

    const limit = Math.min(
      Math.max(Number.isFinite(limitParam) ? limitParam : 10, 1),
      50
    );

    const [rows] = await db.query(
      `
      SELECT
        e.product_id,
        COUNT(*) AS product_views,
        COUNT(DISTINCT e.visitor_id) AS unique_visitors
      FROM analytics_events e
      WHERE e.event_name = 'product_view'
        AND e.product_id IS NOT NULL
        AND e.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY e.product_id
      ORDER BY product_views DESC
      LIMIT ${limit}
      `,
      [days]
    );

    const productRows = rows as Array<{
      product_id: string;
      product_views: number | string;
      unique_visitors: number | string;
    }>;

    const productIds = productRows
      .map((row) => row.product_id)
      .filter(Boolean);

    let productMap = new Map<
      string,
      {
        name: string;
        slug: string;
        model: string | null;
      }
    >();

    if (productIds.length > 0) {
      const placeholders = productIds.map(() => "?").join(",");

      const [productRowsFromDb] = await db.query(
        `
        SELECT
          id,
          name,
          slug,
          model
        FROM products
        WHERE id IN (${placeholders})
        `,
        productIds
      );

      const products = productRowsFromDb as Array<{
        id: string | number;
        name: string;
        slug: string;
        model: string | null;
      }>;

      productMap = new Map(
        products.map((product) => [
          String(product.id),
          {
            name: product.name,
            slug: product.slug,
            model: product.model,
          },
        ])
      );
    }

    const products = productRows.map((row) => {
      const product = productMap.get(
        String(row.product_id)
      );

      return {
        productId: String(row.product_id),
        name: product?.name || "Unknown Product",
        slug: product?.slug || null,
        model: product?.model || null,
        views: Number(row.product_views || 0),
        uniqueVisitors: Number(
          row.unique_visitors || 0
        ),
      };
    });

    return NextResponse.json({
      success: true,
      range: {
        days,
      },
      data: products,
    });
  } catch (error) {
    console.error("Analytics products error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load product analytics.",
      },
      {
        status: 500,
      }
    );
  }
}