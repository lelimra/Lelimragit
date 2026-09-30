// src/types/product.ts

export type ProductCategory =
  | "ceiling-fan"
  | "table-fan"
  | "pedestal-fan";

export type Product = {
  id: string;
  slug: string;
  company: string;
  name: string;
  category: ProductCategory;
  model?: string;
  shortDescription: string;
  description: string;
  images: string[];

  price?: number;
  mrp?: number;

  specifications: {
    size?: string;
    sweep?: string;
    rpm?: string;
    wattage?: string;
    voltage?: string;
    frequency?: string;
    motorType?: string;
    winding?: string;
    blades?: string;
    airDelivery?: string;
    noise?: string;
    bodyMaterial?: string;
    bladeMaterial?: string;
    colors?: string[];
  };

  features: string[];

  warranty?: string;

  available: boolean;
  featured: boolean;
};

/**
 * Product shape returned by the backend.
 *
 * Backend data can be incomplete or use different
 * representations, so fields are intentionally optional.
 */
export interface BackendProduct {
  id: string;
  name: string;
  slug: string;

  model?: string;
  category?: string;
  description?: string;

  image?: string;
  images?: string[];

  price?: number | string | null;
  mrp?: number | string | null;

  available?: boolean;
  featured?: boolean;

  warranty?: string | number | null;

  specifications?: Record<string, unknown>;

  [key: string]: unknown;
}