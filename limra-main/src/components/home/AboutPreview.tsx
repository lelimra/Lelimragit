import Link from "next/link";
import { ArrowRight, Factory, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function AboutPreview() {
  return (
    <section className="border-t border-border bg-secondary/30 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">

        <div className="grid overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-2">

          {/* Image */}
          <div className="relative aspect-[4/3] bg-secondary lg:aspect-auto lg:min-h-[520px]">
            
           
              <Image
                src="/images/company/factory.png"
                alt="Limra Industries"
                fill
                className="object-cover"
              />
           
          </div>

          {/* Content */}
          <div className="flex items-center p-7 sm:p-10 lg:p-14 xl:p-16">
            <div className="max-w-xl">

              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-primary" />

                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                  About Limra
                </p>
              </div>

              <h2 className="mt-5 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-4xl">
                A focused approach to
                <span className="block text-primary">
                  ceiling fan manufacturing.
                </span>
              </h2>

              <p className="mt-6 text-base leading-7 text-muted-foreground">
                Limra Industries brings together product design, practical
                engineering and a growing range of ceiling fan models for
                modern spaces.
              </p>

              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Our product range includes premium models in different sizes
                and finishes, giving customers flexibility across residential
                and commercial applications.
              </p>

              {/* Highlights */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-background p-4">
                  <Factory className="h-5 w-5 text-primary" />

                  <p className="mt-3 text-sm font-semibold text-foreground">
                    Product Focus
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Dedicated to ceiling fan products and their applications.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-background p-4">
                  <ShieldCheck className="h-5 w-5 text-primary" />

                  <p className="mt-3 text-sm font-semibold text-foreground">
                    Quality Focus
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Attention to product consistency, finish and performance.
                  </p>
                </div>
              </div>

              <Link
                href="/about"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                Learn more about Limra

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}