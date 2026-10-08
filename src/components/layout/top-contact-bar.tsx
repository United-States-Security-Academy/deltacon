import { MailIcon, PhoneIcon } from "lucide-react";

type TopContactBarProps = {
  email: string;
  phoneDisplay: string;
  phoneInternational: string;
};

/**
 * Thin strip above the main navigation. This is the only place in the header
 * where the company email and phone number appear.
 */
export function TopContactBar({
  email,
  phoneDisplay,
  phoneInternational,
}: TopContactBarProps) {
  return (
    <div className="border-b border-white/5 bg-navy-975 text-sm text-navy-200">
      <div className="page-container flex h-10 items-center justify-center gap-6 sm:justify-end">
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-2 transition-colors hover:text-gold-300"
        >
          <MailIcon aria-hidden="true" className="size-4 text-gold-500" />
          <span className="sr-only">Email us at </span>
          {email}
        </a>
        <a
          href={`tel:${phoneInternational}`}
          className="inline-flex items-center gap-2 transition-colors hover:text-gold-300"
        >
          <PhoneIcon aria-hidden="true" className="size-4 text-gold-500" />
          <span className="sr-only">Call us on </span>
          {phoneDisplay}
        </a>
      </div>
    </div>
  );
}
