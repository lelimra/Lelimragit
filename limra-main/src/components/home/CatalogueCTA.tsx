import Link from "next/link";
import {
  ArrowUpRight,
  MessageCircle,
  MoveUpRight,
  Sparkles,
} from "lucide-react";

export default function CatalogueCTA() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-primary">
      {/* Background details */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-primary-foreground/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-container px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-end lg:gap-20">
          {/* Content */}
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3.5 py-2 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />

              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/80">
                Let's Connect
              </span>
            </div>

            <h2 className="font-heading text-4xl font-bold leading-[1.05] tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl xl:text-6xl">
              Find the right
              <span className="block text-primary-foreground/60">
                airflow for
              </span>
              your space.
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-primary-foreground/70 sm:text-lg sm:leading-8">
              Explore the Lemra Industries collection or speak with our team
              about models, finishes, applications and product availability.
            </p>

            {/* Small credibility row */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium uppercase tracking-[0.12em] text-primary-foreground/50">
              <span>Premium Collection</span>

              <span className="h-1 w-1 rounded-full bg-primary-foreground/40" />

              <span>48&quot; &amp; 24&quot; Range</span>

              <span className="h-1 w-1 rounded-full bg-primary-foreground/40" />

              <span>Lemra Industries</span>
            </div>
          </div>

          {/* Action panel */}
          <div className="lg:justify-self-end lg:w-full lg:max-w-md">
            <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/[0.06] p-2 shadow-2xl backdrop-blur-md">
              {/* Catalogue */}
              <Link
                href="/catalog"
                className="group relative flex items-center justify-between overflow-hidden rounded-xl bg-background p-5 text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card sm:p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <MoveUpRight className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">Explore Catalogue</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Browse our complete product range
                    </p>
                  </div>
                </div>

                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                className="group mt-2 flex items-center justify-between rounded-xl border border-primary-foreground/15 px-5 py-5 text-primary-foreground transition-all duration-300 hover:bg-primary-foreground/10 sm:px-6"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary-foreground/20 bg-primary-foreground/10">
                    <MessageCircle className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">Talk to Our Team</p>

                    <p className="mt-1 text-xs text-primary-foreground/50">
                      Discuss your product requirements
                    </p>
                  </div>
                </div>

                <ArrowUpRight className="h-5 w-5 text-primary-foreground/50 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary-foreground" />
              </Link>
            </div>

            {/* Bottom microcopy */}
            <p className="mt-4 text-center text-xs text-primary-foreground/40">
              Product enquiries · Catalogue requests · Business enquiries
            </p>
          </div>
        </div>

        {/* Large decorative typography */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-8 right-4 hidden select-none font-heading text-[8rem] font-bold leading-none tracking-[-0.08em] text-primary-foreground/[0.035] xl:block"
        >
          LEMRA
        </div>
      </div>
    </section>
  );
}