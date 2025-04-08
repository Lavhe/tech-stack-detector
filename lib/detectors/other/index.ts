import { detectVercel } from "./vercel"
import { detectShopify } from "./shopify"
import { detectWix } from "./wix"
import type { AnalysisContext, DetectionMap } from ".."

export function detectOtherTech(context: AnalysisContext, detections: DetectionMap): void {
  detectVercel(context, detections)
  detectShopify(context, detections)
  detectWix(context, detections)
  // Add more detectors as needed
}
