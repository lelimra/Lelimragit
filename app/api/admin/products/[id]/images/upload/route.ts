import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import { db } from "@/lib/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
    ["image/jpeg", ".jpg"],
    ["image/png", ".png"],
    ["image/webp", ".webp"],
]);
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const productId = Number(id);
        if (!Number.isInteger(productId) || productId <= 0) {
            return NextResponse.json(
                { error: "Invalid product ID" },
                { status: 400 }
            );
        }
        const [productRows] = await db.query(
            `SELECT id, slug, name FROM products WHERE id = ? LIMIT 1`,
            [productId]
        );
        const products = productRows as Array<{
            id: number;
            slug: string;
            name: string;
        }>;
        if (products.length === 0) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }
        const product = products[0];
        const formData = await request.formData();
        const file = formData.get("file");
        if (!(file instanceof File)) {
            return NextResponse.json(
                { error: "No image file provided" },
                { status: 400 }
            );
        }
        const extension = ALLOWED_TYPES.get(file.type);
        if (!extension) {
            return NextResponse.json(
                {
                    error: "Invalid image format. Only JPG, PNG and WEBP are allowed.",
                },
                { status: 400 }
            );
        }
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                {
                    error: "Image size must be 5 MB or less.",
                },
                { status: 400 }
            );
        }
        if (file.size === 0) {
            return NextResponse.json(
                { error: "Uploaded image is empty." },
                { status: 400 }
            );
        }
        const filename = `product-${productId}-${Date.now()}${extension}`;
        const uploadDirectory = "/home/u315645729/domains/lelimra.com/product-images/products";
        await mkdir(uploadDirectory, {
            recursive: true,
        });
        const filePath = `${uploadDirectory}/${filename}`;
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);
        const imageUrl = `/images/products/${filename}`;
        const [imageRows] = await db.query(
            `
      SELECT COUNT(*) AS count
      FROM product_images
      WHERE product_id = ?
      `,
            [productId]
        );
        const countResult = imageRows as Array<{
            count: number;
        }>;
        const imageCount = Number(countResult[0]?.count ?? 0);
        const isPrimary = imageCount === 0 ? 1 : 0;
        const [insertResult] = await db.query(
            `
      INSERT INTO product_images
      (
        product_id,
        image_url,
        alt_text,
        sort_order,
        is_primary
      )
      VALUES (?, ?, ?, ?, ?)
      `,
            [
                productId,
                imageUrl,
                `${product.name ?? "Product"} image`,
                imageCount,
                isPrimary,
            ]
        );
        const result = insertResult as {
            insertId: number;
        };
        return NextResponse.json(
            {
                success: true,
                message: "Image uploaded successfully.",
                image: {
                    id: result.insertId,
                    product_id: productId,
                    image_url: imageUrl,
                    alt_text: `${product.slug} image`,
                    sort_order: imageCount,
                    is_primary: Boolean(isPrimary),
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("PRODUCT IMAGE UPLOAD ERROR:", error);
        return NextResponse.json(
            {
                error: "Failed to upload product image.",
            },
            { status: 500 }
        );
    }
}