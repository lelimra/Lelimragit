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