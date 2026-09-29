import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
    featureId: string;
  }>;
};

function getId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id, featureId } = await params;

    const productId = getId(id);
    const featureIdNumber = getId(featureId);

    if (!productId || !featureIdNumber) {
      return NextResponse.json(
        { error: "Invalid ID." },
        { status: 400 }
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
        UPDATE product_features
        SET
          feature = ?,
          sort_order = ?
        WHERE id = ?
          AND product_id = ?
      `,
      [
        feature,
        sortOrder,
        featureIdNumber,
        productId,
      ]
    );

    const updateResult = result as {
      affectedRows: number;
    };

    if (updateResult.affectedRows === 0) {
      return NextResponse.json(
        { error: "Feature not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Feature updated successfully.",
    });
  } catch (error) {
    console.error("Failed to update feature:", error);

    return NextResponse.json(
      { error: "Failed to update feature." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id, featureId } = await params;

    const productId = getId(id);
    const featureIdNumber = getId(featureId);

    if (!productId || !featureIdNumber) {
      return NextResponse.json(
        { error: "Invalid ID." },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      `
        DELETE FROM product_features
        WHERE id = ?
          AND product_id = ?
      `,
      [featureIdNumber, productId]
    );

    const deleteResult = result as {
      affectedRows: number;
    };

    if (deleteResult.affectedRows === 0) {
      return NextResponse.json(
        { error: "Feature not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Feature deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete feature:", error);

    return NextResponse.json(
      { error: "Failed to delete feature." },
      { status: 500 }
    );
  }
}