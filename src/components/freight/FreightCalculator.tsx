"use client";

import { useMemo, useState } from "react";
import {
  FAN_PACKING_SPECS,
  TRANSPORT_DESTINATIONS,
  VEHICLE_CAPACITIES,
} from "@/data/freightData";
import { siteConfig } from "@/data/site";

export default function FreightCalculator() {
  const [spec, setSpec] = useState(
    "standard_ceiling_4in1"
  );

  const [qty, setQty] = useState(50);

  const [state, setState] = useState(
    "Telangana"
  );

  const [door, setDoor] = useState(false);

  const calculation = useMemo(() => {
    const packing =
      FAN_PACKING_SPECS[spec] ??
      Object.values(FAN_PACKING_SPECS)[0];

    const destination =
      TRANSPORT_DESTINATIONS.find(
        (item) => item.state === state
      ) ??
      TRANSPORT_DESTINATIONS[0];

    const safeQuantity = Math.max(
      1,
      Math.min(100000, qty || 1)
    );

    const cartons = Math.ceil(
      safeQuantity / packing.unitsPerCarton
    );

    const weight =
      cartons *
      packing.cartonGrossWeightKg;

    const cbm =
      cartons *
      packing.cartonCbm;

    const surcharge = door ? 1.15 : 1;

    const low = Math.round(
      cartons *
        destination.freightPerCartonRange[0] *
        surcharge
    );

    const high = Math.round(
      cartons *
        destination.freightPerCartonRange[1] *
        surcharge
    );

    const vehicle =
      VEHICLE_CAPACITIES.find(
        (item) =>
          cartons <= item.maxCartons
      ) ??
      VEHICLE_CAPACITIES[
        VEHICLE_CAPACITIES.length - 1
      ];

    return {
      packing,
      destination,
      quantity: safeQuantity,
      cartons,
      weight,
      cbm,
      low,
      high,
      vehicle,
    };
  }, [spec, qty, state, door]);

  const formatCurrency = (
    value: number
  ) =>
    `₹${value.toLocaleString("en-IN")}`;

  const message = encodeURIComponent(
    [
      "Hello LE LIMRA,",
      "",
      "I would like to confirm a freight estimate.",
      "",
      `Packing: ${calculation.packing.name}`,
      `Quantity: ${calculation.quantity} fans`,
      `Cartons: ${calculation.cartons}`,
      `Destination: ${calculation.destination.state}`,
      `Delivery: ${
        door
          ? "Door delivery"
          : "Transport / carrier delivery"
      }`,
      `Indicative freight: ${formatCurrency(
        calculation.low
      )} – ${formatCurrency(
        calculation.high
      )}`,
      "",
      "Please confirm the actual freight and delivery charges.",
    ].join("\n")
  );

  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${message}`;

  return (
    <main className="bg-slate-50">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
              B2B Logistics
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Freight Estimator
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Estimate carton quantity, shipment weight,
              volume, vehicle requirement and indicative
              freight for your fan order.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN
          ===================================================== */}

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          {/* =================================================
              LEFT — INPUTS
              ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <h2 className="text-lg font-bold text-slate-950">
                Shipment details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter your order requirements to calculate
                an indicative freight range.
              </p>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              {/* STEP 1 */}

              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    1
                  </span>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Select packing
                    </h3>

                    <p className="text-xs text-slate-500">
                      Choose the fan packing configuration.
                    </p>
                  </div>
                </div>

                <label
                  htmlFor="fan-packing"
                  className="sr-only"
                >
                  Fan packing type
                </label>

                <select
                  id="fan-packing"
                  value={spec}
                  onChange={(event) =>
                    setSpec(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                >
                  {Object.values(
                    FAN_PACKING_SPECS
                  ).map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* STEP 2 */}

              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    2
                  </span>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Enter quantity
                    </h3>

                    <p className="text-xs text-slate-500">
                      Number of fans required.
                    </p>
                  </div>
                </div>

                <label
                  htmlFor="fan-quantity"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Number of fans
                </label>

                <div className="relative">
                  <input
                    id="fan-quantity"
                    type="number"
                    min={1}
                    max={100000}
                    value={qty}
                    onChange={(event) => {
                      const value =
                        Number(event.target.value);

                      setQty(
                        Math.min(
                          100000,
                          Math.max(
                            1,
                            Number.isFinite(value)
                              ? value
                              : 1
                          )
                        )
                      );
                    }}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-20 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />

                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-slate-400">
                    fans
                  </span>
                </div>
              </div>

              {/* STEP 3 */}

              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    3
                  </span>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Choose destination
                    </h3>

                    <p className="text-xs text-slate-500">
                      Select the destination state.
                    </p>
                  </div>
                </div>

                <label
                  htmlFor="destination-state"
                  className="sr-only"
                >
                  Destination state
                </label>

                <select
                  id="destination-state"
                  value={state}
                  onChange={(event) =>
                    setState(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                >
                  {TRANSPORT_DESTINATIONS.map(
                    (item) => (
                      <option
                        key={item.state}
                        value={item.state}
                      >
                        {item.state}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* DELIVERY */}

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300">
                <input
                  type="checkbox"
                  checked={door}
                  onChange={(event) =>
                    setDoor(
                      event.target.checked
                    )
                  }
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-slate-900"
                />

                <span>
                  <span className="block text-sm font-semibold text-slate-900">
                    Include door delivery
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Adds the indicative delivery surcharge
                    to the freight estimate.
                  </span>
                </span>
              </label>

              {/* PACKING INFO */}

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Selected packing
                </p>

                <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-slate-500">
                      Units/carton
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {calculation.packing.unitsPerCarton}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Gross/carton
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {
                        calculation.packing
                          .cartonGrossWeightKg
                      }{" "}
                      kg
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Carton volume
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {
                        calculation.packing
                          .cartonCbm
                      }{" "}
                      m³
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT — RESULT
              ================================================= */}

          <div className="space-y-5 lg:sticky lg:top-24">
            {/* FREIGHT RESULT */}

            <div
              aria-live="polite"
              className="overflow-hidden rounded-2xl bg-slate-900 text-white shadow-sm"
            >
              <div className="border-b border-white/10 px-5 py-5 sm:px-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Indicative freight
                </p>

                <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {formatCurrency(
                      calculation.low
                    )}
                  </span>

                  <span className="text-lg text-slate-400">
                    –
                  </span>

                  <span className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {formatCurrency(
                      calculation.high
                    )}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Indicative estimate only. Final freight
                  depends on carrier, route and shipment
                  details.
                </p>
              </div>

              <div className="grid grid-cols-2 divide-x divide-y divide-white/10">
                <ResultItem
                  label="Fans"
                  value={calculation.quantity.toLocaleString(
                    "en-IN"
                  )}
                />

                <ResultItem
                  label="Cartons"
                  value={calculation.cartons.toLocaleString(
                    "en-IN"
                  )}
                />

                <ResultItem
                  label="Gross weight"
                  value={`${calculation.weight.toFixed(
                    1
                  )} kg`}
                />

                <ResultItem
                  label="Volume"
                  value={`${calculation.cbm.toFixed(
                    3
                  )} m³`}
                />
              </div>
            </div>

            {/* VEHICLE */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Suggested transport
              </p>

              <div className="mt-3 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-950">
                    {calculation.vehicle.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Suitable for approximately{" "}
                    {
                      calculation.vehicle
                        .maxCartons
                    }{" "}
                    cartons.
                  </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl">
                  🚚
                </div>
              </div>
            </div>

            {/* TRANSIT */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5 text-slate-700"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6l4 2"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Estimated transit
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {calculation.destination.estimatedTransitDays}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 active:scale-[0.99]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M20.5 3.5A11.8 11.8 0 0012.1 0C5.5 0 .2 5.3.2 11.9c0 2.1.6 4.2 1.7 6L.1 24l6.3-1.7a12 12 0 005.7 1.5h.1c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.3-6.2-3.6-8.4zM12.2 21.8c-1.8 0-3.6-.5-5.1-1.5l-.4-.2-3.7 1 1-3.6-.2-.4a9.9 9.9 0 01-1.5-5.2c0-5.5 4.5-9.9 10-9.9 2.6 0 5.1 1 7 2.9 1.9 1.9 2.9 4.4 2.9 7 0 5.5-4.5 9.9-10 9.9zm5.4-7.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-1.7-.8-2.8-1.4-3.9-3.2-.3-.5.3-.5.9-1.7.1-.2.1-.4 0-.6-.1-.2-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.2 2.3 3.5 5.6 4.9.8.3 1.4.5 1.9.6.8.3 1.5.2 2 .1.6-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.4z" />
              </svg>

              Confirm estimate on WhatsApp
            </a>

            <p className="text-center text-xs leading-5 text-slate-500">
              Our team will verify the current carrier rate,
              route availability and final delivery charges.
            </p>
          </div>
        </div>

        {/* =================================================
            DISCLAIMER
            ================================================= */}

        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 sm:px-5">
          <p className="text-xs leading-5 text-amber-900">
            <strong>Important:</strong>{" "}
            This calculator provides indicative freight
            estimates only. Actual charges may vary based on
            carrier, loading requirements, route, destination
            accessibility, fuel charges, order size and
            delivery terms. Please confirm the final freight
            quotation with LE LIMRA before placing an order.
          </p>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   RESULT ITEM
   ========================================================= */

function ResultItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="px-5 py-4 sm:px-6">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-white">
        {value}
      </p>
    </div>
  );
}