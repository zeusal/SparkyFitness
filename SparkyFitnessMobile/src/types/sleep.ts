export interface SleepStageEvent {
  id: string;
  entry_id?: string;
  stage: string;
  start_time: string;
  duration_in_seconds: number;
}

/**
 * A sleep entry. v1 of the mobile check-in only reads/writes the core fields
 * (times + duration); the richer analytics fields (sleep score, SpO2, HRV,
 * etc.) are populated by synced HealthKit / Health Connect data and surfaced
 * read-only where present.
 */
export interface SleepEntry {
  id: string;
  user_id?: string;
  entry_date: string;
  bedtime: string;
  wake_time: string;
  duration_in_seconds: number;
  time_asleep_in_seconds?: number | null;
  sleep_score?: number | null;
  source?: string;
  stage_events?: SleepStageEvent[];
}

/** Payload for a manual sleep entry (`POST /api/sleep/manual_entry`). */
export interface SaveSleepEntryInput {
  entry_date: string;
  bedtime: string;
  wake_time: string;
  duration_in_seconds: number;
  source?: string;
  stage_events?: SleepStageEvent[];
}
