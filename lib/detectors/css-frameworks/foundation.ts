import { addOrUpdateDetection } from ".."
import type { AnalysisContext, DetectionMap } from ".."

export function detectFoundation(context: AnalysisContext, detections: DetectionMap): void {
  const { html, cssContents } = context

  // Foundation detection in HTML
  if (
    html.match(/class=["'][^"']*(?:button|callout|small-[0-9]+|medium-[0-9]+)[^"']*["']/i) ||
    html.includes("foundation.css") ||
    html.includes("foundation.min.css")
  ) {
    addOrUpdateDetection(
      detections,
      "Foundation",
      "CSS Frameworks",
      {
        name: "Foundation",
        icon: "https://get.foundation/assets/img/icons/favicon.ico",
      },
      80, // High confidence for Foundation specific class patterns
    )
  }

  // Foundation detection in CSS
  for (const cssContent of cssContents) {
    if (
      (cssContent.includes(".button.primary") && cssContent.includes(".callout")) ||
      cssContent.includes("foundation.css") ||
      cssContent.includes("foundation.min.css")
    ) {
      addOrUpdateDetection(
        detections,
        "Foundation",
        "CSS Frameworks",
        {
          name: "Foundation",
          icon: "https://get.foundation/assets/img/icons/favicon.ico",
        },
        80, // High confidence for Foundation specific patterns
      )
    }
  }
}
