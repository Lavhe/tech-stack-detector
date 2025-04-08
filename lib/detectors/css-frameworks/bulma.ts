import { addOrUpdateDetection } from ".."
import type { AnalysisContext, DetectionMap } from ".."

export function detectBulma(context: AnalysisContext, detections: DetectionMap): void {
  const { html, cssContents } = context

  // Bulma detection in HTML
  if (
    html.match(/class=["'][^"']*(?:is-primary|is-info|columns)[^"']*["']/i) ||
    html.includes("bulma.css") ||
    html.includes("bulma.min.css")
  ) {
    addOrUpdateDetection(
      detections,
      "Bulma",
      "CSS Frameworks",
      {
        name: "Bulma",
        icon: "https://bulma.io/favicons/favicon-32x32.png",
      },
      80, // High confidence for Bulma specific class patterns
    )
  }

  // Bulma detection in CSS
  for (const cssContent of cssContents) {
    if (
      (cssContent.includes(".is-primary") && cssContent.includes(".is-info")) ||
      (cssContent.includes(".column") && cssContent.includes(".columns")) ||
      cssContent.includes("bulma.css") ||
      cssContent.includes("bulma.min.css")
    ) {
      addOrUpdateDetection(
        detections,
        "Bulma",
        "CSS Frameworks",
        {
          name: "Bulma",
          icon: "https://bulma.io/favicons/favicon-32x32.png",
        },
        80, // High confidence for Bulma specific patterns
      )
    }
  }
}
