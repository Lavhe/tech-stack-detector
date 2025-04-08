import { detectFrameworks } from "./frameworks"
import { detectDatabases } from "./databases"
import { detectCssFrameworks } from "./css-frameworks"
import { detectJsLibraries } from "./js-libraries"
import { detectCms } from "./cms"
import { detectAnalytics } from "./analytics"
import { detectWebServers } from "./web-servers"
import { detectOtherTech } from "./other"
import type { TechInfo } from "../types"

export interface DetectionResult {
  tech: TechInfo
  confidence: number
  category: string
}

export type DetectionMap = Record<string, DetectionResult>

export interface AnalysisContext {
  html: string
  headers: Record<string, string>
  jsContents: string[]
  cssContents: string[]
  url: string
}

export async function runAllDetectors(context: AnalysisContext): Promise<DetectionMap> {
  const detections: DetectionMap = {}

  // Run all detectors
  detectFrameworks(context, detections)
  detectDatabases(context, detections)
  detectCssFrameworks(context, detections)
  detectJsLibraries(context, detections)
  detectCms(context, detections)
  detectAnalytics(context, detections)
  detectWebServers(context, detections)
  detectOtherTech(context, detections)

  return detections
}

export function addOrUpdateDetection(
  detections: DetectionMap,
  id: string,
  category: string,
  tech: TechInfo,
  confidence: number,
) {
  // If we already have this detection, update the confidence
  if (detections[id]) {
    detections[id].confidence = Math.min(100, detections[id].confidence + confidence * 0.2)
    return
  }

  // Otherwise add the new detection
  detections[id] = {
    tech,
    confidence,
    category,
  }
}
