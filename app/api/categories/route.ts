import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/categories
 *
 * Returns all active categories.
 */
export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        name,
        slug,
        description,
        image,
        is_active,
        sort_order,
        created_at,
        updated_at
      FROM categories
      WHERE is_active = 1
      ORDER BY sort_order ASC, name ASC
    `);

    return NextResponse.json(
      {
        categories: rows,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch categories:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch categories",
        categories: [],
      },
      { status: 500 }
    );
  }
}