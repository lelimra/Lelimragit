import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function getProductId(id: string) {
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    return null;
  }

  return productId;
}

/**
 * GET /api/admin/products/:id/specifications
 */
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
          blade_material,
          created_at,
          updated_at
        FROM product_specifications
        WHERE product_id = ?
        LIMIT 1
      `,
      [productId]
    );

    const specification = (rows as unknown[])[0];

    return NextResponse.json({
      specifications: specification || null,
    });
  } catch (error) {
    console.error(
      "Failed to fetch product specifications:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch specifications.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/products/:id/specifications
 *
 * Creates specifications for a product.
 */
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

    /* Check product exists */

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

    /* Check existing specifications */

    const [existingRows] = await db.query(
      `
        SELECT id
        FROM product_specifications
        WHERE product_id = ?
        LIMIT 1
      `,
      [productId]
    );

    if ((existingRows as unknown[]).length > 0) {
      return NextResponse.json(
        {
          error:
            "Specifications already exist for this product. Use PUT to update them.",
        },
        { status: 409 }
      );
    }

    const body = await request.json();

    const values = {
      sweep: body.sweep
        ? String(body.sweep).trim()
        : null,

      rpm: body.rpm
        ? String(body.rpm).trim()
        : null,

      wattage: body.wattage
        ? String(body.wattage).trim()
        : null,

      voltage: body.voltage
        ? String(body.voltage).trim()
        : null,

      frequency: body.frequency
        ? String(body.frequency).trim()
        : null,

      motor_type: body.motor_type
        ? String(body.motor_type).trim()
        : null,

      winding: body.winding
        ? String(body.winding).trim()
        : null,

      blades: body.blades
        ? String(body.blades).trim()
        : null,

      air_delivery: body.air_delivery
        ? String(body.air_delivery).trim()
        : null,

      noise: body.noise
        ? String(body.noise).trim()
        : null,

      body_material: body.body_material
        ? String(body.body_material).trim()
        : null,

      blade_material: body.blade_material
        ? String(body.blade_material).trim()
        : null,
    };

    const [result] = await db.query(
      `
        INSERT INTO product_specifications
        (
          product_id,
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
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        productId,
        values.sweep,
        values.rpm,
        values.wattage,
        values.voltage,
        values.frequency,
        values.motor_type,
        values.winding,
        values.blades,
        values.air_delivery,
        values.noise,
        values.body_material,
        values.blade_material,
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
          blade_material,
          created_at,
          updated_at
        FROM product_specifications
        WHERE id = ?
        LIMIT 1
      `,
      [insertResult.insertId]
    );

    return NextResponse.json(
      {
        message:
          "Product specifications created successfully.",
        specifications: (rows as unknown[])[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Failed to create product specifications:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to create specifications.",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/products/:id/specifications
 *
 * Creates or updates specifications.
 */
export async function PUT(
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

    const values = {
      sweep: body.sweep
        ? String(body.sweep).trim()
        : null,

      rpm: body.rpm
        ? String(body.rpm).trim()
        : null,

      wattage: body.wattage
        ? String(body.wattage).trim()
        : null,

      voltage: body.voltage
        ? String(body.voltage).trim()
        : null,

      frequency: body.frequency
        ? String(body.frequency).trim()
        : null,

      motor_type: body.motor_type
        ? String(body.motor_type).trim()
        : null,

      winding: body.winding
        ? String(body.winding).trim()
        : null,

      blades: body.blades
        ? String(body.blades).trim()
        : null,

      air_delivery: body.air_delivery
        ? String(body.air_delivery).trim()
        : null,

      noise: body.noise
        ? String(body.noise).trim()
        : null,

      body_material: body.body_material
        ? String(body.body_material).trim()
        : null,

      blade_material: body.blade_material
        ? String(body.blade_material).trim()
        : null,
    };

    const [existingRows] = await db.query(
      `
        SELECT id
        FROM product_specifications
        WHERE product_id = ?
        LIMIT 1
      `,
      [productId]
    );

    if ((existingRows as unknown[]).length === 0) {
      await db.query(
        `
          INSERT INTO product_specifications
          (
            product_id,
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
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          productId,
          values.sweep,
          values.rpm,
          values.wattage,
          values.voltage,
          values.frequency,
          values.motor_type,
          values.winding,
          values.blades,
          values.air_delivery,
          values.noise,
          values.body_material,
          values.blade_material,
        ]
      );
    } else {
      await db.query(
        `
          UPDATE product_specifications
          SET
            sweep = ?,
            rpm = ?,
            wattage = ?,
            voltage = ?,
            frequency = ?,
            motor_type = ?,
            winding = ?,
            blades = ?,
            air_delivery = ?,
            noise = ?,
            body_material = ?,
            blade_material = ?
          WHERE product_id = ?
        `,
        [
          values.sweep,
          values.rpm,
          values.wattage,
          values.voltage,
          values.frequency,
          values.motor_type,
          values.winding,
          values.blades,
          values.air_delivery,
          values.noise,
          values.body_material,
          values.blade_material,
          productId,
        ]
      );
    }

    const [rows] = await db.query(
      `
        SELECT
          id,
          product_id,
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
          blade_material,
          created_at,
          updated_at
        FROM product_specifications
        WHERE product_id = ?
        LIMIT 1
      `,
      [productId]
    );

    return NextResponse.json({
      message:
        "Product specifications saved successfully.",
      specifications: (rows as unknown[])[0],
    });
  } catch (error) {
    console.error(
      "Failed to save product specifications:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to save specifications.",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/products/:id/specifications
 */
export async function DELETE(
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

    const [result] = await db.query(
      `
        DELETE FROM product_specifications
        WHERE product_id = ?
      `,
      [productId]
    );

    const deleteResult = result as {
      affectedRows: number;
    };

    if (deleteResult.affectedRows === 0) {
      return NextResponse.json(
        {
          error: "Specifications not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message:
        "Product specifications deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Failed to delete product specifications:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to delete specifications.",
      },
      { status: 500 }
    );
  }
}