import { notFound } from "next/navigation";

import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";

import ProductDetailClient from "@/components/products/ProductDetailsClient";

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
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}