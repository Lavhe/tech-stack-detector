import { addOrUpdateDetection } from ".."
import type { AnalysisContext, DetectionMap } from ".."

export function detectReact(context: AnalysisContext, detections: DetectionMap): void {
  const { html, jsContents } = context

  // React detection in HTML - look for specific React patterns
  if (
    html.includes("react-root") ||
    html.includes("ReactDOM.render") ||
    html.includes("_reactRootContainer") ||
    html.match(/<[a-z]+ data-reactid/i) ||
    (html.match(/<div id=["']root["']><\/div>/) && html.includes("react"))
  ) {
    addOrUpdateDetection(
      detections,
      "React",
      "Frontend Frameworks",
      {
        name: "React",
        icon: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
      },
      70, // High confidence for specific React DOM patterns
    )
  } else if (html.includes("react.js") || html.includes("react.min.js") || html.includes("react-dom")) {
    // Less specific React patterns
    addOrUpdateDetection(
      detections,
      "React",
      "Frontend Frameworks",
      {
        name: "React",
        icon: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
      },
      50, // Medium confidence for React script inclusion
    )
  }

  // React detection in JS - look for React specific code patterns
  for (const jsContent of jsContents) {
    if (
      jsContent.match(/React\s*\.\s*createElement/i) ||
      jsContent.match(/ReactDOM\s*\.\s*render/i) ||
      jsContent.match(/import\s+React\s+from\s+['"]react['"]/i) ||
      jsContent.match(/import\s+\{\s*[^}]*Component[^}]*\}\s+from\s+['"]react['"]/i) ||
      jsContent.match(/require\s*$$\s*['"]react['"]\s*$$/i) ||
      jsContent.match(/window\s*\.\s*React/i) ||
      jsContent.match(/React\s*\.\s*Component/i)
    ) {
      addOrUpdateDetection(
        detections,
        "React",
        "Frontend Frameworks",
        {
          name: "React",
          icon: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
        },
        90, // Very high confidence for React specific code
      )
    }
  }
}
