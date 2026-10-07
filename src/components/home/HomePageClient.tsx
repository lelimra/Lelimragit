import { HeroCarousel } from "./HeroCarousel";
import { TrustStrip } from "../common/TrustStrip";
import FeaturedFansSection from "./FeaturedFansSection";
import ProductCategoriesSection from "./ProductCategoriesSection";
import WhyLimraSection from "./WhyLimraSection";
import DistributionNetworkSection from "./DistributionNetworkSection";
import DistributionCalloutBar from "./DistributionCalloutBar";
import { getManagedProducts } from "@/lib/productCatalog";

export default async function HomePageClient() {
  const products = await getManagedProducts();
  const heroProducts = products.filter((product) => product.featured).slice(0, 4);

  return (
    <>
      <HeroCarousel products={heroProducts} />
      <TrustStrip />
      <FeaturedFansSection products={products} />
      <ProductCategoriesSection />
      <WhyLimraSection />
      <DistributionNetworkSection />
      <DistributionCalloutBar />
    </>
  );
}