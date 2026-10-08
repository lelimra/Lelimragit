import { notFound } from "next/navigation";

import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";

import ProductDetailClient from "@/components/products/ProductDetailsClient";
import ProductViewTracker from "@/components/analytics/ProductViewTracker";

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export default async function ProductDetailPage({
  params,
}: Props) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.slug,
    product.category,
    3
  );

  return (
<>
    <ProductViewTracker productId={product.id} />
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />

    </>

  );
}