import { addOrUpdateDetection } from ".."
import type { AnalysisContext, DetectionMap } from ".."

export function detectNextJs(context: AnalysisContext, detections: DetectionMap): void {
  const { html, jsContents, headers } = context

  // Next.js detection in HTML - look for Next.js specific patterns
  if (
    html.includes("__NEXT_DATA__") ||
    html.includes("next/dist/") ||
    html.includes("/_next/static/") ||
    html.match(/<script [^>]*id=["']__NEXT_DATA__["'][^>]*>/i)
  ) {
    addOrUpdateDetection(
      detections,
      "Next.js",
      "Frontend Frameworks",
      {
        name: "Next.js",
        icon: "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png",
      },
      90, // Very high confidence for Next.js specific markers
    )
  }

  // Next.js detection in JS - look for Next.js specific code patterns
  for (const jsContent of jsContents) {
    if (
      jsContent.match(/import\s+.*\s+from\s+['"]next\//i) ||
      jsContent.match(/require\s*\(\s*['"]next\//i) ||
      jsContent.match(/import\s+\{\s*[^}]*useRouter[^}]*\}\s+from\s+['"]next\/router['"]/i) ||
      jsContent.match(/import\s+\{\s*[^}]*Head[^}]*\}\s+from\s+['"]next\/head['"]/i) ||
      jsContent.match(/import\s+\{\s*[^}]*Link[^}]*\}\s+from\s+['"]next\/link['"]/i) ||
      jsContent.match(/import\s+\{\s*[^}]*Image[^}]*\}\s+from\s+['"]next\/image['"]/i) ||
      jsContent.match(/__NEXT_DATA__/i)
    ) {
      addOrUpdateDetection(
        detections,
        "Next.js",
        "Frontend Frameworks",
        {
          name: "Next.js",
          icon: "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png",
        },
        90, // Very high confidence for Next.js specific code
      )
    }
  }

  // Check for Next.js specific headers
  if (headers["x-nextjs-cache"]) {
    addOrUpdateDetection(
      detections,
      "Next.js",
      "Frontend Frameworks",
      {
        name: "Next.js",
        icon: "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png",
      },
      100, // Definitive confidence for Next.js header
    )
  }
}
