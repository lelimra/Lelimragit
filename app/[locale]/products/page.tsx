import Products from "@/components/products/ProductsPage";
import {
  getProducts,
  getProductsByCategory,
} from "@/lib/products";
import type { ProductCategory } from "@/types/product";

type Props = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    category?: string;
  }>;
};

const validCategories: ProductCategory[] = [
  "ceiling-fan",
  "table-fan",
  "pedestal-fan",
];

export default async function ProductsPage({
  searchParams,
}: Props) {
  const { category } = await searchParams;

  const products =
    category && validCategories.includes(category as ProductCategory)
      ? await getProductsByCategory(category as ProductCategory)
      : await getProducts();

  return <Products products={products} />;
}