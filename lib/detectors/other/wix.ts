import { addOrUpdateDetection } from ".."
import type { AnalysisContext, DetectionMap } from ".."

export function detectWix(context: AnalysisContext, detections: DetectionMap): void {
  const { html, headers } = context

  if (headers["x-wix-request-id"]) {
    addOrUpdateDetection(
      detections,
      "Wix",
      "CMS",
      {
        name: "Wix",
        icon: "https://www.wix.com/favicon.ico",
      },
      100, // Definitive confidence for Wix header
    )
  }

  if (html.includes("static.wixstatic.com") || html.includes("wix.com/") || html.includes("wix-code")) {
    addOrUpdateDetection(
      detections,
      "Wix",
      "CMS",
      {
        name: "Wix",
        icon: "https://www.wix.com/favicon.ico",
      },
      90, // High confidence for Wix assets
    )
  }
}
