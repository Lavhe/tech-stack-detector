import { addOrUpdateDetection } from ".."
import type { AnalysisContext, DetectionMap } from ".."

export function detectMaterialize(context: AnalysisContext, detections: DetectionMap): void {
  const { html, cssContents } = context

  // Materialize detection in HTML
  if (
    html.match(/class=["'][^"']*(?:materialize|waves-effect)[^"']*["']/i) ||
    html.includes("materialize.css") ||
    html.includes("materialize.min.css")
  ) {
    addOrUpdateDetection(
      detections,
      "Materialize CSS",
      "CSS Frameworks",
      {
        name: "Materialize CSS",
        icon: "https://materializecss.com/images/favicon/favicon-32x32.png",
      },
      80, // High confidence for Materialize specific class patterns
    )
  }

  // Materialize detection in CSS
  for (const cssContent of cssContents) {
    if (
      cssContent.includes(".materialize") ||
      cssContent.includes("materialize.css") ||
      cssContent.includes("materialize.min.css")
    ) {
      addOrUpdateDetection(
        detections,
        "Materialize CSS",
        "CSS Frameworks",
        {
          name: "Materialize CSS",
          icon: "https://materializecss.com/images/favicon/favicon-32x32.png",
        },
        80, // High confidence for Materialize specific patterns
      )
    }
  }
}
