import { Link } from "@/lib/navigation";
import { getTranslations } from "next-intl/server";

import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Gauge,
  Handshake,
  Leaf,
  MessageCircle,
  Ruler,
  Settings2,
  ShieldCheck,
  Target,
  Wind,
} from "lucide-react";
import LeadershipProfiles from "@/components/about/LeadershipProfiles";

const values = [
  {
    number: "01",
    icon: Settings2,
    title: "productFocus",
    description: "productFocusDescription",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "qualityMindset",
    description: "qualityMindsetDescription",
  },
  {
    number: "03",
    icon: Handshake,
    title: "customerFirst",
    description: "customerFirstDescription",
  },
  {
    number: "04",
    icon: Leaf,
    title: "responsibleApproach",
    description: "responsibleApproachDescription",
  },
];

const capabilities = [
  {
    icon: Ruler,
    title: "productDevelopment",
    description: "productDevelopmentDescription",
  },
  {
    icon: Wind,
    title: "airflowPerformance",
    description: "airflowPerformanceDescription",
  },
  {
    icon: Gauge,
    title: "performanceFocus",
    description: "performanceFocusDescription",
  },
  {
    icon: BadgeCheck,
    title: "finishDetail",
    description: "finishDetailDescription",
  },
];

const ranges = [
  {
    size: '48"',
    title: "fullSize",
    models: ["Auro", "High Breeze", "Avencer", "Enticer", "Jazz"],
  },
  {
    size: '24"',
    title: "compactSize",
    models: ["High Breeze", "Auro", "Fantasy", "V130"],
  },
];

const applications = [
  "homes",
  "commercial",
  "workspaces",
  "largeSpaces",
];

