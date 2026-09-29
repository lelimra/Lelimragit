export type ProductRange = "48-inch Premium" | "24-inch Premium";

export type FanFinish =
  | "Pearl White"
  | "Pearl Ivory"
  | "Satin Gold"
  | "Baker's Brown"
  | "Viola Blue"
  | "Matt Black"
  | "Rose Gold";

export interface ProductVariant {
  finish: FanFinish;
  image: string;
}

export interface ProductSpecifications {
  sweep?: string;
  power?: string;
  airDelivery?: string;
  speed?: string;
}

export interface Product {
  id: string;
  slug: string;
  model: string;
  range: ProductRange;

  description: string;

  image: string;

  variants: ProductVariant[];

  specifications: ProductSpecifications;

  featured: boolean;
}