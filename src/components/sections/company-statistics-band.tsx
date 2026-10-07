import { AnimatedNumber } from "@/components/sections/animated-number";
import { companyStatistics } from "@/config/about-content";
import { cn } from "@/lib/utils";

/**
 * Large key figures separated by thin dividers, e.g. "13 Industries Served".
 * Edit the figures in config/about-content.ts.
 *
 * The figures use gold-600, which meets WCAG AA contrast for large text on
 * white; the labels use the normal body text colour.
 */
export function CompanyStatisticsBand({ className }: { className?: string }) {
  return (
    <section
      aria-labelledby="company-statistics-heading"
      className={cn("bg-white py-14 lg:py-20", className)}
    >
      <div className="page-container">
        <h2 id="company-statistics-heading" className="sr-only">
          Deltacon at a glance
        </h2>
        <dl
          data-reveal-stagger
          className="grid grid-cols-1 gap-y-10 sm:grid-cols-3"
        >
          {companyStatistics.map((statistic) => (
            <div
              key={statistic.label}
              className="flex flex-col-reverse gap-3 border-l border-border px-5 sm:px-8"
            >
              <dt className="text-base text-charcoal sm:text-lg lg:text-xl">
                {statistic.label}
              </dt>
              <dd className="text-6xl leading-none font-extralight tracking-tight text-gold-600 sm:text-7xl xl:text-8xl">
                <AnimatedNumber value={statistic.value} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
