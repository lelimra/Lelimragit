import { ArrowUpRight } from "lucide-react";

const items = [
  "LIMRA INDUSTRY",
  "PREMIUM CEILING FANS",
  '48" PREMIUM RANGE',
  '24" PREMIUM RANGE',
  "DESIGNED FOR BETTER AIRFLOW",
  "QUALITY IN EVERY DETAIL",
];

export default function Marquee() {
  return (
    <section
      aria-label="LIMRA Industry highlights"
      className="overflow-hidden border-y border-border bg-background"
    >
      <div className="flex w-max animate-marquee">
        {/* First set */}
        <div className="flex shrink-0 items-center">
          {items.map((item, index) => (
            <div
              key={`first-${item}-${index}`}
              className="flex items-center"
            >
              <span className="px-1 py-1 font-heading text-sm font-semibold uppercase tracking-[0.16em] text-foreground sm:px-8 sm:text-base">
                {item}
              </span>

              <ArrowUpRight
                aria-hidden="true"
                className="h-10 w-4 shrink-0 text-primary"
              />
            </div>
          ))}
        </div>

        {/* Duplicate set for seamless infinite scrolling */}
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {items.map((item, index) => (
            <div
              key={`second-${item}-${index}`}
              className="flex items-center"
            >
              <span className="px-3 py-3 font-heading text-sm font-semibold uppercase tracking-[0.16em] text-foreground sm:px-8 sm:text-base">
                {item}
              </span>

              <ArrowUpRight className="h-4 w-4 shrink-0 text-primary" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}