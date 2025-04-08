import { addOrUpdateDetection } from ".."
import type { AnalysisContext, DetectionMap } from ".."

export function detectWordPress(context: AnalysisContext, detections: DetectionMap): void {
  const { html, headers } = context

  // WordPress detection in HTML
  if (
    html.includes("wp-content") ||
    html.includes("wp-includes") ||
    html.match(/wp-[a-z]+-[0-9]+\.js/i) ||
    html.includes("wp-embed") ||
    html.includes("wp-emoji")
  ) {
    addOrUpdateDetection(
      detections,
      "WordPress",
      "CMS",
      {
        name: "WordPress",
        icon: "https://s.w.org/style/images/about/WordPress-logotype-standard.png",
      },
      90, // Very high confidence for WordPress specific paths
    )
  }

  // Check for WordPress specific headers
  if (headers["x-wordpress-cache"]) {
    addOrUpdateDetection(
      detections,
      "WordPress",
      "CMS",
      {
        name: "WordPress",
        icon: "https://s.w.org/style/images/about/WordPress-logotype-standard.png",
      },
      100, // Definitive confidence for WordPress header
    )
  }
}
