import { detectTailwind } from "./tailwind"
import { detectBootstrap } from "./bootstrap"
import { detectBulma } from "./bulma"
import { detectFoundation } from "./foundation"
import { detectMaterialize } from "./materialize"
import type { AnalysisContext, DetectionMap } from ".."

export function detectCssFrameworks(context: AnalysisContext, detections: DetectionMap): void {
  detectTailwind(context, detections)
  detectBootstrap(context, detections)
  detectBulma(context, detections)
  detectFoundation(context, detections)
  detectMaterialize(context, detections)
}
