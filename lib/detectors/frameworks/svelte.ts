import { addOrUpdateDetection } from ".."
import type { AnalysisContext, DetectionMap } from ".."

export function detectSvelte(context: AnalysisContext, detections: DetectionMap): void {
  const { html, jsContents } = context

  // Svelte detection in HTML
  if (
    html.includes("svelte-") ||
    html.match(/svelte:.*>/i) ||
    html.includes("svelte.js") ||
    html.includes("svelte.min.js")
  ) {
    addOrUpdateDetection(
      detections,
      "Svelte",
      "Frontend Frameworks",
      {
        name: "Svelte",
        icon: "https://svelte.dev/favicon.png",
      },
      70, // High confidence for Svelte specific markers
    )
  }

  // Svelte detection in JS
  for (const jsContent of jsContents) {
    if (
      jsContent.includes("svelte/internal") ||
      jsContent.match(/import\s+.*\s+from\s+['"]svelte['"]/i) ||
      jsContent.match(/require\s*$$\s*['"]svelte['"]\s*$$/i)
    ) {
      addOrUpdateDetection(
        detections,
        "Svelte",
        "Frontend Frameworks",
        {
          name: "Svelte",
          icon: "https://svelte.dev/favicon.png",
        },
        90, // Very high confidence for Svelte specific code
      )
    }
  }
}
