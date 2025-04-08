import { addOrUpdateDetection } from ".."
import type { AnalysisContext, DetectionMap } from ".."

export function detectWebServer(context: AnalysisContext, detections: DetectionMap): void {
  const { headers } = context

  // Web Servers
  if (headers["server"]) {
    addOrUpdateDetection(
      detections,
      headers["server"],
      "Web Servers",
      {
        name: headers["server"],
      },
      90, // Very high confidence for server header
    )
  }

  if (headers["x-powered-by"]) {
    const poweredBy = headers["x-powered-by"]
    if (poweredBy.includes("PHP")) {
      addOrUpdateDetection(
        detections,
        "PHP",
        "Backend & APIs",
        {
          name: "PHP",
          version: poweredBy.split("/")[1],
          icon: "https://www.php.net/favicon.svg",
        },
        90, // Very high confidence for x-powered-by header
      )
    } else {
      addOrUpdateDetection(
        detections,
        poweredBy,
        "Backend & APIs",
        {
          name: poweredBy,
        },
        90, // Very high confidence for x-powered-by header
      )
    }
  }
}
