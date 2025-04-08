import { addOrUpdateDetection } from ".."
import type { AnalysisContext, DetectionMap } from ".."

export function detectAngular(context: AnalysisContext, detections: DetectionMap): void {
  const { html, jsContents } = context

  // Angular detection in HTML - look for Angular specific attributes
  if (
    html.match(/ng-[a-z]+/i) ||
    html.match(/ng-app=/i) ||
    html.match(/ng-controller=/i) ||
    html.match(/ng-model=/i) ||
    html.match(/<[a-z]+ \[.*\]=/i) || // Angular property binding
    html.match(/<[a-z]+ $$.*$$=/i) || // Angular event binding
    html.includes("angular.js") ||
    html.includes("angular.min.js")
  ) {
    addOrUpdateDetection(
      detections,
      "Angular",
      "Frontend Frameworks",
      {
        name: "Angular",
        icon: "https://angular.io/assets/images/logos/angular/angular.svg",
      },
      80, // High confidence for Angular specific attributes
    )
  }

  // Angular detection in JS - look for Angular specific code patterns
  for (const jsContent of jsContents) {
    if (
      jsContent.match(/angular\s*\.\s*module/i) ||
      jsContent.match(/import\s+\{\s*[^}]*NgModule[^}]*\}\s+from\s+['"]@angular\/core['"]/i) ||
      jsContent.match(/import\s+\{\s*[^}]*Component[^}]*\}\s+from\s+['"]@angular\/core['"]/i) ||
      jsContent.match(/import\s+\{\s*[^}]*Injectable[^}]*\}\s+from\s+['"]@angular\/core['"]/i) ||
      jsContent.match(/@Component\s*\(\s*\{/i) ||
      jsContent.match(/@NgModule\s*\(\s*\{/i)
    ) {
      addOrUpdateDetection(
        detections,
        "Angular",
        "Frontend Frameworks",
        {
          name: "Angular",
          icon: "https://angular.io/assets/images/logos/angular/angular.svg",
        },
        90, // Very high confidence for Angular specific code
      )
    }
  }
}
