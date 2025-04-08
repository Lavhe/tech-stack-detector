import { detectJQuery } from "./jquery"
import type { AnalysisContext, DetectionMap } from ".."

export function detectJsLibraries(context: AnalysisContext, detections: DetectionMap): void {
  detectJQuery(context, detections)
  // Add more JS library detectors as needed
}
