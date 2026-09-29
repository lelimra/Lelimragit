import ProductsPageClient from "@/components/admin/products/ProductsPageClient";

export default async function AdminProductsPage({
  params,
}: {
  params: Promise<{
    locale: string;
  }>;
}) {
  await params;

  return <ProductsPageClient />;
}