import { ldJson } from "@/lib/seo";

/** Structured data for search and answer engines (server-rendered). */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(data) }} />;
}
