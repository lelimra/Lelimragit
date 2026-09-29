import type { Product } from "@/types/product";
import { getProducts } from "@/lib/products";

/**
 * Returns products managed through the MySQL product tables.
 *
 * This replaces the old product_overrides-based implementation.
 */
export async function getManagedProducts(): Promise<Product[]> {
  return getProducts();
}