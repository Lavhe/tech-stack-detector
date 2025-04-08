import { addOrUpdateDetection } from ".."
import type { AnalysisContext, DetectionMap } from ".."

export function detectJQuery(context: AnalysisContext, detections: DetectionMap): void {
  const { html, jsContents } = context

  // jQuery detection in HTML
  if (html.includes("jquery.js") || html.includes("jquery.min.js") || html.match(/<script [^>]*jquery[^>]*>/i)) {
    addOrUpdateDetection(
      detections,
      "jQuery",
      "JavaScript Libraries",
      {
        name: "jQuery",
        icon: "https://jquery.com/jquery-wp-content/themes/jquery.com/i/favicon.ico",
      },
      80, // High confidence for jQuery script inclusion
    )
  }

  // jQuery detection in JS
  for (const jsContent of jsContents) {
    if (
      jsContent.match(/jQuery\s*\(/i) ||
      (jsContent.match(/\$\s*\(/i) && jsContent.match(/\.ready\s*\(/i)) ||
      jsContent.match(/import\s+\$\s+from\s+['"]jquery['"]/i) ||
      jsContent.match(/import\s+jQuery\s+from\s+['"]jquery['"]/i) ||
      jsContent.match(/require\s*$$\s*['"]jquery['"]\s*$$/i)
    ) {
      addOrUpdateDetection(
        detections,
        "jQuery",
        "JavaScript Libraries",
        {
          name: "jQuery",
          icon: "https://jquery.com/jquery-wp-content/themes/jquery.com/i/favicon.ico",
        },
        90, // Very high confidence for jQuery specific code
      )
    }
  }
}
