import { addOrUpdateDetection } from ".."
import type { AnalysisContext, DetectionMap } from ".."

export function detectVercel(context: AnalysisContext, detections: DetectionMap): void {
  const { headers } = context

  if (headers["x-vercel-cache"] || headers["x-vercel-id"]) {
    addOrUpdateDetection(
      detections,
      "Vercel",
      "Other",
      {
        name: "Vercel",
        icon: "https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png",
      },
      100, // Definitive confidence for Vercel header
    )
  }
}
