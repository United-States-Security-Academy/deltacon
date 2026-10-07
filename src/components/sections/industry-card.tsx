import { ImageLinkCard } from "@/components/sections/image-link-card";
import type { Industry } from "@/config/industries";

export function IndustryCard({ industry }: { industry: Industry }) {
  return (
    <ImageLinkCard
      href={`/industries/${industry.slug}`}
      title={industry.name}
      summary={industry.summary}
      icon={industry.icon}
      image={industry.image}
    />
  );
}
