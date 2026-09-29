import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Gauge,
  Home,
  Layers3,
  Ruler,
  Settings2,
  ShieldCheck,
  Store,
  Warehouse,
  Wind,
} from "lucide-react";

const products = [
  {
    model: "Auro",
    range: '48" Premium',
    description:
      "A refined model created for contemporary residential interiors.",
  },
  {
    model: "High Breeze",
    range: '48" Premium',
    description:
      "A performance-focused ceiling fan designed around everyday airflow.",
  },
  {
    model: "Avencer",
    range: '48" Premium',
    description:
      "A distinctive design with a selection of premium finishes.",
  },
  {
    model: "Enticer",
    range: '48" Premium',
    description:
      "An elegant contemporary model for modern interior spaces.",
  },
  {
    model: "Jazz",
    range: '48" Premium',
    description:
      "A stylish premium model available in multiple finishes.",
  },
  {
    model: "Fantasy",
    range: '24" Premium',
    description:
      "A compact model suited to spaces requiring a smaller sweep.",
  },
];

const finishes = [
  "Pearl White",
  "Pearl Ivory",
  "Satin Gold",
  "Baker's Brown",
  "Viola Blue",
  "Matt Black",
  "Rose Gold",
];

const applications = [
  {
    icon: Home,
    title: "Residential",
    text: "Designed for living rooms, bedrooms, dining spaces and everyday home environments.",
  },
  {
    icon: Store,
    title: "Commercial",
    text: "Product options suitable for retail, hospitality and other customer-facing spaces.",
  },
  {
    icon: Building2,
    title: "Workspaces",
    text: "Ceiling fan options for offices and professional indoor environments.",
  },
  {
    icon: Warehouse,
    title: "Large Spaces",
    text: "Solutions for larger indoor areas where effective air circulation is required.",
  },
];

const capabilities = [
  {
    icon: Settings2,
    number: "01",
    title: "Thoughtful Design",
    text: "Product design begins with practical requirements, visual balance and everyday usability.",
  },
  {
    icon: Wind,
    number: "02",
    title: "Airflow Focus",
    text: "The fundamental purpose of every ceiling fan remains at the centre of the product approach.",
  },
  {
    icon: Gauge,
    number: "03",
    title: "Performance",
    text: "A practical focus on dependable performance across the product range.",
  },
  {
    icon: BadgeCheck,
    number: "04",
    title: "Quality Focus",
    text: "Attention to construction, components and finishing helps create consistent products.",
  },
];

