import { detectWordPress } from "./wordpress"
import type { AnalysisContext, DetectionMap } from ".."

export function detectCms(context: AnalysisContext, detections: DetectionMap): void {
  detectWordPress(context, detections)
  // Add more CMS detectors as needed
}
