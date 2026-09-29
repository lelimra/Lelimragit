import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const categoryMap: Record<string, string> = {
  "ceiling-fan": "ceiling-fans",
  "table-fan": "table-fans",
  "pedestal-fan": "pedestal-fans",
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";

    const conditions: string[] = [
      "p.is_available = 1",
      "c.is_active = 1",
    ];

    const values: (string | number)[] = [];

    // Category filter
    if (category && categoryMap[category]) {
      conditions.push("c.slug = ?");
      values.push(categoryMap[category]);
    }

    // Search filter
    if (search) {
      conditions.push(`
        (
          p.name LIKE ?
          OR p.model LIKE ?
          OR p.slug LIKE ?
          OR p.short_description LIKE ?
          OR p.description LIKE ?
          OR c.name LIKE ?
        )
      `);

      const searchValue = `%${search}%`;

      values.push(
        searchValue,
        searchValue,
        searchValue,
        searchValue,
        searchValue,
        searchValue
      );
    }

    const query = `
      SELECT
        p.id,
        p.name,
        p.slug,
        p.model,
        p.short_description,
        p.description,
        p.price,
        p.mrp,
        p.warranty,
        p.is_available,
        p.is_featured,
        p.sort_order,

        c.id AS category_id,
        c.name AS category_name,
        c.slug AS category_slug

      FROM products p

      INNER JOIN categories c
        ON c.id = p.category_id

      WHERE ${conditions.join(" AND ")}

      ORDER BY
        p.sort_order ASC,
        p.created_at DESC
    `;

    const [products] = await db.query(query, values);

    return NextResponse.json(
      {
        products,
        count: Array.isArray(products) ? products.length : 0,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/products error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch products",
        products: [],
        count: 0,
      },
      {
        status: 500,
      }
    );
  }
}