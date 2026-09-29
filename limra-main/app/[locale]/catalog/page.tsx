import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
  Ruler,
} from "lucide-react";

const products = [
  {
    model: "Auro",
    range: '48" Premium',
    sweep: "48 inch",
    finishes: ["Satin Gold", "Baker's Brown", "Pearl Ivory"],
  },
  {
    model: "High Breeze",
    range: '48" Premium',
    sweep: "48 inch",
    finishes: ["Baker's Brown"],
  },
  {
    model: "Avencer",
    range: '48" Premium',
    sweep: "48 inch",
    finishes: [
      "Viola Blue",
      "Baker's Brown",
      "Pearl Ivory",
      "Satin Gold",
    ],
  },
  {
    model: "Enticer",
    range: '48" Premium',
    sweep: "48 inch",
    finishes: ["Satin Gold", "Pearl White", "Rose Gold"],
  },
  {
    model: "Jazz",
    range: '48" Premium',
    sweep: "48 inch",
    finishes: ["Matt Black", "Satin Gold", "Pearl White"],
  },
  {
    model: "High Breeze",
    range: '24" Premium',
    sweep: "24 inch",
    finishes: [],
  },
  {
    model: "Auro",
    range: '24" Premium',
    sweep: "24 inch",
    finishes: [],
  },
  {
    model: "Fantasy",
    range: '24" Premium',
    sweep: "24 inch",
    finishes: [],
  },
  {
    model: "V130",
    range: '24" Premium',
    sweep: "24 inch",
    finishes: [],
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

export default function CataloguePage() {
  const premium48 = products.filter(
    (product) => product.range === '48" Premium',
  );

  const premium24 = products.filter(
    (product) => product.range === '24" Premium',
  );

  return (
    <main className="overflow-hidden bg-background">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative border-b border-border bg-background">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-0 top-0 h-[450px] w-[450px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-container px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">

          <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-end">

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <FileText className="h-3.5 w-3.5 text-primary" />
                Product Catalogue
              </div>

              <h1 className="mt-7 max-w-4xl font-heading text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-foreground lg:text-4xl lg:text-5xl">
                The LIMRA
                <br />
                <span className="text-primary">Collection.</span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                Explore the LIMRA INDUSTRY ceiling fan collection, including
                our 48-inch and 24-inch premium ranges, available models and
                finish options.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#catalogue"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5"
                >
                  Explore Catalogue
                  <ArrowDown className="h-4 w-4" />
                </a>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:border-primary hover:text-primary"
                >
                  Enquire Now
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Catalogue Summary */}
            <div className="rounded-3xl border border-border bg-secondary p-7 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Collection Overview
              </p>

              <div className="mt-8 divide-y divide-border">

                <div className="flex items-center justify-between py-5 first:pt-0">
                  <span className="text-sm text-muted-foreground">
                    Premium ranges
                  </span>

                  <span className="font-heading text-xl font-semibold">
                    02
                  </span>
                </div>

                <div className="flex items-center justify-between py-5">
                  <span className="text-sm text-muted-foreground">
                    Catalogue models
                  </span>

                  <span className="font-heading text-xl font-semibold">
                    09
                  </span>
                </div>

                <div className="flex items-center justify-between py-5">
                  <span className="text-sm text-muted-foreground">
                    Finish options
                  </span>

                  <span className="font-heading text-xl font-semibold">
                    07
                  </span>
                </div>

                <div className="flex items-center justify-between pt-5">
                  <span className="text-sm text-muted-foreground">
                    Product focus
                  </span>

                  <span className="font-heading text-xl font-semibold">
                    Fans
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          CATALOGUE NAVIGATION
      ========================================================= */}
      <section
        id="catalogue"
        className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-container items-center gap-6 overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">

          <a
            href="#48-premium"
            className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:text-primary"
          >
            48" Premium
          </a>

          <span className="h-4 w-px bg-border" />

          <a
            href="#24-premium"
            className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-primary"
          >
            24" Premium
          </a>

          <span className="h-4 w-px bg-border" />

          <a
            href="#finishes"
            className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-primary"
          >
            Finishes
          </a>

          <span className="h-4 w-px bg-border" />

          <a
            href="#enquiry"
            className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-primary"
          >
            Enquiry
          </a>

        </div>
      </section>

      {/* =========================================================
          48 PREMIUM
      ========================================================= */}
      <section
        id="48-premium"
        className="scroll-mt-20 border-b border-border py-20 sm:py-24 lg:py-28"
      >
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">

          <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr]">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Premium Range
              </p>

              <p className="mt-5 font-heading text-8xl font-bold leading-none tracking-[-0.08em] text-foreground">
                48"
              </p>

              <h2 className="mt-4 font-heading text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                Premium Ceiling Fans
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
                Our 48-inch premium collection brings together five models
                with different visual identities and finish options.
              </p>

              <div className="mt-8 flex items-center gap-3 text-xs text-muted-foreground">
                <Ruler className="h-4 w-4 text-primary" />
                48 inch sweep range
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              {premium48.map((product, index) => (
                <div
                  key={`${product.model}-${index}`}
                  className="group overflow-hidden rounded-3xl border border-border bg-secondary"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-background">

                    <Image
                      src="/images/products/hero.png"
                      alt={`${product.model} 48 inch ceiling fan`}
                      fill
                      className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                    />

                    <span className="absolute left-4 top-4 rounded-full border border-border bg-background/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur">
                      48" Premium
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-heading text-xl font-semibold">
                          {product.model}
                        </h3>

                        <p className="mt-2 text-xs text-muted-foreground">
                          {product.sweep}
                        </p>
                      </div>

                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>

                    {product.finishes.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {product.finishes.map((finish) => (
                          <span
                            key={finish}
                            className="rounded-full border border-border px-2.5 py-1 text-[10px] text-muted-foreground"
                          >
                            {finish}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          24 PREMIUM
      ========================================================= */}
      <section
        id="24-premium"
        className="scroll-mt-20 border-b border-border bg-secondary py-20 sm:py-24 lg:py-28"
      >
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">

          <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr]">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Compact Range
              </p>

              <p className="mt-5 font-heading text-8xl font-bold leading-none tracking-[-0.08em] text-foreground">
                24"
              </p>

              <h2 className="mt-4 font-heading text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                Compact Premium Fans
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
                A compact collection featuring High Breeze, Auro, Fantasy and
                V130 for applications where a smaller sweep is required.
              </p>

              <div className="mt-8 flex items-center gap-3 text-xs text-muted-foreground">
                <Ruler className="h-4 w-4 text-primary" />
                24 inch sweep range
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              {premium24.map((product, index) => (
                <div
                  key={`${product.model}-${index}`}
                  className="group overflow-hidden rounded-3xl border border-border bg-background"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">

                    <Image
                      src="/images/products/hero.png"
                      alt={`${product.model} 24 inch ceiling fan`}
                      fill
                      className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                    />

                    <span className="absolute left-4 top-4 rounded-full border border-border bg-background/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur">
                      24" Premium
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-heading text-xl font-semibold">
                          {product.model}
                        </h3>

                        <p className="mt-2 text-xs text-muted-foreground">
                          {product.sweep}
                        </p>
                      </div>

                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          ALL MODELS TABLE
      ========================================================= */}
      <section className="border-b border-border py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">

          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Model Index
            </p>

            <h2 className="mt-4 font-heading text-4xl font-bold tracking-[-0.04em] sm:text-4xl">
              Catalogue at a glance.
            </h2>

            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              A quick reference to the current LIMRA INDUSTRY model
              collection.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-3xl border border-border">
            <div className="hidden grid-cols-[0.5fr_1fr_1fr_2fr] border-b border-border bg-secondary px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground md:grid">
              <span>No.</span>
              <span>Model</span>
              <span>Range</span>
              <span>Available Finishes</span>
            </div>

            {products.map((product, index) => (
              <div
                key={`${product.model}-${product.range}-index`}
                className="grid gap-3 border-b border-border px-6 py-5 last:border-b-0 md:grid-cols-[0.5fr_1fr_1fr_2fr] md:items-center"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <p className="font-heading font-semibold">
                    {product.model}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground md:hidden">
                    {product.range}
                  </p>
                </div>

                <span className="hidden text-sm text-muted-foreground md:block">
                  {product.range}
                </span>

                <div className="flex flex-wrap gap-1.5">
                  {product.finishes.length > 0 ? (
                    product.finishes.map((finish) => (
                      <span
                        key={finish}
                        className="rounded-full border border-border px-2.5 py-1 text-[10px] text-muted-foreground"
                      >
                        {finish}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Finish options available on enquiry
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================
          FINISHES
      ========================================================= */}
      <section
        id="finishes"
        className="scroll-mt-20 bg-secondary py-20 sm:py-24 lg:py-28"
      >
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">

          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Finish Collection
              </p>

              <h2 className="mt-4 font-heading text-4xl font-bold tracking-[-0.04em] sm:text-4xl">
                Colours for
                <br />
                different interiors.
              </h2>

              <p className="mt-6 max-w-lg text-sm leading-7 text-muted-foreground">
                Selected models are available in a range of finishes designed
                to complement different interior styles.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

              {finishes.map((finish, index) => (
                <div
                  key={finish}
                  className="group relative flex min-h-[130px] items-end overflow-hidden rounded-2xl border border-border bg-background p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
                >
                  <span className="absolute right-4 top-4 font-mono text-[10px] text-muted-foreground">
                    0{index + 1}
                  </span>

                  <span className="text-sm font-semibold">
                    {finish}
                  </span>
                </div>
              ))}

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          PRODUCT INFORMATION
      ========================================================= */}
      <section className="border-b border-border bg-background py-20 sm:py-24">

        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">

          <div className="grid gap-5 md:grid-cols-3">

            <div className="rounded-3xl border border-border bg-secondary p-7">
              <Ruler className="h-5 w-5 text-primary" />

              <h3 className="mt-7 font-heading text-xl font-semibold">
                48-inch Range
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Premium models designed around a 48-inch sweep size.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-secondary p-7">
              <Ruler className="h-5 w-5 text-primary" />

              <h3 className="mt-7 font-heading text-xl font-semibold">
                24-inch Range
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Compact models designed around a 24-inch sweep size.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-secondary p-7">
              <CheckCircle2 className="h-5 w-5 text-primary" />

              <h3 className="mt-7 font-heading text-xl font-semibold">
                Product Enquiry
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Contact the LIMRA INDUSTRY team for detailed model
                specifications and availability.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          CATALOGUE CTA
      ========================================================= */}
      <section
        id="enquiry"
        className="scroll-mt-20 bg-foreground text-background"
      >
        <div className="mx-auto max-w-container px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">

          <div className="grid gap-12 lg:grid-cols-[1fr_0.75fr] lg:items-end">

            <div className="max-w-3xl">

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Catalogue Enquiry
              </p>

              <h2 className="mt-5 font-heading text-4xl font-bold tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                Need detailed product
                <br />
                information?
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-background/60 sm:text-base">
                Get in touch with LIMRA INDUSTRY for product details,
                catalogue information, model availability and business
                enquiries.
              </p>

            </div>

            <div className="rounded-3xl border border-background/10 bg-background/[0.04] p-7">

              <div className="space-y-5">

                <div className="flex gap-4">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />

                  <div>
                    <p className="text-sm font-semibold">
                      LIMRA INDUSTRY
                    </p>

                    <p className="mt-1 text-sm leading-6 text-background/55">
                      H.No.10-1-31,
                      <br />
                      Fathe Nagar, Balanagar,
                      <br />
                      Hyderabad, Telangana
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 border-t border-background/10 pt-5">
                  <Phone className="h-5 w-5 shrink-0 text-primary" />

                  <p className="text-sm text-background/60">
                    Contact number to be added
                  </p>
                </div>

                <div className="flex gap-4 border-t border-background/10 pt-5">
                  <Mail className="h-5 w-5 shrink-0 text-primary" />

                  <p className="text-sm text-background/60">
                    Email address to be added
                  </p>
                </div>

              </div>

              <Link
                href="/contact"
                className="group mt-8 flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5"
              >
                Send an Enquiry

                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}