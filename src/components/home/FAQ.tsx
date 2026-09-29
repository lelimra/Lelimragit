"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What size is the Avencer Prime ceiling fan?",
    answer:
      "The Avencer Prime is a 1200 mm (48 inch) decorative ceiling fan with 3 blades.",
  },
  {
    question: "What colours are available?",
    answer:
      "Avencer Prime is available in four colours: Viola Blue, Pearl Ivory, Baker's Brown and Satin Gold.",
  },
  {
    question: "What is the airflow of Avencer Prime?",
    answer:
      "The Avencer Prime provides an airflow of 207 CFM with a motor speed of 380 RPM.",
  },
  {
    question: "How much power does the fan use?",
    answer:
      "The Avencer Prime has a power usage of 70 W.",
  },
  {
    question: "What material is used in the fan?",
    answer:
      "The fan body is made from aluminium and uses aluminium winding in the motor.",
  },
  {
    question: "What warranty is provided?",
    answer:
      "The Avencer Prime comes with a 2 year warranty.",
  },
  {
    question: "Do you accept wholesale and bulk orders?",
    answer:
      "Yes. LIMRA INDUSTRY supplies fans for wholesalers, distributors, dealers and bulk buyers. Contact us with your required quantity and delivery location for pricing and availability.",
  },
  {
    question: "How can I become a LIMRA dealer?",
    answer:
      "You can submit a dealership enquiry through our dealer page. Our team can then provide information about the dealership process and requirements.",
  },
];

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="border-y border-slate-200 bg-slate-50 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0b5cab]">
            FAQ
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-[#07192f] sm:text-4xl">
            Frequently Asked Questions
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Find quick answers about our products, specifications,
            colours, warranty and wholesale orders.
          </p>
        </div>

        {/* FAQ GRID */}
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;

            return (
              <div
                key={faq.question}
                className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                  isOpen
                    ? "border-blue-200 shadow-md shadow-blue-900/5"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* QUESTION */}
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaq(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-sm font-bold leading-6 transition-colors ${
                      isOpen
                        ? "text-[#0b2f5c]"
                        : "text-[#07192f]"
                    }`}
                  >
                    {faq.question}
                  </span>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      isOpen
                        ? "bg-[#0b2f5c] text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </button>

                {/* ANSWER */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-slate-100 px-5 pb-5 pt-4">
                      <p className="text-sm leading-6 text-slate-500">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM CTA */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-center sm:flex-row sm:text-left sm:p-6">
          <div>
            <p className="text-sm font-black text-[#07192f]">
              Need more information?
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Contact our team for product and wholesale enquiries.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#0b2f5c] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#07192f]"
          >
            Contact Us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}