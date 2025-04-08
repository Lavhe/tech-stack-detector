import { addOrUpdateDetection } from ".."
import type { AnalysisContext, DetectionMap } from ".."

export function detectPostgreSQL(context: AnalysisContext, detections: DetectionMap): void {
  const { jsContents } = context

  for (const jsContent of jsContents) {
    if (
      jsContent.match(/import\s+\{\s*[^}]*\}\s+from\s+['"]pg['"]/i) ||
      jsContent.match(/require\s*$$\s*['"]pg['"]\s*$$/i) ||
      (jsContent.match(/new\s+Client\s*\(/i) && jsContent.includes("postgresql")) ||
      (jsContent.match(/Pool\s*\(/i) && jsContent.includes("postgres")) ||
      jsContent.includes("postgresql://") ||
      jsContent.includes("postgres://")
    ) {
      addOrUpdateDetection(
        detections,
        "PostgreSQL",
        "Database & Storage",
        {
          name: "PostgreSQL",
          icon: "https://www.postgresql.org/media/img/about/press/elephant.png",
        },
        80, // High confidence for PostgreSQL specific code
      )
    }
  }
}
