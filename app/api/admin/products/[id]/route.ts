import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function getProductId(id: string) {
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    return null;
  }

  return productId;
}

/**
 * GET /api/admin/products/:id
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const productId = await getProductId(id);

    if (!productId) {
      return NextResponse.json(
        { error: "Invalid product ID." },
        { status: 400 }
      );
    }

    const [productRows] = await db.query(
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
      [productId]
    );

    const product = (productRows as unknown[])[0];

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    /* Specifications */

    const [specificationRows] = await db.query(
      `
        SELECT
          id,
          sweep,
          rpm,
          wattage,
          voltage,
          frequency,
          motor_type,
          winding,
          blades,
          air_delivery,
          noise,
          body_material,
          blade_material
        FROM product_specifications
        WHERE product_id = ?
        LIMIT 1
      `,
      [productId]
    );

    /* Images */

    const [imageRows] = await db.query(
      `
        SELECT
          id,
          image_url,
          alt_text,
          sort_order,
          is_primary
        FROM product_images
        WHERE product_id = ?
        ORDER BY sort_order ASC, id ASC
      `,
      [productId]
    );

    /* Colors */

    const [colorRows] = await db.query(
      `
        SELECT
          id,
          color_name,
          color_code,
          sort_order
        FROM product_colors
        WHERE product_id = ?
        ORDER BY sort_order ASC, id ASC
      `,
      [productId]
    );

    /* Features */

    const [featureRows] = await db.query(
      `
        SELECT
          id,
          feature,
          sort_order
        FROM product_features
        WHERE product_id = ?
        ORDER BY sort_order ASC, id ASC
      `,
      [productId]
    );

    return NextResponse.json({
      product,
      specifications:
        (specificationRows as unknown[])[0] || null,
      images: imageRows,
      colors: colorRows,
      features: featureRows,
    });
  } catch (error) {
    console.error("Failed to fetch product:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch product",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/products/:id
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const productId = await getProductId(id);

    if (!productId) {
      return NextResponse.json(
        { error: "Invalid product ID." },
        { status: 400 }
      );
    }

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
      body.price !== null &&
      body.price !== undefined &&
      body.price !== ""
        ? Number(body.price)
        : null;

    const mrp =
      body.mrp !== null &&
      body.mrp !== undefined &&
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
      Number.isFinite(Number(body.sort_order))
        ? Number(body.sort_order)
        : 0;

    if (!name || !slug) {
      return NextResponse.json(
        {
          error:
            "Product name and slug are required.",
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
          error: "A valid category is required.",
        },
        { status: 400 }
      );
    }

    /* Check product */

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

    /* Check category */

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
        { error: "Category not found." },
        { status: 400 }
      );
    }

    /* Check duplicate slug */

    const [slugRows] = await db.query(
      `
        SELECT id
        FROM products
        WHERE slug = ?
          AND id != ?
        LIMIT 1
      `,
      [slug, productId]
    );

    if ((slugRows as unknown[]).length > 0) {
      return NextResponse.json(
        {
          error:
            "Another product already uses this slug.",
        },
        { status: 409 }
      );
    }

    await db.query(
      `
        UPDATE products
        SET
          category_id = ?,
          name = ?,
          slug = ?,
          model = ?,
          short_description = ?,
          description = ?,
          price = ?,
          mrp = ?,
          warranty = ?,
          is_available = ?,
          is_featured = ?,
          sort_order = ?
        WHERE id = ?
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
        sortOrder,
        productId,
      ]
    );

    return NextResponse.json({
      message: "Product updated successfully.",
    });
  } catch (error) {
    console.error("Failed to update product:", error);

    return NextResponse.json(
      {
        error: "Failed to update product",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/products/:id
 */
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const productId = await getProductId(id);

    if (!productId) {
      return NextResponse.json(
        { error: "Invalid product ID." },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      `
        DELETE FROM products
        WHERE id = ?
      `,
      [productId]
    );

    const deleteResult = result as {
      affectedRows: number;
    };

    if (deleteResult.affectedRows === 0) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    /*
     * The foreign keys on:
     *
     * product_images
     * product_features
     * product_colors
     * product_specifications
     *
     * use ON DELETE CASCADE, so their records
     * are removed automatically.
     */

    return NextResponse.json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete product:", error);

    return NextResponse.json(
      {
        error: "Failed to delete product",
      },
      { status: 500 }
    );
  }
}