import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRODUCT_IMAGE_DIRECTORY =
  "/home/u315645729/domains/lelimra.com/product-images/products";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

type RouteContext = {
  params: Promise<{
    filename: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { filename } = await params;

    const decodedFilename = decodeURIComponent(filename);
    const safeFilename = path.basename(decodedFilename);

    if (
      !safeFilename ||
      safeFilename !== decodedFilename ||
      safeFilename.includes("..")
    ) {
      return NextResponse.json(
        { error: "Invalid image filename." },
        { status: 400 }
      );
    }

    const extension = path.extname(safeFilename).toLowerCase();
    const contentType = CONTENT_TYPES[extension];

    if (!contentType) {
      return NextResponse.json(
        { error: "Unsupported image type." },
        { status: 400 }
      );
    }

    const filePath = path.join(
      PRODUCT_IMAGE_DIRECTORY,
      safeFilename
    );

    const file = await fs.readFile(filePath);

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control":
          "public, max-age=31536000, immutable",
      },
    });
  } catch (error: unknown) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code === "ENOENT") {
      return NextResponse.json(
        { error: "Image not found." },
        { status: 404 }
      );
    }

    console.error("Product image error:", error);

    return NextResponse.json(
      { error: "Failed to load image." },
      { status: 500 }
    );
  }
}