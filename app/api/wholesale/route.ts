import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      phone,
      product,
      quantity,
      location,
    } = body;

    // Validate required fields
    if (!name || !phone || !product || !quantity || !location) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill all required fields.",
        },
        { status: 400 }
      );
    }

    // Validate quantity
    const quantityNumber = Number(quantity);

    if (!Number.isInteger(quantityNumber) || quantityNumber < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Quantity must be a valid number.",
        },
        { status: 400 }
      );
    }

    // Save enquiry to MySQL
    const [result] = await db.execute(
      `
      INSERT INTO wholesale_enquiries
      (
        name,
        phone,
        product,
        quantity,
        delivery_location
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        name.trim(),
        phone.trim(),
        product,
        quantityNumber,
        location.trim(),
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Wholesale enquiry submitted successfully.",
        id: (result as any).insertId,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Wholesale API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit enquiry.",
      },
      { status: 500 }
    );
  }
}