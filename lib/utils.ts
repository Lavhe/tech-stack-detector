import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { TechInfo } from "../lib/types"

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

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
