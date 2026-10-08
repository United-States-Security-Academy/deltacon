import { serializeStructuredData } from "@/lib/seo/structured-data";

/** Adds schema.org structured data (JSON-LD) to the page for search engines. */
export function StructuredDataScript({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeStructuredData(data) }}
    />
  );
}
