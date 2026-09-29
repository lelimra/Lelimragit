import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/categories
 *
 * Returns all categories including inactive ones.
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
      ORDER BY sort_order ASC, name ASC
    `);

    return NextResponse.json({
      categories: rows,
    });
  } catch (error) {
    console.error("Failed to fetch admin categories:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/categories
 *
 * Create a new category.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const slug = String(body.slug ?? "").trim().toLowerCase();
    const description =
      body.description != null
        ? String(body.description).trim()
        : null;

    const image =
      body.image != null
        ? String(body.image).trim()
        : null;

    const isActive =
      body.is_active !== undefined
        ? Boolean(body.is_active)
        : true;

    const sortOrder =
      Number.isFinite(Number(body.sort_order))
        ? Number(body.sort_order)
        : 0;

    if (!name) {
      return NextResponse.json(
        {
          error: "Category name is required",
        },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        {
          error: "Category slug is required",
        },
        { status: 400 }
      );
    }

    const [existing] = await db.query(
      `
        SELECT id
        FROM categories
        WHERE slug = ?
        LIMIT 1
      `,
      [slug]
    );

    if ((existing as unknown[]).length > 0) {
      return NextResponse.json(
        {
          error: "A category with this slug already exists.",
        },
        { status: 409 }
      );
    }

    const [result] = await db.query(
      `
        INSERT INTO categories
        (
          name,
          slug,
          description,
          image,
          is_active,
          sort_order
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        slug,
        description,
        image,
        isActive ? 1 : 0,
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
          name,
          slug,
          description,
          image,
          is_active,
          sort_order,
          created_at,
          updated_at
        FROM categories
        WHERE id = ?
        LIMIT 1
      `,
      [insertResult.insertId]
    );

    return NextResponse.json(
      {
        message: "Category created successfully.",
        category: (rows as unknown[])[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create category:", error);

    return NextResponse.json(
      {
        error: "Failed to create category",
      },
      { status: 500 }
    );
  }
}