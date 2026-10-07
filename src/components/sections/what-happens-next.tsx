type WhatHappensNextProps = {
  heading?: string;
  steps: { title: string; description: string }[];
};

/** Numbered sidebar explaining what happens after a form is sent. */
export function WhatHappensNext({
  heading = "What happens next",
  steps,
}: WhatHappensNextProps) {
  return (
    <aside
      data-reveal="right"
      aria-labelledby="what-happens-next-heading"
      className="flex flex-col gap-6 rounded-lg bg-navy-900 security-pattern p-6 text-white lg:p-8"
    >
      <h2
        id="what-happens-next-heading"
        className="text-2xl font-bold uppercase"
      >
        {heading}
      </h2>
      <ol data-reveal-stagger className="flex flex-col gap-5">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold-500 font-heading text-lg font-bold text-navy-950"
            >
              {index + 1}
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold uppercase">{step.title}</h3>
              <p className="text-sm text-navy-100">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
