import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SurveyRow {
  id: number;
  created_at: string;
  reading_frequency: string;
  reading_time: string;
  distractions: string[];
  reading_duration: string;
  skipping_feeling: string;
  consistency_helpers: string[];
  struggle_reason: string;
}

export interface SurveySubmission {
  reading_frequency: string;
  reading_time: string;
  distractions: string[];
  reading_duration: string;
  skipping_feeling: string;
  consistency_helpers: string[];
  struggle_reason: string;
}

export interface FrequencyCount {
  label: string;
  count: number;
}

export function aggregateField(rows: SurveyRow[], field: keyof SurveyRow): FrequencyCount[] {
  const counts: Record<string, number> = {};
  for (const row of rows) {
    const val = row[field];
    if (Array.isArray(val)) {
      for (const item of val) {
        counts[item] = (counts[item] ?? 0) + 1;
      }
    } else if (typeof val === "string") {
      counts[val] = (counts[val] ?? 0) + 1;
    }
  }
  return Object.entries(counts).map(([label, count]) => ({ label, count }));
}
