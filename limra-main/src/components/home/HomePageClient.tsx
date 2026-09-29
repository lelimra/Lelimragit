"use client";

import { HeroCarousel } from "./HeroCarousel";
import { TrustStrip } from "../common/TrustStrip";
import { getAllProducts } from "@/data/products";

import FeaturedFansSection from "./FeaturedFansSection";
import ProductCategoriesSection from "./ProductCategoriesSection";
import WhyLimraSection from "./WhyLimraSection";
import DistributionNetworkSection from "./DistributionNetworkSection";
import DistributionCalloutBar from "./DistributionCalloutBar";

export default function HomePageClient() {
  const products = getAllProducts();

  return (
    <>
      <HeroCarousel />
      <TrustStrip />
      <FeaturedFansSection products={products} />
      <ProductCategoriesSection />
      <WhyLimraSection />
      <DistributionNetworkSection />
      <DistributionCalloutBar />
    </>
  );
}
