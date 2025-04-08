import { detectFirebase } from "./firebase"
import { detectSupabase } from "./supabase"
import { detectMongoDB } from "./mongodb"
import { detectPostgreSQL } from "./postgresql"
import { detectMySQL } from "./mysql"
import type { AnalysisContext, DetectionMap } from ".."

export function detectDatabases(context: AnalysisContext, detections: DetectionMap): void {
  detectFirebase(context, detections)
  detectSupabase(context, detections)
  detectMongoDB(context, detections)
  detectPostgreSQL(context, detections)
  detectMySQL(context, detections)
}
