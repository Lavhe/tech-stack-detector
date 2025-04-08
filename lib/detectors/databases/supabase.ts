import { addOrUpdateDetection } from ".."
import type { AnalysisContext, DetectionMap } from ".."

export function detectSupabase(context: AnalysisContext, detections: DetectionMap): void {
  const { html, jsContents, headers } = context

  // Supabase detection in HTML - look for Supabase specific patterns
  if (
    html.includes("supabase-js") ||
    html.includes("@supabase/") ||
    html.includes("supabase.co") ||
    (html.includes("createClient") && html.includes("supabase"))
  ) {
    addOrUpdateDetection(
      detections,
      "Supabase",
      "Database & Storage",
      {
        name: "Supabase",
        icon: "https://supabase.com/favicon/favicon-196x196.png",
      },
      70, // High confidence for Supabase script inclusion
    )
  }

  // Supabase detection in JS - look for Supabase specific code patterns
  for (const jsContent of jsContents) {
    const supabaseImportPattern = jsContent.match(/import\s+\{\s*[^}]*\}\s+from\s+['"]@supabase\/[^'"]+['"]/gi)
    const supabaseClientPattern = jsContent.match(/createClient\s*$$\s*['"][^'"]+['"]\s*,\s*['"][^'"]+['"]\s*$$/i)
    const supabaseUrlPattern = jsContent.match(/SUPABASE_URL/i) || jsContent.match(/supabaseUrl/i)
    const supabaseKeyPattern =
      jsContent.match(/SUPABASE_KEY/i) || jsContent.match(/SUPABASE_ANON_KEY/i) || jsContent.match(/supabaseKey/i)

    // Supabase method usage
    const supabaseAuthUsage = jsContent.match(/\.\s*auth\s*\.\s*signIn/i) || jsContent.match(/\.\s*auth\s*\.\s*signUp/i)
    const supabaseStorageUsage = jsContent.match(/\.\s*storage\s*\.\s*from/i)
    const supabaseDatabaseUsage =
      jsContent.match(/\.\s*from\s*$$\s*['"][^'"]+['"]\s*$$/i) || jsContent.match(/\.\s*rpc\s*\(/i)

    // Additional Supabase detection patterns
    const supabaseApiUsage = jsContent.includes("supabase.co") || jsContent.includes("supabase.in")

    if (
      supabaseImportPattern ||
      supabaseClientPattern ||
      (supabaseUrlPattern && supabaseKeyPattern) ||
      supabaseAuthUsage ||
      supabaseStorageUsage ||
      supabaseDatabaseUsage ||
      supabaseApiUsage ||
      jsContent.includes("supabase")
    ) {
      // Try to detect Supabase version
      let supabaseVersion = undefined
      const versionMatch = jsContent.match(/@supabase\/[^@]+@(\d+\.\d+\.\d+)/)
      if (versionMatch) {
        supabaseVersion = versionMatch[1]
      }

      addOrUpdateDetection(
        detections,
        "Supabase",
        "Database & Storage",
        {
          name: "Supabase",
          icon: "https://supabase.com/favicon/favicon-196x196.png",
          version: supabaseVersion,
        },
        70, // Reduced from 90 to 70 to be less strict
      )

      // Detect specific Supabase products
      if (supabaseAuthUsage || jsContent.match(/import\s+\{\s*[^}]*\}\s+from\s+['"]@supabase\/auth-helpers/i)) {
        addOrUpdateDetection(
          detections,
          "Supabase Auth",
          "Backend & APIs",
          {
            name: "Supabase Auth",
            icon: "https://supabase.com/favicon/favicon-196x196.png",
          },
          70,
        )
      }

      if (supabaseStorageUsage || jsContent.includes("storage.from")) {
        addOrUpdateDetection(
          detections,
          "Supabase Storage",
          "Database & Storage",
          {
            name: "Supabase Storage",
            icon: "https://supabase.com/favicon/favicon-196x196.png",
          },
          70,
        )
      }

      if (supabaseDatabaseUsage || jsContent.includes("supabase.from")) {
        addOrUpdateDetection(
          detections,
          "Supabase Database",
          "Database & Storage",
          {
            name: "Supabase Database",
            icon: "https://supabase.com/favicon/favicon-196x196.png",
          },
          70,
        )
      }
    }
  }

  // Check for Supabase specific headers
  if (headers["x-supabase-cache"]) {
    addOrUpdateDetection(
      detections,
      "Supabase",
      "Database & Storage",
      {
        name: "Supabase",
        icon: "https://supabase.com/favicon/favicon-196x196.png",
      },
      100, // Definitive confidence for Supabase header
    )
  }

  // Check for Supabase URLs in all JS content
  const supabaseUrls = [
    "supabase.co",
    "supabase.in",
    "supabase.net",
    "functions.supabase.co",
    "functions.supabase.in",
    "functions.supabase.net",
  ]

  for (const jsContent of jsContents) {
    for (const supabaseUrl of supabaseUrls) {
      if (jsContent.includes(supabaseUrl)) {
        addOrUpdateDetection(
          detections,
          "Supabase",
          "Database & Storage",
          {
            name: "Supabase",
            icon: "https://supabase.com/favicon/favicon-196x196.png",
          },
          60, // Medium-high confidence for Supabase URL references
        )
        break
      }
    }
  }
}
