import { detectReact } from "@/lib/detectors/frameworks/react"
import { detectFirebase } from "@/lib/detectors/databases/firebase"
import { detectSupabase } from "@/lib/detectors/databases/supabase"
import type { AnalysisContext, DetectionMap } from "@/lib/detectors"
import { describe, it, expect } from "vitest"

describe("Technology Detectors", () => {
  describe("React Detector", () => {
    it("should detect React from HTML", () => {
      const context: AnalysisContext = {
        html: '<div id="root"></div><script src="react.js"></script>',
        headers: {},
        jsContents: [],
        cssContents: [],
        url: "https://example.com",
      }

      const detections: DetectionMap = {}
      detectReact(context, detections)

      expect(detections["React"]).toBeDefined()
      expect(detections["React"].tech.name).toBe("React")
    })

    it("should detect React from JS", () => {
      const context: AnalysisContext = {
        html: "",
        headers: {},
        jsContents: ['import React from "react"; ReactDOM.render(<App />, document.getElementById("root"));'],
        cssContents: [],
        url: "https://example.com",
      }

      const detections: DetectionMap = {}
      detectReact(context, detections)

      expect(detections["React"]).toBeDefined()
      expect(detections["React"].tech.name).toBe("React")
      expect(detections["React"].confidence).toBeGreaterThanOrEqual(90)
    })
  })

  describe("Firebase Detector", () => {
    it("should detect Firebase from HTML", () => {
      const context: AnalysisContext = {
        html: '<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js"></script>',
        headers: {},
        jsContents: [],
        cssContents: [],
        url: "https://example.com",
      }

      const detections: DetectionMap = {}
      detectFirebase(context, detections)

      expect(detections["Firebase"]).toBeDefined()
      expect(detections["Firebase"].tech.name).toBe("Firebase")
    })

    it("should detect Firebase from JS", () => {
      const context: AnalysisContext = {
        html: "",
        headers: {},
        jsContents: [
          `
          import { initializeApp } from "firebase/app";
          const firebaseConfig = {
            apiKey: "test-key",
            authDomain: "test.firebaseapp.com",
            projectId: "test-project"
          };
          const app = initializeApp(firebaseConfig);
        `,
        ],
        cssContents: [],
        url: "https://example.com",
      }

      const detections: DetectionMap = {}
      detectFirebase(context, detections)

      expect(detections["Firebase"]).toBeDefined()
      expect(detections["Firebase"].tech.name).toBe("Firebase")
    })

    it("should detect Firebase from API URLs", () => {
      const context: AnalysisContext = {
        html: "",
        headers: {},
        jsContents: [
          `fetch("https://firestore.googleapis.com/v1/projects/my-project/databases/(default)/documents/users")`,
        ],
        cssContents: [],
        url: "https://example.com",
      }

      const detections: DetectionMap = {}
      detectFirebase(context, detections)

      expect(detections["Firebase"]).toBeDefined()
      expect(detections["Firebase"].tech.name).toBe("Firebase")
    })
  })

  describe("Supabase Detector", () => {
    it("should detect Supabase from JS", () => {
      const context: AnalysisContext = {
        html: "",
        headers: {},
        jsContents: [
          `
          import { createClient } from '@supabase/supabase-js'
          const supabase = createClient('https://example.supabase.co', 'your-api-key')
        `,
        ],
        cssContents: [],
        url: "https://example.com",
      }

      const detections: DetectionMap = {}
      detectSupabase(context, detections)

      expect(detections["Supabase"]).toBeDefined()
      expect(detections["Supabase"].tech.name).toBe("Supabase")
    })
  })
})
