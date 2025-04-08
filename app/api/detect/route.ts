import { type NextRequest, NextResponse } from "next/server"
import type { TechStackResult } from "@/lib/types"
import { runAllDetectors, type AnalysisContext } from "@/lib/detectors"
import { extractScriptSources, extractStylesheetSources, fetchAssets } from "@/lib/utils/asset-fetcher"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Analyze the website and its assets
    const result = await analyzeWebsite(url)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error detecting tech stack:", error)
    return NextResponse.json({ error: "Failed to analyze tech stack" }, { status: 500 })
  }
}

async function analyzeWebsite(url: string): Promise<TechStackResult> {
  try {
    // Fetch the main HTML page
    const mainResponse = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
    })

    if (!mainResponse.ok) {
      throw new Error(`Failed to fetch the website: ${mainResponse.status}`)
    }

    const html = await mainResponse.text()
    const headers = Object.fromEntries(mainResponse.headers)

    // Extract all script sources from the HTML
    const scriptSources = await extractScriptSources(html, url)

    // Extract all stylesheet sources from the HTML
    const stylesheetSources = await extractStylesheetSources(html, url)

    // Fetch and analyze JavaScript files
    const jsContents = await fetchAssets(scriptSources)

    // Fetch and analyze CSS files
    const cssContents = await fetchAssets(stylesheetSources)

    // Create analysis context
    const context: AnalysisContext = {
      html,
      headers,
      jsContents,
      cssContents,
      url,
    }

    // Run all detectors
    const detections = await runAllDetectors(context)

    // Convert detections to the final result format
    // Only include technologies with confidence above threshold
    const technologies: TechStackResult["technologies"] = {}
    const CONFIDENCE_THRESHOLD = 40 // Increased threshold to reduce false positives

    Object.values(detections).forEach((detection) => {
      if (detection.confidence >= CONFIDENCE_THRESHOLD) {
        if (!technologies[detection.category]) {
          technologies[detection.category] = []
        }
        technologies[detection.category].push(detection.tech)
      }
    })

    // If we didn't detect anything, add a placeholder
    if (Object.keys(technologies).length === 0) {
      technologies["Other"] = [{ name: "No technologies detected with high confidence" }]
    }

    return {
      url,
      technologies,
    }
  } catch (error) {
    console.error("Error analyzing website:", error)
    return {
      url,
      technologies: {
        Error: [{ name: "Failed to analyze website" }],
      },
    }
  }
}
