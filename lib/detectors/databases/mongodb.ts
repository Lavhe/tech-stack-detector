import { addOrUpdateDetection } from ".."
import type { AnalysisContext, DetectionMap } from ".."

export function detectMongoDB(context: AnalysisContext, detections: DetectionMap): void {
  const { jsContents } = context

  for (const jsContent of jsContents) {
    if (
      jsContent.match(/import\s+\{\s*[^}]*\}\s+from\s+['"]mongodb['"]/i) ||
      jsContent.match(/import\s+\{\s*[^}]*\}\s+from\s+['"]mongoose['"]/i) ||
      jsContent.match(/require\s*$$\s*['"]mongodb['"]\s*$$/i) ||
      jsContent.match(/require\s*$$\s*['"]mongoose['"]\s*$$/i) ||
      jsContent.match(/MongoClient/i) ||
      jsContent.match(/mongoose\s*\.\s*connect/i) ||
      jsContent.includes("mongodb://") ||
      jsContent.includes("mongodb+srv://")
    ) {
      addOrUpdateDetection(
        detections,
        "MongoDB",
        "Database & Storage",
        {
          name: "MongoDB",
          icon: "https://www.mongodb.com/assets/images/global/favicon.ico",
        },
        80, // High confidence for MongoDB specific code
      )
    }
  }
}
