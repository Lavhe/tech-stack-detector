import { addOrUpdateDetection } from ".."
import type { AnalysisContext, DetectionMap } from ".."

export function detectGoogleAnalytics(context: AnalysisContext, detections: DetectionMap): void {
  const { html, jsContents } = context

  // Google Analytics detection in HTML
  if (
    html.includes("google-analytics.com/analytics.js") ||
    html.includes("gtag('config'") ||
    html.includes('gtag("config"') ||
    html.includes("ga('create'") ||
    html.includes('ga("create"')
  ) {
    addOrUpdateDetection(
      detections,
      "Google Analytics",
      "Analytics",
      {
        name: "Google Analytics",
        icon: "https://www.google.com/analytics/images/ga_icon.png",
      },
      90, // Very high confidence for GA specific code
    )
  }

  // Google Analytics detection in JS
  for (const jsContent of jsContents) {
    if (
      jsContent.includes("google-analytics.com") ||
      jsContent.match(/gtag\s*\(\s*['"]config['"]/i) ||
      jsContent.match(/ga\s*\(\s*['"]create['"]/i)
    ) {
      addOrUpdateDetection(
        detections,
        "Google Analytics",
        "Analytics",
        {
          name: "Google Analytics",
          icon: "https://www.google.com/analytics/images/ga_icon.png",
        },
        90, // Very high confidence for GA specific code
      )
    }
  }
}
