import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/admin/categories/:id
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const categoryId = Number(id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

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
      [categoryId]
    );

    const category = (rows as unknown[])[0];

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Failed to fetch category:", error);

    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/categories/:id
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const categoryId = Number(id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

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

    if (!name || !slug) {
      return NextResponse.json(
        {
          error: "Category name and slug are required.",
        },
        { status: 400 }
      );
    }

    const [existing] = await db.query(
      `
        SELECT id
        FROM categories
        WHERE slug = ?
          AND id != ?
        LIMIT 1
      `,
      [slug, categoryId]
    );

    if ((existing as unknown[]).length > 0) {
      return NextResponse.json(
        {
          error: "Another category already uses this slug.",
        },
        { status: 409 }
      );
    }

    const [result] = await db.query(
      `
        UPDATE categories
        SET
          name = ?,
          slug = ?,
          description = ?,
          image = ?,
          is_active = ?,
          sort_order = ?
        WHERE id = ?
      `,
      [
        name,
        slug,
        description,
        image,
        isActive ? 1 : 0,
        sortOrder,
        categoryId,
      ]
    );

    const updateResult = result as {
      affectedRows: number;
    };

    if (updateResult.affectedRows === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

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
      [categoryId]
    );

    return NextResponse.json({
      message: "Category updated successfully.",
      category: (rows as unknown[])[0],
    });
  } catch (error) {
    console.error("Failed to update category:", error);

    return NextResponse.json(
      {
        error: "Failed to update category",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/categories/:id
 */
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const categoryId = Number(id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    /*
     * Do not delete a category if products are
     * still assigned to it.
     */
    const [products] = await db.query(
      `
        SELECT COUNT(*) AS count
        FROM products
        WHERE category_id = ?
      `,
      [categoryId]
    );

    const productCount = Number(
      (products as Array<{ count: number }>)[0]?.count ?? 0
    );

    if (productCount > 0) {
      return NextResponse.json(
        {
          error:
            "This category cannot be deleted because products are assigned to it. Deactivate it instead.",
        },
        { status: 409 }
      );
    }

    const [result] = await db.query(
      `
        DELETE FROM categories
        WHERE id = ?
      `,
      [categoryId]
    );

    const deleteResult = result as {
      affectedRows: number;
    };

    if (deleteResult.affectedRows === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete category:", error);

    return NextResponse.json(
      {
        error: "Failed to delete category",
      },
      { status: 500 }
    );
  }
}