import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import db from "@/lib/db";
import { products as defaults, type Product } from "@/data/products";
import { z } from "zod";
import type { RowDataPacket } from "mysql2";

const schema = z.object({
  id: z.string().min(1).max(80).regex(/^[a-zA-Z0-9_-]+$/),
  slug: z.string().min(1).max(160).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(180),
  category: z.enum(["ceiling-fan", "table-fan", "pedestal-fan"]),
  shortDescription: z.string().max(1000).default(""),
  description: z.string().max(10000).default(""),
  images: z.array(z.string().max(500).regex(/^\/images\//)).max(12).default([]),
  specifications: z.record(z.string(), z.unknown()).default({}),
  features: z.array(z.string().max(500)).max(30).default([]),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
  price: z.number().nonnegative().optional(),
  mrp: z.number().nonnegative().optional(),
  model: z.string().max(100).optional(),
  warranty: z.string().max(200).optional(),
});

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const [rows] = await db.query<(RowDataPacket & { slug: string; product_json: Product | string })[]>("SELECT slug, product_json FROM product_overrides ORDER BY updated_at DESC");
    const overrides = new Map(rows.map(r => [r.slug, typeof r.product_json === "string" ? JSON.parse(r.product_json) as Product : r.product_json]));
    const merged = defaults.map(p => overrides.get(p.slug) || p);
    for (const [slug, product] of overrides) if (!defaults.some(p => p.slug === slug)) merged.push(product);
    return NextResponse.json({ products: merged });
  } catch {
    return NextResponse.json({ error: "Run the database SQL first." }, { status: 503 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    await db.execute(
      "INSERT INTO product_overrides (slug, product_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE product_json=VALUES(product_json)",
      [parsed.data.slug, JSON.stringify(parsed.data)]
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not save product." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id || !/^[a-z0-9-]{1,160}$/.test(id)) return NextResponse.json({ error: "Invalid product slug" }, { status: 400 });
  try {
    await db.execute("DELETE FROM product_overrides WHERE slug=?", [id]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete product." }, { status: 500 });
  }
}
