import { ArrowRight } from "lucide-react";

import ProductCard from "../products/ProductCard";
import { Link } from "@/lib/navigation";
import type { Product } from "@/data/products";

type FeaturedFansSectionProps = {
  products: Product[];
};

export default function FeaturedFansSection({
  products,
}: FeaturedFansSectionProps) {
  const featuredFans = products.slice(0, 4);

  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-[#091a32] uppercase tracking-wider">
              Direct From Hyderabad Factory
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Featured Fan Models
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Reliable copper motors, double ball bearings, and pan-India dispatch.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#091a32] hover:text-[#e31e24] transition-colors shrink-0"
          >
            <span>View All {products.length} Models</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredFans.map((fan) => (
            <ProductCard key={fan.id} product={fan} />
          ))}
        </div>
      </div>
    </section>
  );
}
