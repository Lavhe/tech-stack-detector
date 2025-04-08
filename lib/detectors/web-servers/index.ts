import { detectWebServer } from "./web-server"
import type { AnalysisContext, DetectionMap } from ".."

export function detectWebServers(context: AnalysisContext, detections: DetectionMap): void {
  detectWebServer(context, detections)
}
