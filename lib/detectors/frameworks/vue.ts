import { addOrUpdateDetection } from ".."
import type { AnalysisContext, DetectionMap } from ".."

export function detectVue(context: AnalysisContext, detections: DetectionMap): void {
  const { html, jsContents } = context

  // Vue.js detection in HTML - look for Vue specific attributes
  if (
    html.match(/v-[a-z]+/i) ||
    html.match(/v-on:/i) ||
    html.match(/v-bind:/i) ||
    html.includes("vue.js") ||
    html.includes("vue.min.js") ||
    html.match(/<[a-z]+ @[a-z]+=/i) || // Vue event shorthand
    html.match(/<[a-z]+ :[a-z]+=/i)
  ) {
    // Vue binding shorthand
    addOrUpdateDetection(
      detections,
      "Vue.js",
      "Frontend Frameworks",
      {
        name: "Vue.js",
        icon: "https://vuejs.org/images/logo.png",
      },
      80, // High confidence for Vue specific attributes
    )
  }

  // Vue.js detection in JS - look for Vue specific code patterns
  for (const jsContent of jsContents) {
    if (
      jsContent.match(/new\s+Vue\s*\(/i) ||
      jsContent.match(/Vue\s*\.\s*createApp\s*\(/i) ||
      jsContent.match(/import\s+Vue\s+from\s+['"]vue['"]/i) ||
      jsContent.match(/import\s+\{\s*[^}]*createApp[^}]*\}\s+from\s+['"]vue['"]/i) ||
      jsContent.match(/require\s*$$\s*['"]vue['"]\s*$$/i) ||
      jsContent.match(/Vue\s*\.\s*component\s*\(/i) ||
      jsContent.match(/export\s+default\s+\{\s*[^}]*data\s*$$\s*$$\s*\{/i)
    ) {
      addOrUpdateDetection(
        detections,
        "Vue.js",
        "Frontend Frameworks",
        {
          name: "Vue.js",
          icon: "https://vuejs.org/images/logo.png",
        },
        90, // Very high confidence for Vue specific code
      )
    }
  }
}
