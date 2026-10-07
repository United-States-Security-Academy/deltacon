import Image from "next/image";
import type { ReactNode } from "react";

import type { TrainingAcademy } from "@/config/training-courses";
import { cn } from "@/lib/utils";

type TrainingAcademySectionProps = {
  academy: TrainingAcademy;
  /** Places the photo on the left instead of the right. */
  imageOnLeft?: boolean;
  className?: string;
  children: ReactNode;
};

/** One academy's introduction and photo, followed by its courses. */
export function TrainingAcademySection({
  academy,
  imageOnLeft = false,
  className,
  children,
}: TrainingAcademySectionProps) {
  const headingId = `${academy.id}-heading`;

  return (
    <section
      id={academy.id}
      aria-labelledby={headingId}
      className={cn("scroll-mt-24 section-spacing", className)}
    >
      <div className="page-container flex flex-col gap-12">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div
            data-reveal={imageOnLeft ? "right" : "left"}
            className={cn("flex flex-col gap-5", imageOnLeft && "lg:order-2")}
          >
            <p className="font-heading text-sm font-semibold tracking-[0.3em] text-gold-700 uppercase">
              {academy.tagline}
            </p>
            <h2
              id={headingId}
              className="text-3xl font-bold text-navy-900 uppercase sm:text-4xl"
            >
              {academy.name}
              {academy.shortName !== academy.name &&
                academy.shortName.length <= 5 && (
                  <span className="text-gold-600"> ({academy.shortName})</span>
                )}
            </h2>
            {academy.introduction.map((paragraph) => (
              <p
                key={paragraph}
                className="text-lg leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div
            data-reveal={imageOnLeft ? "left" : "right"}
            className="overflow-hidden rounded-lg shadow-lg"
          >
            <Image
              src={academy.image}
              alt={academy.imageAltText}
              placeholder="blur"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-auto w-full"
            />
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}
