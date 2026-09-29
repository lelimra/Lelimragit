import {
  Briefcase,
  Factory,
  Layers,
  ShieldCheck,
  Store,
} from "lucide-react";

import DealerForm from "../dealer/DealerForm";
import { Link } from "@/lib/navigation";

export default function DistributionNetworkSection() {
  return (
    <section
      className="py-12 sm:py-16 bg-white border-t border-slate-200"
      id="stockist-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-[#e31e24] uppercase tracking-wider">
              Distribution Network
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Applications for Super Stockist, Distributors &amp; Dealers
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              LE LIMRA (LIMRA INDUSTRIES) is expanding its PAN-India footprint. Partner directly with our Hyderabad manufacturing facility for state-level warehousing, district distribution, and authorized dealership privileges.
            </p>

            <div className="space-y-2.5 pt-1">
              <Link
                href="/dealers?role=Super+Stockist"
                className="flex items-center gap-3 p-3 rounded-xl bg-purple-50/70 border border-purple-200/80 hover:bg-purple-50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-950">
                      Super Stockist
                    </span>
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      State Level Hub
                    </span>
                  </div>

                  <p className="text-[11px] text-purple-800 truncate">
                    Regional warehouse hub, bulk dispatches &amp; primary territory
                  </p>
                </div>
              </Link>

              <Link
                href="/dealers?role=Distributor"
                className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50/70 border border-indigo-200/80 hover:bg-indigo-50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-950">
                      Zonal Distributor
                    </span>
                    <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                      District Partner
                    </span>
                  </div>

                  <p className="text-[11px] text-indigo-800 truncate">
                    District &amp; cluster distribution feeding counter retailers
                  </p>
                </div>
              </Link>

              <Link
                href="/dealers?role=Dealer"
                className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 hover:bg-blue-50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Store className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-950">
                      Authorized Dealer
                    </span>
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      Town Showroom
                    </span>
                  </div>

                  <p className="text-[11px] text-blue-800 truncate">
                    Showroom counter catering to electrical contractors &amp; walk-ins
                  </p>
                </div>
              </Link>
            </div>

            <div className="space-y-2 pt-2 text-xs text-slate-700">
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <Factory className="w-4 h-4 text-[#091a32] shrink-0" />
                <span>Direct factory manufacturer supply from Hyderabad plant.</span>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>2 Years manufacturer warranty backed with hassle-free support.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <DealerForm initialRole="Super Stockist" />
          </div>
        </div>
      </div>
    </section>
  );
}