export default async function AboutPage() {
  const t = await getTranslations("About");

  return (
    <main className="overflow-hidden bg-background text-foreground">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden border-b border-border bg-secondary/30">
        <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />

        <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">

          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">

            <div className="lg:col-span-7">

              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-1.5 backdrop-blur-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />

                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {t("hero.badge")}
                </span>
              </div>

              <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight lg:text-5xl">
                {t("hero.title")}{" "}
                <span className="text-primary">
                  {t("hero.titleHighlight")}
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                {t("hero.description")}
              </p>
            </div>

            <div className="w-full lg:col-span-5 lg:justify-self-end">

              <div className="relative rounded-2xl border border-border bg-background/80 p-8 shadow-xl backdrop-blur-md">

                <div className="absolute -top-3 right-8 rounded-md bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
                  {t("hero.approach")}
                </div>

                <p className="text-sm font-medium uppercase tracking-[0.15em] text-foreground">
                  {t("hero.precision")}
                </p>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t("hero.approachDescription")}
                </p>

              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="mt-20 grid grid-cols-1 divide-y divide-border rounded-2xl border border-border bg-background/50 backdrop-blur-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0">

            <div className="p-6 sm:p-8">
              <p className="font-heading text-4xl font-bold tracking-tight text-foreground">
                48"
              </p>

              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {t("metrics.fullSize")}
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <p className="font-heading text-4xl font-bold tracking-tight text-foreground">
                24"
              </p>

              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {t("metrics.compact")}
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <p className="font-heading text-4xl font-bold tracking-tight text-foreground">
                09
              </p>

              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {t("metrics.models")}
              </p>
            </div>

          </div>
        </div>
      </section>

      <LeadershipProfiles/>

      {/* =========================================================
          COMPANY INTRODUCTION
      ========================================================= */}
      <section className="py-24 sm:py-32">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">

            <div className="relative lg:col-span-6">

              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-secondary shadow-2xl lg:aspect-[4/5]">

                <img
                  src="/images/about/about-factory.png"
                  alt={t("company.imageAlt")}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/15 bg-background/80 p-6 shadow-lg backdrop-blur-xl">

                  <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    {t("company.excellence")}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {t("company.imageCaption")}
                  </p>

                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center lg:col-span-6">

              <div className="inline-flex items-center gap-2">
                <span className="h-px w-8 bg-primary" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  {t("company.label")}
                </span>
              </div>

              <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                {t("company.title")}
              </h2>

              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">

                <p>
                  {t("company.paragraph1")}
                </p>

                <p>
                  {t("company.paragraph2")}
                </p>

              </div>

              <div className="mt-8">

                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:translate-x-1 hover:bg-primary/90"
                >
                  {t("company.exploreProducts")}

                  <ArrowRight className="h-4 w-4" />
                </Link>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          MISSION & VISION
      ========================================================= */}
      <section className="border-y border-border bg-secondary/30 py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-8 lg:grid-cols-2">

            {/* Mission */}
            <div className="relative rounded-3xl border border-border bg-background p-8 shadow-sm transition-all hover:shadow-md sm:p-10">

              <div className="flex items-center justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Target className="h-6 w-6" />
                </div>

                <span className="font-heading text-6xl font-black text-muted-foreground/10">
                  01
                </span>

              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-widest text-primary">
                {t("mission.label")}
              </p>

              <h3 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">
                {t("mission.title")}
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t("mission.description")}
              </p>

            </div>

            {/* Vision */}
            <div className="relative rounded-3xl border border-primary/20 bg-primary p-8 text-primary-foreground shadow-xl sm:p-10">

              <div className="flex items-center justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-primary-foreground">
                  <Wind className="h-6 w-6" />
                </div>

                <span className="font-heading text-6xl font-black text-white/10">
                  02
                </span>

              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-widest text-primary-foreground/70">
                {t("vision.label")}
              </p>

              <h3 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">
                {t("vision.title")}
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
                {t("vision.description")}
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          CORE VALUES
      ========================================================= */}
      <section className="py-24 sm:py-32">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2">

              <span className="h-px w-8 bg-primary" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                {t("values.label")}
              </span>

            </div>

            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              {t("values.title")}
            </h2>

          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {values.map((value) => {

              const Icon = value.icon;

              return (
                <div
                  key={value.number}
                  className="group relative rounded-3xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"
                >

                  <div className="flex items-center justify-between">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="font-mono text-xs font-bold text-muted-foreground/40">
                      {value.number}
                    </span>

                  </div>

                  <h3 className="mt-6 font-heading text-xl font-bold">
                    {t(`values.items.${value.title}`)}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {t(`values.items.${value.description}`)}
                  </p>

                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* =========================================================
          CAPABILITIES
      ========================================================= */}
      <section className="border-y border-border bg-secondary/20 py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">

            <div className="lg:col-span-5">

              <div className="inline-flex items-center gap-2">

                <span className="h-px w-8 bg-primary" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  {t("capabilities.label")}
                </span>

              </div>

              <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                {t("capabilities.title")}
              </h2>

              <p className="mt-4 text-base text-muted-foreground">
                {t("capabilities.description")}
              </p>

              <div className="mt-8">

                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-semibold shadow-sm transition-all hover:bg-accent hover:text-accent-foreground"
                >
                  {t("capabilities.catalogue")}

                  <ArrowRight className="h-4 w-4" />
                </Link>

              </div>

            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">

              {capabilities.map((item, index) => {

                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border bg-background p-6 shadow-sm"
                  >

                    <div className="flex items-center justify-between">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>

                      <span className="font-mono text-xs font-semibold text-muted-foreground">
                        0{index + 1}
                      </span>

                    </div>

                    <h3 className="mt-5 font-heading text-lg font-bold">
                      {t(`capabilities.items.${item.title}`)}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {t(`capabilities.items.${item.description}`)}
                    </p>

                  </div>
                );
              })}

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PRODUCT RANGES
      ========================================================= */}
      <section className="py-24 sm:py-32">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="inline-flex items-center gap-2">

                <span className="h-px w-8 bg-primary" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  {t("ranges.label")}
                </span>

              </div>

              <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                {t("ranges.title")}
              </h2>

            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              {t("ranges.exploreAll")}

              <ArrowUpRight className="h-4 w-4" />
            </Link>

          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">

            {ranges.map((range, index) => (

              <div
                key={range.title}
                className="group overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-lg"
              >

                <div className="flex items-start justify-between border-b border-border pb-6">

                  <div>

                    <span className="text-xs font-bold uppercase tracking-widest text-primary">
                      {t("ranges.catalogTier")}
                    </span>

                    <h3 className="mt-1 font-heading text-2xl font-bold">
                      {t(`ranges.items.${range.title}`)}
                    </h3>

                  </div>

                  <span className="font-heading text-5xl font-bold text-muted-foreground/10">
                    {range.size}
                  </span>

                </div>

                <div className="pt-6">

                  <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("ranges.featuredModels")}
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {range.models.map((model) => (

                      <span
                        key={model}
                        className="rounded-xl border border-border bg-secondary/50 px-3.5 py-1.5 text-xs font-medium"
                      >
                        {model}
                      </span>

                    ))}

                  </div>

                  <Link
                    href={`/products?range=${
                      index === 0 ? "48-inch" : "24-inch"
                    }`}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-transform group-hover:translate-x-1"
                  >
                    {t("ranges.exploreRange")}

                    <ArrowRight className="h-4 w-4" />
                  </Link>

                </div>
              </div>

            ))}

          </div>
        </div>
      </section>

      {/* =========================================================
          APPLICATIONS
      ========================================================= */}
      <section className="border-t border-border bg-secondary/20 py-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid items-center gap-12 lg:grid-cols-12">

            <div className="lg:col-span-4">

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                {t("applications.label")}
              </span>

              <h2 className="mt-3 font-heading text-3xl font-bold">
                {t("applications.title")}
              </h2>

            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:col-span-8">

              {applications.map((app, index) => (

                <div
                  key={app}
                  className="rounded-2xl border border-border bg-background p-6 shadow-sm"
                >

                  <span className="font-mono text-xs font-bold text-primary">
                    0{index + 1}
                  </span>

                  <h3 className="mt-6 font-heading text-base font-bold">
                    {t(`applications.items.${app}`)}
                  </h3>

                </div>

              ))}

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}
      <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground sm:py-28">

        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 sm:text-left lg:px-8">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-2xl">

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/70">
                {t("cta.label")}
              </span>

              <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                {t("cta.title")}
              </h2>

              <p className="mt-4 text-base text-primary-foreground/80 sm:text-lg">
                {t("cta.description")}
              </p>

            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">

              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-background px-6 py-3.5 text-sm font-semibold text-foreground shadow-lg transition-transform hover:-translate-y-0.5"
              >
                {t("cta.exploreProducts")}

                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-foreground/30 px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />

                {t("cta.contact")}
              </Link>

            </div>

          </div>
        </div>
      </section>

    </main>
  );
}