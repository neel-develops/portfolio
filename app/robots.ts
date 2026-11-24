import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

// Search engines and AI answer engines are all welcome: the portfolio is meant to be found and cited.
const AI_CRAWLERS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-SearchBot", "Claude-User",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot", "Applebot-Extended",
  "Bingbot", "DuckAssistBot", "CCBot", "Meta-ExternalAgent", "Amazonbot", "cohere-ai"
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" }))
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url
  };
}
