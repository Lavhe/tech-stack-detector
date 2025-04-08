import { detectReact } from "./react"
import { detectNextJs } from "./nextjs"
import { detectAngular } from "./angular"
import { detectVue } from "./vue"
import { detectSvelte } from "./svelte"
import type { AnalysisContext, DetectionMap } from ".."

export function detectFrameworks(context: AnalysisContext, detections: DetectionMap): void {
  detectReact(context, detections)
  detectNextJs(context, detections)
  detectAngular(context, detections)
  detectVue(context, detections)
  detectSvelte(context, detections)
}
