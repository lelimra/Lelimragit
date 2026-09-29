import { ArrowRight } from "lucide-react";

import { Link } from "@/lib/navigation";

export default function DistributionCalloutBar() {
  return (
    <div className="bg-[#091a32] text-white py-4 px-4 sm:px-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center md:text-left">
          <span className="w-2.5 h-2.5 rounded-full bg-[#e31e24] animate-pulse shrink-0" />

          <div>
            <p className="text-sm font-bold text-white">
              Applications Open for Super Stockist, Distributors &amp; Authorized Dealers
            </p>

            <p className="text-xs text-slate-300">
              Direct Hyderabad factory allocation with state-level territorial rights and verified warranty support.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/dealers?role=Super+Stockist"
            className="bg-[#e31e24] hover:bg-[#c4181d] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-colors inline-flex items-center gap-1.5"
          >
            <span>Apply for Super Stockist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/dealers"
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2.5 rounded-lg transition-colors border border-white/20"
          >
            All Partner Roles
          </Link>
        </div>
      </div>
    </div>
  );
}
