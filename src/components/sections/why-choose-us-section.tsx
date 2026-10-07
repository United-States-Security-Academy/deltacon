import { SectionHeading } from "@/components/sections/section-heading";
import { reasonsToChooseUs } from "@/config/about-content";

export function WhyChooseUsSection() {
  return (
    <section
      aria-labelledby="why-choose-us-heading"
      className="bg-navy-900 section-spacing text-white"
    >
      <div className="page-container flex flex-col gap-12">
        <SectionHeading
          id="why-choose-us-heading"
          eyebrow="Why Deltacon"
          title="Security you can count on"
          description="Clients choose us because we show up, we communicate, and we take responsibility for the safety of everything in our care."
          tone="dark"
        />

        <ul
          data-reveal-stagger
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {reasonsToChooseUs.map((reason) => {
            const Icon = reason.icon;
            return (
              <li
                key={reason.title}
                className="flex flex-col gap-3 rounded-lg border border-navy-700 bg-navy-800/60 p-6"
              >
                <Icon aria-hidden="true" className="size-8 text-gold-400" />
                <h3 className="text-lg font-bold uppercase">{reason.title}</h3>
                <p className="text-navy-100">{reason.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
