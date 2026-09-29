import db from "@/lib/db";
import { products, type Product } from "@/data/products";
import type { RowDataPacket } from "mysql2";

function hasDatabaseConfig() {
  return Boolean(
    process.env.DB_HOST &&
      process.env.DB_USER &&
      process.env.DB_NAME
  );
}

export async function getManagedProducts(): Promise<Product[]> {
  // The public website must remain usable when MySQL is not configured
  // (for example during local frontend development).
  if (!hasDatabaseConfig()) {
    return products.filter((product) => product.available);
  }

  try {
    const result = await db.query<RowDataPacket[]>(
      "SELECT slug, product_json FROM product_overrides"
    );

    const rows = Array.isArray(result) && Array.isArray(result[0])
      ? result[0]
      : [];

    const overrides = new Map<string, Product>();

    for (const row of rows) {
      try {
        const productJson =
          typeof row.product_json === "string"
            ? JSON.parse(row.product_json)
            : row.product_json;

        if (productJson && typeof productJson === "object") {
          overrides.set(String(row.slug), productJson as Product);
        }
      } catch {
        // Ignore one malformed override and keep the base catalogue usable.
      }
    }

    const catalog = products.map(
      (product) => overrides.get(product.slug) || product
    );

    for (const [slug, product] of overrides) {
      if (!products.some((item) => item.slug === slug)) {
        catalog.push(product);
      }
    }

    return catalog.filter((product) => product.available);
  } catch (error) {
    console.warn(
      "Product overrides could not be loaded; using the static catalogue.",
      error instanceof Error ? error.message : error
    );
    return products.filter((product) => product.available);
  }
}

export async function getManagedProduct(slug: string) {
  const all = await getManagedProducts();
  return all.find((product) => product.slug === slug);
}
