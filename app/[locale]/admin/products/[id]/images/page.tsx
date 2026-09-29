import ProductImagesManager from "@/components/admin/products/ProductImagesManager";

export default async function ProductImagesPage({
  params,
}: {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}) {
  const { id } = await params;

  const productId = Number(id);

  if (!Number.isInteger(productId)) {
    return <div>Invalid product ID</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-black sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <ProductImagesManager productId={productId} />
      </div>
    </main>
  );
}