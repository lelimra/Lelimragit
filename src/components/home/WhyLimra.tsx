import {
  BadgeCheck,
  Gauge,
  Settings2,
  Wind,
} from "lucide-react";

const features = [
  {
    number: "01",
    icon: Settings2,
    title: "Thoughtful Engineering",
    description:
      "Every model is developed with attention to airflow, proportions, finish and everyday usability.",
  },
  {
    number: "02",
    icon: Wind,
    title: "Airflow Focused",
    description:
      "Our range is designed around delivering comfortable and effective air circulation across different spaces.",
  },
  {
    number: "03",
    icon: Gauge,
    title: "Performance Driven",
    description:
      "Product specifications and construction are considered to provide dependable performance for everyday use.",
  },
  {
    number: "04",
    icon: BadgeCheck,
    title: "Quality Focused",
    description:
      "We focus on consistent product presentation, finish and manufacturing quality across our range.",
  },
];

export default function WhyLimra() {
  return (
    <section className="border-t border-border bg-secondary/30 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />

            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Why Limra
            </p>
          </div>

          <h2 className="mt-4 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built around performance,
            <span className="block text-primary">
              designed around people.
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            We combine practical engineering with contemporary design to
            create ceiling fans suited to modern residential and commercial
            environments.
          </p>
        </div>

        {/* Features */}
        <div className="mt-12 grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.number}
                className="group border-b border-r border-border bg-background p-6 transition-colors duration-300 hover:bg-card sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-[0.15em] text-muted-foreground">
                    {feature.number}
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-primary transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <h3 className="mt-8 font-heading text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}