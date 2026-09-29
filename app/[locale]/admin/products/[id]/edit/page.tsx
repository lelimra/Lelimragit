import ProductForm from "@/components/admin/products/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}) {
  const { id } = await params;

  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    return (
      <main className="p-8">
        <h1 className="text-xl font-semibold">
          Invalid product ID
        </h1>
      </main>
    );
  }

  return (
    <ProductForm
      mode="edit"
      productId={productId}
    />
  );
}