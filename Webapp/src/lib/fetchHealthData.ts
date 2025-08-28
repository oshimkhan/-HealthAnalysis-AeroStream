import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchLatestPatientData(patientId: string) {
  try {
    // Fetch latest vitals
    const { data: vitals, error: vitalsError } = await supabase
      .from("vitals_monitoring")
      .select("*")
      .eq("patient_id", patientId)
      .order("recorded_at", { ascending: false })
      .limit(1)
      .single();

    // Fetch latest breath analysis
    const { data: breath, error: breathError } = await supabase
      .from("breath_analysis")
      .select("*")
      .eq("patient_id", patientId)
      .order("recorded_at", { ascending: false })
      .limit(1)
      .single();

    if (vitalsError && breathError) {
      throw new Error("No health data found for this patient");
    }

    // Combine the data, handling cases where one might be null
    const combinedData = {
      ...(vitals || {}),
      ...(breath || {}),
    };

    // Remove id and recorded_at fields to avoid conflicts
    const { id: vitalsId, recorded_at: vitalsRecordedAt, ...vitalsClean } = vitals || {};
    const { id: breathId, recorded_at: breathRecordedAt, ...breathClean } = breath || {};

    return {
      ...vitalsClean,
      ...breathClean,
      latest_vitals_recorded: vitalsRecordedAt,
      latest_breath_recorded: breathRecordedAt,
    };
  } catch (error) {
    console.error('Error fetching latest patient data:', error);
    throw error;
  }
}
