import type { TechStackResult } from "./types"

export async function detectTechStack(url: string): Promise<TechStackResult> {
  try {
    const response = await fetch("/api/detect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to detect tech stack:", error)
    throw error
  }
}
