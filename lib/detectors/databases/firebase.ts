import { type AnalysisContext, type DetectionMap, addOrUpdateDetection } from "../../utils"

export function detectFirebase(context: AnalysisContext, detections: DetectionMap): void {
  const { html, jsContents, headers } = context

  // Track detection confidence with a scoring system
  let firebaseConfidence = 0
  let hasStrongEvidence = false

  // Strong evidence - definitive Firebase usage

  // Check for Firebase specific headers - strongest evidence
  if (headers["x-firebase-cache"]) {
    addOrUpdateDetection(
      detections,
      "Firebase",
      "Database & Storage",
      {
        name: "Firebase",
        icon: "https://firebase.google.com/downloads/brand-guidelines/PNG/logo-logomark.png",
      },
      100, // Definitive confidence for Firebase header
    )
    return // Definitive evidence, no need to check further
  }

  // Check for explicit Firebase SDK script tags
  const firebaseScriptPatterns = [
    "firebase-app.js",
    "firebase-analytics.js",
    "firebase-auth.js",
    "firebase-firestore.js",
    "firebase-database.js",
    "firebase-storage.js",
    "firebase-messaging.js",
    "firebase-functions.js",
  ]

  for (const pattern of firebaseScriptPatterns) {
    if (html.includes(pattern)) {
      firebaseConfidence += 40
      hasStrongEvidence = true
      break
    }
  }

  // Check for Firebase initialization with config
  if (
    html.includes("initializeApp") &&
    html.includes("firebaseConfig") &&
    (html.includes("apiKey") || html.includes("authDomain") || html.includes("projectId"))
  ) {
    firebaseConfidence += 40
    hasStrongEvidence = true
  }

  // Check JS content for strong evidence
  for (const jsContent of jsContents) {
    // Firebase SDK imports (strong evidence)
    const firebaseImportPattern = jsContent.match(/import\s+\{\s*[^}]*\}\s+from\s+['"]firebase\/[^'"]+['"]/gi)
    const firebaseRequirePattern = jsContent.match(/require\s*$$\s*['"]firebase\/[^'"]+['"]\s*$$/gi)

    if (firebaseImportPattern || firebaseRequirePattern) {
      firebaseConfidence += 30
      hasStrongEvidence = true
    }

    // Firebase initialization with config (strong evidence)
    const hasInitializeApp =
      jsContent.match(/firebase\s*\.\s*initializeApp\s*\(/i) || jsContent.match(/initializeApp\s*\(/i)
    const hasFirebaseConfig = jsContent.match(/firebaseConfig\s*=/i)
    const hasConfigProps =
      jsContent.includes("apiKey") && (jsContent.includes("authDomain") || jsContent.includes("projectId"))

    if (hasInitializeApp && (hasFirebaseConfig || hasConfigProps)) {
      firebaseConfidence += 40
      hasStrongEvidence = true
    }

    // Firebase method usage (moderate evidence)
    const firebaseAuthUsage =
      jsContent.match(/\.\s*signInWithEmailAndPassword\s*\(/i) ||
      jsContent.match(/\.\s*createUserWithEmailAndPassword\s*\(/i) ||
      jsContent.match(/\.\s*signInWithPopup\s*\(/i)

    const firebaseFirestoreUsage =
      jsContent.match(/\.\s*collection\s*$$\s*['"][^'"]+['"]\s*$$/i) ||
      jsContent.match(/\.\s*doc\s*$$\s*['"][^'"]+['"]\s*$$/i)

    const firebaseDatabaseUsage =
      jsContent.match(/\.\s*ref\s*$$\s*['"][^'"]+['"]\s*$$/i) || jsContent.match(/\.\s*push\s*\(/i)

    const firebaseStorageUsage =
      jsContent.match(/\.\s*ref\s*$$\s*['"][^'"]+['"]\s*$$/i) ||
      jsContent.match(/\.\s*put\s*\(/i) ||
      jsContent.match(/\.\s*upload\s*\(/i)

    if (firebaseAuthUsage || firebaseFirestoreUsage || firebaseDatabaseUsage || firebaseStorageUsage) {
      // Only count method usage if we have other evidence of Firebase
      if (hasStrongEvidence) {
        firebaseConfidence += 20
      } else {
        // These methods could be from other libraries too, so lower confidence
        firebaseConfidence += 10
      }
    }
  }

  // Check for Firebase domains - but only if we have other evidence
  // This prevents false positives from sites that just mention Firebase
  const firebaseUrls = [
    "firebaseinstallations.googleapis.com",
    "firebaselogging-pa.googleapis.com",
    "firebasestorage.googleapis.com",
    "firestore.googleapis.com",
    "identitytoolkit.googleapis.com",
    "securetoken.googleapis.com",
    "firebaseio.com",
  ]

  let hasFirebaseUrl = false
  for (const jsContent of jsContents) {
    for (const firebaseUrl of firebaseUrls) {
      if (jsContent.includes(firebaseUrl)) {
        hasFirebaseUrl = true
        break
      }
    }
    if (hasFirebaseUrl) break
  }

  if (hasFirebaseUrl) {
    if (hasStrongEvidence) {
      firebaseConfidence += 20
    } else {
      // URLs alone are not enough - might just be mentioning Firebase
      firebaseConfidence += 10
    }
  }

  // Only detect Firebase if we have sufficient confidence
  // Increased threshold to reduce false positives
  if (firebaseConfidence >= 50) {
    // Try to detect Firebase version
    let firebaseVersion = undefined
    for (const jsContent of jsContents) {
      const versionMatch = jsContent.match(/firebase\/(\d+\.\d+\.\d+)/)
      if (versionMatch) {
        firebaseVersion = versionMatch[1]
        break
      }
    }

    addOrUpdateDetection(
      detections,
      "Firebase",
      "Database & Storage",
      {
        name: "Firebase",
        icon: "https://firebase.google.com/downloads/brand-guidelines/PNG/logo-logomark.png",
        version: firebaseVersion,
      },
      firebaseConfidence,
    )

    // Only detect specific Firebase products if we're confident about Firebase itself
    if (firebaseConfidence >= 60) {
      for (const jsContent of jsContents) {
        // Firebase Authentication
        if (jsContent.includes("firebase/auth") || jsContent.match(/\.\s*signInWith/i)) {
          addOrUpdateDetection(
            detections,
            "Firebase Authentication",
            "Backend & APIs",
            {
              name: "Firebase Authentication",
              icon: "https://firebase.google.com/downloads/brand-guidelines/PNG/logo-logomark.png",
            },
            70,
          )
        }

        // Firebase Firestore
        if (jsContent.includes("firebase/firestore") || jsContent.match(/\.\s*collection\s*\(/i)) {
          addOrUpdateDetection(
            detections,
            "Firebase Firestore",
            "Database & Storage",
            {
              name: "Firebase Firestore",
              icon: "https://firebase.google.com/downloads/brand-guidelines/PNG/logo-logomark.png",
            },
            70,
          )
        }

        // Firebase Realtime Database
        if (jsContent.includes("firebase/database") || jsContent.includes("firebaseio.com")) {
          addOrUpdateDetection(
            detections,
            "Firebase Realtime Database",
            "Database & Storage",
            {
              name: "Firebase Realtime Database",
              icon: "https://firebase.google.com/downloads/brand-guidelines/PNG/logo-logomark.png",
            },
            70,
          )
        }

        // Firebase Storage
        if (jsContent.includes("firebase/storage") || jsContent.includes("firebasestorage.googleapis.com")) {
          addOrUpdateDetection(
            detections,
            "Firebase Storage",
            "Database & Storage",
            {
              name: "Firebase Storage",
              icon: "https://firebase.google.com/downloads/brand-guidelines/PNG/logo-logomark.png",
            },
            70,
          )
        }
      }
    }
  }
}
