import { detectGoogleAnalytics } from "./google-analytics"
import type { AnalysisContext, DetectionMap } from ".."

export function detectAnalytics(context: AnalysisContext, detections: DetectionMap): void {
  detectGoogleAnalytics(context, detections)
  // Add more analytics detectors as needed
}