export default function IndustryShowcase() {
  return (
    <section className="bg-background">

      {/* =========================================================
          INTRO
      ========================================================= */}
      <div className="border-y border-border">
        <div className="mx-auto max-w-container px-4 py-20 sm:px-6 lg:px-8 lg:py-24">

          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                LIMRA INDUSTRY
              </p>

              <h2 className="mt-5 max-w-4xl font-heading text-4xl font-bold leading-[1.05] tracking-[-0.045em] text-foreground sm:text-4xl lg:text-5xl">
                A focused approach to
                <br />
                ceiling fan manufacturing.
              </h2>
            </div>

            <div>
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                Our collection brings together practical airflow, considered
                design and a range of finishes for residential and commercial
                environments.
              </p>

              <Link
                href="/about"
                className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary"
              >
                About LIMRA INDUSTRY
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================================
          PRODUCT COLLECTION
      ========================================================= */}
      <div className="mx-auto max-w-container px-4 py-20 sm:px-6 lg:px-8 lg:py-28">

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Product Collection
            </p>

            <h3 className="mt-4 font-heading text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
              Explore selected models.
            </h3>
          </div>

          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary"
          >
            View complete collection
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {products.map((product) => (
            <Link
              key={product.model}
              href="/products"
              className="group overflow-hidden rounded-[1.5rem] border border-border bg-secondary transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-background">

                <Image
                  src="/images/products/hero.png"
                  alt={`${product.model} ceiling fan`}
                  fill
                  className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute left-4 top-4 rounded-full border border-border bg-background/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground backdrop-blur">
                  {product.range}
                </div>

                <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/90 text-foreground backdrop-blur transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>

              <div className="p-6">
                <h4 className="font-heading text-xl font-semibold text-foreground">
                  {product.model}
                </h4>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {product.description}
                </p>
              </div>
            </Link>
          ))}

        </div>
      </div>

      {/* =========================================================
          RANGE SPLIT
      ========================================================= */}
      <div className="border-y border-border bg-secondary">
        <div className="mx-auto grid max-w-container lg:grid-cols-2">

          {/* 48 */}
          <Link
            href="/products?range=48-inch"
            className="group border-b border-border p-8 sm:p-12 lg:border-b-0 lg:border-r lg:p-16"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Premium Range
              </span>

              <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
            </div>

            <div className="mt-12">
              <p className="font-heading text-7xl font-bold tracking-[-0.08em] text-foreground sm:text-8xl">
                48"
              </p>

              <h3 className="mt-4 font-heading text-2xl font-semibold">
                Premium Ceiling Fans
              </h3>

              <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
                A collection of premium models including Auro, High Breeze,
                Avencer, Enticer and Jazz.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {["Auro", "High Breeze", "Avencer", "Enticer", "Jazz"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </Link>

          {/* 24 */}
          <Link
            href="/products?range=24-inch"
            className="group p-8 sm:p-12 lg:p-16"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Compact Range
              </span>

              <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
            </div>

            <div className="mt-12">
              <p className="font-heading text-7xl font-bold tracking-[-0.08em] text-foreground sm:text-8xl">
                24"
              </p>

              <h3 className="mt-4 font-heading text-2xl font-semibold">
                Compact Premium Fans
              </h3>

              <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
                A compact collection including High Breeze, Auro, Fantasy and
                V130 for spaces requiring a smaller sweep.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {["High Breeze", "Auro", "Fantasy", "V130"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </Link>

        </div>
      </div>

      {/* =========================================================
          FINISHES
      ========================================================= */}
      <div className="mx-auto max-w-container px-4 py-20 sm:px-6 lg:px-8 lg:py-28">

        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Finishing Options
            </p>

            <h3 className="mt-4 font-heading text-4xl font-bold tracking-[-0.04em] sm:text-4xl">
              Designed to
              <br />
              complement spaces.
            </h3>

            <p className="mt-6 max-w-lg text-sm leading-7 text-muted-foreground">
              LIMRA products are available across a selection of finishes,
              allowing different models to complement a variety of interior
              styles.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

            {finishes.map((finish, index) => (
              <div
                key={finish}
                className="group relative min-h-[130px] overflow-hidden rounded-2xl border border-border bg-secondary p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="absolute right-4 top-4 font-mono text-[10px] text-muted-foreground">
                  0{index + 1}
                </div>

                <div className="flex h-full items-end">
                  <p className="text-sm font-semibold text-foreground">
                    {finish}
                  </p>
                </div>
              </div>
            ))}

          </div>

        </div>
      </div>

      {/* =========================================================
          ENGINEERING / QUALITY
      ========================================================= */}
      <div className="bg-foreground text-background">
        <div className="mx-auto max-w-container px-4 py-20 sm:px-6 lg:px-8 lg:py-28">

          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Our Approach
            </p>

            <h3 className="mt-5 font-heading text-4xl font-bold tracking-[-0.04em] sm:text-4xl">
              The essentials,
              <br />
              carefully considered.
            </h3>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-background/60 sm:text-base">
              We focus on the elements that define a ceiling fan experience:
              airflow, design, construction, finish and everyday usability.
            </p>
          </div>

          <div className="mt-14 grid overflow-hidden rounded-3xl border border-background/10 sm:grid-cols-2 lg:grid-cols-4">

            {capabilities.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.number}
                  className="border-b border-background/10 p-7 last:border-b-0 sm:border-r lg:border-b-0 lg:last:border-r-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-background/35">
                      {item.number}
                    </span>

                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  <h4 className="mt-12 font-heading text-xl font-semibold">
                    {item.title}
                  </h4>

                  <p className="mt-4 text-sm leading-6 text-background/55">
                    {item.text}
                  </p>
                </div>
              );
            })}

          </div>

        </div>
      </div>

      {/* =========================================================
          APPLICATIONS
      ========================================================= */}
      <div className="mx-auto max-w-container px-4 py-20 sm:px-6 lg:px-8 lg:py-28">

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Applications
            </p>

            <h3 className="mt-4 font-heading text-4xl font-bold tracking-[-0.04em] sm:text-4xl">
              Made for
              <br />
              real spaces.
            </h3>
          </div>

          <p className="max-w-lg text-sm leading-7 text-muted-foreground">
            Explore product options suitable for different residential,
            commercial and professional environments.
          </p>

        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {applications.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-3xl border border-border bg-secondary p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
              >
                <Icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />

                <h4 className="mt-10 font-heading text-xl font-semibold">
                  {item.title}
                </h4>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.text}
                </p>
              </div>
            );
          })}

        </div>
      </div>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <div className="border-t border-border bg-secondary">
        <div className="mx-auto max-w-container px-4 py-20 sm:px-6 lg:px-8 lg:py-24">

          <div className="relative overflow-hidden rounded-[2rem] bg-primary px-7 py-12 text-primary-foreground sm:px-12 sm:py-16 lg:px-16">

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-primary-foreground/10" />
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full border border-primary-foreground/10" />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">

              <div className="max-w-3xl">

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">
                  Start a conversation
                </p>

                <h3 className="mt-5 font-heading text-4xl font-bold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                  Looking for the right
                  <br />
                  ceiling fan?
                </h3>

                <p className="mt-6 max-w-xl text-sm leading-7 text-primary-foreground/70">
                  Explore our product collection or speak with the LIMRA
                  INDUSTRY team about your requirements.
                </p>

              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">

                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary-foreground px-6 py-3.5 text-sm font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5"
                >
                  Explore Products
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-foreground/25 px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:border-primary-foreground/60"
                >
                  Contact LIMRA
                  <ArrowRight className="h-4 w-4" />
                </Link>

              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
}