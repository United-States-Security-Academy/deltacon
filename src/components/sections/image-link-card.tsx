import { ArrowRight, type LucideIcon } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

type ImageLinkCardProps = {
  href: string;
  title: string;
  /** Small label above the title, e.g. a licence level. */
  eyebrow?: string;
  summary: string;
  icon: LucideIcon;
  /** Without an image, the icon is shown large on a navy background. */
  image?: StaticImageData;
};

/**
 * Card with a photo, title and summary, used for services and industries.
 * The whole card is one link; the heading gives it its accessible name.
 */
export function ImageLinkCard({
  href,
  title,
  eyebrow,
  summary,
  icon: Icon,
  image,
}: ImageLinkCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-[box-shadow,translate,border-color] duration-300 hover:-translate-y-1 hover:border-gold-500 hover:shadow-md"
    >
      <div className="hover-shine relative aspect-[16/9] overflow-hidden bg-navy-900">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full items-center justify-center security-pattern">
            <Icon aria-hidden="true" className="size-16 text-gold-400" />
          </div>
        )}
        <span className="absolute bottom-3 left-3 flex size-11 items-center justify-center rounded-md bg-navy-900/90 text-gold-400 shadow-md">
          <Icon aria-hidden="true" className="size-5" />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        {eyebrow && (
          <p className="text-xs font-semibold tracking-widest text-gold-700 uppercase">
            {eyebrow}
          </p>
        )}
        <h3 className="text-xl font-bold text-navy-900 uppercase">{title}</h3>
        <p className="flex-1 leading-relaxed text-muted-foreground">
          {summary}
        </p>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-gold-700">
          Learn more
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}
