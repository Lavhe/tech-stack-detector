import { addOrUpdateDetection } from ".."
import type { AnalysisContext, DetectionMap } from ".."

export function detectShopify(context: AnalysisContext, detections: DetectionMap): void {
  const { html, headers } = context

  if (headers["x-shopify-stage"]) {
    addOrUpdateDetection(
      detections,
      "Shopify",
      "Other",
      {
        name: "Shopify",
        icon: "https://cdn.shopify.com/shopifycloud/brochure/assets/brand-assets/shopify-logo-primary-logo-456baa801ee66a0a435671082365958316831c9960c480451dd0330bcdae304f.svg",
      },
      100, // Definitive confidence for Shopify header
    )
  }

  if (html.includes("cdn.shopify.com") || html.includes("shopify.com/s/")) {
    addOrUpdateDetection(
      detections,
      "Shopify",
      "Other",
      {
        name: "Shopify",
        icon: "https://cdn.shopify.com/shopifycloud/brochure/assets/brand-assets/shopify-logo-primary-logo-456baa801ee66a0a435671082365958316831c9960c480451dd0330bcdae304f.svg",
      },
      90, // High confidence for Shopify assets
    )
  }
}
