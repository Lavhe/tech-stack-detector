import { addOrUpdateDetection } from ".."
import type { AnalysisContext, DetectionMap } from ".."

export function detectMySQL(context: AnalysisContext, detections: DetectionMap): void {
  const { jsContents } = context

  for (const jsContent of jsContents) {
    if (
      jsContent.match(/import\s+\{\s*[^}]*\}\s+from\s+['"]mysql['"]/i) ||
      jsContent.match(/require\s*$$\s*['"]mysql['"]\s*$$/i) ||
      (jsContent.match(/createConnection\s*\(/i) && jsContent.includes("mysql")) ||
      jsContent.includes("mysql://")
    ) {
      addOrUpdateDetection(
        detections,
        "MySQL",
        "Database & Storage",
        {
          name: "MySQL",
          icon: "https://labs.mysql.com/common/logos/mysql-logo.svg",
        },
        80, // High confidence for MySQL specific code
      )
    }
  }
}
