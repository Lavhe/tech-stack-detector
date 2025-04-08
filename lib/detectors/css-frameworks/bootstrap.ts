import { addOrUpdateDetection } from ".."
import type { AnalysisContext, DetectionMap } from ".."

export function detectBootstrap(context: AnalysisContext, detections: DetectionMap): void {
  const { html, cssContents } = context

  // Bootstrap detection in HTML
  if (
    html.match(/class=["'][^"']*(?:navbar|container|row|col-[a-z]+-[0-9]+)[^"']*["']/i) ||
    html.includes("bootstrap.css") ||
    html.includes("bootstrap.min.css") ||
    html.includes("bootstrap.bundle.js") ||
    html.includes("bootstrap.bundle.min.js")
  ) {
    addOrUpdateDetection(
      detections,
      "Bootstrap",
      "CSS Frameworks",
      {
        name: "Bootstrap",
        icon: "https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png",
      },
      80, // High confidence for Bootstrap specific class patterns
    )
  }

  // Bootstrap detection in CSS
  for (const cssContent of cssContents) {
    if (
      (cssContent.includes(".navbar") && cssContent.includes(".container")) ||
      (cssContent.includes(".row") && cssContent.includes(".col-")) ||
      cssContent.includes("bootstrap.css") ||
      cssContent.includes("bootstrap.min.css")
    ) {
      addOrUpdateDetection(
        detections,
        "Bootstrap",
        "CSS Frameworks",
        {
          name: "Bootstrap",
          icon: "https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png",
        },
        80, // High confidence for Bootstrap specific patterns
      )
    }
  }
}
