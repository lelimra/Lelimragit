import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/products
 */
export async function GET() {
  try {
    const [products] = await db.query(`
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
        p.created_at,
        p.updated_at,

        c.id AS category_id,
        c.name AS category_name,
        c.slug AS category_slug

      FROM products p

      INNER JOIN categories c
        ON c.id = p.category_id

      ORDER BY
        p.sort_order ASC,
        p.created_at DESC
    `);

    return NextResponse.json({
      products,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/products
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const slug = String(body.slug ?? "").trim().toLowerCase();
    const model = body.model
      ? String(body.model).trim()
      : null;

    const categoryId = Number(body.category_id);

    const shortDescription = body.short_description
      ? String(body.short_description).trim()
      : null;

    const description = body.description
      ? String(body.description).trim()
      : null;

    const price =
      body.price !== undefined &&
      body.price !== null &&
      body.price !== ""
        ? Number(body.price)
        : null;

    const mrp =
      body.mrp !== undefined &&
      body.mrp !== null &&
      body.mrp !== ""
        ? Number(body.mrp)
        : null;

    const warranty = body.warranty
      ? String(body.warranty).trim()
      : null;

    const isAvailable =
      body.is_available !== undefined
        ? Boolean(body.is_available)
        : true;

    const isFeatured =
      body.is_featured !== undefined
        ? Boolean(body.is_featured)
        : false;

    const sortOrder =
      body.sort_order !== undefined
        ? Number(body.sort_order)
        : 0;

    /* ---------------- Validation ---------------- */

    if (!name) {
      return NextResponse.json(
        {
          error: "Product name is required.",
        },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        {
          error: "Product slug is required.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(categoryId) ||
      categoryId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Valid category_id is required.",
        },
        { status: 400 }
      );
    }

    if (
      price !== null &&
      (!Number.isFinite(price) || price < 0)
    ) {
      return NextResponse.json(
        {
          error: "Invalid price.",
        },
        { status: 400 }
      );
    }

    if (
      mrp !== null &&
      (!Number.isFinite(mrp) || mrp < 0)
    ) {
      return NextResponse.json(
        {
          error: "Invalid MRP.",
        },
        { status: 400 }
      );
    }

    /* ---------------- Check category ---------------- */

    const [categoryRows] = await db.query(
      `
        SELECT id
        FROM categories
        WHERE id = ?
        LIMIT 1
      `,
      [categoryId]
    );

    if ((categoryRows as unknown[]).length === 0) {
      return NextResponse.json(
        {
          error: "Category not found.",
        },
        { status: 400 }
      );
    }

    /* ---------------- Check duplicate slug ---------------- */

    const [existingRows] = await db.query(
      `
        SELECT id
        FROM products
        WHERE slug = ?
        LIMIT 1
      `,
      [slug]
    );

    if ((existingRows as unknown[]).length > 0) {
      return NextResponse.json(
        {
          error:
            "A product with this slug already exists.",
        },
        { status: 409 }
      );
    }

    /* ---------------- Create product ---------------- */

    const [result] = await db.query(
      `
        INSERT INTO products
        (
          category_id,
          name,
          slug,
          model,
          short_description,
          description,
          price,
          mrp,
          warranty,
          is_available,
          is_featured,
          sort_order
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        categoryId,
        name,
        slug,
        model,
        shortDescription,
        description,
        price,
        mrp,
        warranty,
        isAvailable ? 1 : 0,
        isFeatured ? 1 : 0,
        Number.isFinite(sortOrder) ? sortOrder : 0,
      ]
    );

    const insertResult = result as {
      insertId: number;
    };

    /* ---------------- Get created product ---------------- */

    const [rows] = await db.query(
      `
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
          p.created_at,
          p.updated_at,

          c.id AS category_id,
          c.name AS category_name,
          c.slug AS category_slug

        FROM products p

        INNER JOIN categories c
          ON c.id = p.category_id

        WHERE p.id = ?

        LIMIT 1
      `,
      [insertResult.insertId]
    );

    return NextResponse.json(
      {
        message: "Product created successfully.",
        product: (rows as unknown[])[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create product:", error);

    return NextResponse.json(
      {
        error: "Failed to create product.",
      },
      { status: 500 }
    );
  }
}