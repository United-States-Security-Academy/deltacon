import { ImageLinkCard } from "@/components/sections/image-link-card";
import type { Service } from "@/config/services";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <ImageLinkCard
      href={`/services/${service.slug}`}
      title={service.name}
      eyebrow={service.credential}
      summary={service.summary}
      icon={service.icon}
      image={service.image}
    />
  );
}
