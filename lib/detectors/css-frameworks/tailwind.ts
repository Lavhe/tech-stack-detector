import { addOrUpdateDetection } from ".."
import type { AnalysisContext, DetectionMap } from ".."

export function detectTailwind(context: AnalysisContext, detections: DetectionMap): void {
  const { html, cssContents } = context

  // Tailwind CSS detection in HTML
  if (
    html.match(/class=["'][^"']*(?:flex|grid|px-[0-9]|py-[0-9]|text-[a-z]+-[0-9]+)[^"']*["']/i) ||
    html.includes("tailwind.css") ||
    html.includes("tailwind.min.css")
  ) {
    addOrUpdateDetection(
      detections,
      "Tailwind CSS",
      "CSS Frameworks",
      {
        name: "Tailwind CSS",
        icon: "https://tailwindcss.com/favicons/favicon.ico",
      },
      70, // High confidence for Tailwind specific class patterns
    )
  }

  // Tailwind CSS detection in CSS
  for (const cssContent of cssContents) {
    if (
      cssContent.match(/\.\w+-\w+-\w+\s*\{/g) || // Utility classes like .bg-blue-500
      cssContent.includes("@tailwind") ||
      cssContent.includes("tailwindcss")
    ) {
      addOrUpdateDetection(
        detections,
        "Tailwind CSS",
        "CSS Frameworks",
        {
          name: "Tailwind CSS",
          icon: "https://tailwindcss.com/favicons/favicon.ico",
        },
        80, // High confidence for Tailwind specific patterns
      )
    }
  }
}
