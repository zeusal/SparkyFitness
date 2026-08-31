/** The three angles the server accepts for a check-in progress photo. */
export const PHOTO_TYPES = ['front', 'back', 'side'] as const;

export type PhotoType = (typeof PHOTO_TYPES)[number];

/** A photo row as returned by GET /measurements/check-in-photos/:date. */
export interface CheckInPhoto {
  id: string;
  user_id: string;
  check_in_measurement_id: string | null;
  entry_date: string;
  photo_type: PhotoType;
  file_path: string;
  created_at: string;
}

/**
 * A gallery entry from GET /measurements/check-in-photos: one photo plus the
 * weight (kg, as stored) logged on the same day. `weight` is null when that day
 * has no check-in measurement or the measurement has no weight.
 */
export interface CheckInPhotoWithWeight {
  id: string;
  entry_date: string;
  photo_type: PhotoType;
  weight: number | null;
}

/**
 * One calendar day of the progress gallery: the photos taken that day, keyed by
 * angle, plus the day's weight. Built client-side from the flat gallery
 * response so the timeline, the comparison picker and the time-lapse player all
 * work off whole days rather than loose photos.
 */
export interface ProgressPhotoDay {
  entry_date: string;
  weight: number | null;
  photos: Partial<Record<PhotoType, CheckInPhotoWithWeight>>;
}
