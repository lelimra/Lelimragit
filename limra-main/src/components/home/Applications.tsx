import {
  ArrowUpRight,
  Building2,
  Home,
  Store,
  Warehouse,
} from "lucide-react";

const applications = [
  {
    title: "Homes",
    description:
      "Comfort-focused ceiling fan solutions for bedrooms, living rooms and everyday residential spaces.",
    icon: Home,
  },
  {
    title: "Commercial Spaces",
    description:
      "Practical airflow solutions for offices, shops and customer-facing environments.",
    icon: Store,
  },
  {
    title: "Workspaces",
    description:
      "Ceiling fans designed to complement functional spaces where comfortable airflow matters.",
    icon: Building2,
  },
  {
    title: "Large Spaces",
    description:
      "Explore suitable models for larger areas where effective air circulation is required.",
    icon: Warehouse,
  },
];

export default function Applications() {
  return (
    <section className="bg-background py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-primary" />

              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Applications
              </p>
            </div>

            <h2 className="mt-4 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-4xl">
              Made for the spaces
              <span className="block text-primary">
                people live and work in.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            From everyday residential environments to commercial spaces,
            choose a model according to your room size, design preference and
            airflow requirements.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {applications.map((application) => {
            const Icon = application.icon;

            return (
              <div
                key={application.title}
                className="group rounded-xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
                </div>

                <h3 className="mt-8 font-heading text-xl font-semibold text-foreground">
                  {application.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {application.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}