export type PhotoType = 'front' | 'back' | 'side';

export interface CheckInPhoto {
  id: string;
  user_id: string;
  check_in_measurement_id?: string | null;
  entry_date: string;
  photo_type: PhotoType;
  file_path: string;
  created_at: string;
}
