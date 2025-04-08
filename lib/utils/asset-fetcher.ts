export async function extractScriptSources(html: string, baseUrl: string): string[] {
  const scriptRegex = /<script[^>]*src=["']([^"']+)["'][^>]*>/gi
  const sources: string[] = []
  let match

  while ((match = scriptRegex.exec(html)) !== null) {
    let src = match[1]
    // Handle relative URLs
    if (src.startsWith("//")) {
      src = `https:${src}`
    } else if (src.startsWith("/")) {
      const urlObj = new URL(baseUrl)
      src = `${urlObj.protocol}//${urlObj.host}${src}`
    } else if (!src.startsWith("http")) {
      const baseUrlWithoutFile = baseUrl.replace(/\/[^/]*$/, "")
      src = `${baseUrlWithoutFile}/${src}`
    }
    sources.push(src)
  }

  // Also extract inline scripts for analysis
  const inlineScriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi
  const inlineScripts: string[] = []

  while ((match = inlineScriptRegex.exec(html)) !== null) {
    const scriptContent = match[1].trim()
    if (scriptContent && !match[0].includes("src=")) {
      inlineScripts.push(scriptContent)
    }
  }

  return [...sources, ...inlineScripts]
}

export async function extractStylesheetSources(html: string, baseUrl: string): string[] {
  const linkRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi
  const sources: string[] = []
  let match

  while ((match = linkRegex.exec(html)) !== null) {
    let href = match[1]
    // Handle relative URLs
    if (href.startsWith("//")) {
      href = `https:${href}`
    } else if (href.startsWith("/")) {
      const urlObj = new URL(baseUrl)
      href = `${urlObj.protocol}//${urlObj.host}${href}`
    } else if (!href.startsWith("http")) {
      const baseUrlWithoutFile = baseUrl.replace(/\/[^/]*$/, "")
      href = `${baseUrlWithoutFile}/${href}`
    }
    sources.push(href)
  }

  // Also extract inline styles
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi
  const inlineStyles: string[] = []

  while ((match = styleRegex.exec(html)) !== null) {
    inlineStyles.push(match[1])
  }

  return [...sources, ...inlineStyles]
}

export async function fetchAssets(urls: string[]): Promise<string[]> {
  const contents: string[] = []

  // Filter out inline scripts/styles which are already content
  const urlsToFetch = urls.filter((url) => url.startsWith("http")).slice(0, 20) // Fetch up to 20 assets
  const inlineContent = urls.filter((url) => !url.startsWith("http"))

  const fetchPromises = urlsToFetch.map(async (url) => {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      })

      if (response.ok) {
        return await response.text()
      }
    } catch (error) {
      console.error(`Error fetching ${url}:`, error)
    }
    return ""
  })

  const results = await Promise.all(fetchPromises)
  return [...results.filter((content) => content !== ""), ...inlineContent]
}
