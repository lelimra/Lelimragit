import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CircleDot,
  Ruler,
} from "lucide-react";

const ranges = [
  {
    number: "01",
    title: "48\" Premium Range",
    description:
      "Our premium full-size ceiling fan collection, combining distinctive designs, refined finishes and dependable everyday performance.",
    models: ["Auro", "High Breeze", "Avencer", "Enticer", "Jazz"],
    href: "/products?range=48-inch",
    image: "/images/products/hero.png",
    featured: true,
  },
  {
    number: "02",
    title: "24\" Premium Range",
    description:
      "Compact premium models designed for spaces where efficient airflow and a smaller sweep are required.",
    models: ["High Breeze", "Auro", "Fantasy", "V130"],
    href: "/products?range=24-inch",
    image: "/images/products/hero.png",
    featured: false,
  },
];

const featuredModels = [
  "Auro",
  "High Breeze",
  "Avencer",
  "Enticer",
  "Jazz",
];

export default function Categories() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-background py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-primary" />

              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Our Range
              </p>
            </div>

            <h2 className="mt-4 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Designed to make
              <span className="block text-primary">
                every space better.
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Explore our premium ceiling fan collections, developed around
              different space requirements, sizes and design preferences.
            </p>
          </div>

          <Link
            href="/products"
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
          >
            View complete catalogue

            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* =====================================================
            PRODUCT RANGE CARDS
        ===================================================== */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {ranges.map((range) => (
            <Link
              key={range.title}
              href={range.href}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-card"
            >
              {/* Image */}
              <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
                <img
                  src={range.image}
                  alt={`${range.title} ceiling fans`}
                  className="h-full w-full object-contain p-8 transition-transform duration-700 group-hover:scale-105 sm:p-12"
                />

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 via-transparent to-transparent" />

                {/* Range number */}
                <div className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/90 text-xs font-semibold text-primary backdrop-blur-md sm:left-6 sm:top-6">
                  {range.number}
                </div>

                {/* Size badge */}
                <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-border bg-background/90 px-3 py-2 text-xs font-semibold text-foreground backdrop-blur-md sm:right-6 sm:top-6">
                  <Ruler className="h-3.5 w-3.5 text-primary" />
                  {range.title.split(" ")[0]}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Premium Collection
                    </p>

                    <h3 className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
                      {range.title}
                    </h3>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                  {range.description}
                </p>

                {/* Models */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {range.models.map((model) => (
                    <span
                      key={model}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                    >
                      <CircleDot className="h-2.5 w-2.5 text-primary" />
                      {model}
                    </span>
                  ))}
                </div>

                <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-primary">
                  Explore range

                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* =====================================================
            FEATURED MODELS
        ===================================================== */}
        <div className="mt-16 border-t border-border pt-8 sm:mt-20 sm:pt-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Featured Models
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                Explore some of the models in our premium collection.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {featuredModels.map((model) => (
                <Link
                  key={model}
                  href={`/products?model=${encodeURIComponent(model)}`}
                  className="rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  {model}
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}