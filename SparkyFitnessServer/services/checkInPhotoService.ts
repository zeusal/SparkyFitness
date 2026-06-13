import { getClient } from '../db/poolManager.js';
import { log } from '../config/logging.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type {
  CheckInPhotoResponse,
  PhotoType,
} from '../schemas/checkInPhotoSchemas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolveFilePath = (relativePath: string) =>
  path.join(__dirname, '..', relativePath);

export const getPhotosByDate = async (
  userId: string,
  entryDate: string
): Promise<CheckInPhotoResponse[]> => {
  const client = await getClient(userId);
  try {
    const result = await client.query(
      `SELECT id, user_id, check_in_measurement_id, entry_date, photo_type,
              file_path, created_at
       FROM check_in_photos
       WHERE user_id = $1 AND entry_date = $2
       ORDER BY photo_type ASC`,
      [userId, entryDate]
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return result.rows.map((r: any) => ({
      ...r,
      entry_date:
        r.entry_date instanceof Date
          ? r.entry_date.toISOString().split('T')[0]
          : String(r.entry_date),
      created_at:
        r.created_at instanceof Date
          ? r.created_at.toISOString()
          : String(r.created_at),
    }));
  } finally {
    client.release();
  }
};

export const upsertPhoto = async (
  userId: string,
  entryDate: string,
  photoType: PhotoType,
  filePath: string
): Promise<CheckInPhotoResponse> => {
  const client = await getClient(userId);
  try {
    // Delete old file if replacing an existing photo of the same type
    const existing = await client.query(
      `SELECT id, file_path FROM check_in_photos
       WHERE user_id = $1 AND entry_date = $2 AND photo_type = $3`,
      [userId, entryDate, photoType]
    );
    if (existing.rows.length > 0) {
      const oldPath = resolveFilePath(existing.rows[0].file_path);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
        log('debug', `Deleted old check-in photo: ${oldPath}`);
      }
    }

    // Resolve the FK to check_in_measurements if a record exists for this date
    const measurementResult = await client.query(
      'SELECT id FROM check_in_measurements WHERE user_id = $1 AND entry_date = $2',
      [userId, entryDate]
    );
    const measurementId = measurementResult.rows[0]?.id ?? null;

    const result = await client.query(
      `INSERT INTO check_in_photos
         (user_id, check_in_measurement_id, entry_date, photo_type, file_path)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, entry_date, photo_type)
       DO UPDATE SET
         file_path = EXCLUDED.file_path,
         check_in_measurement_id = EXCLUDED.check_in_measurement_id,
         updated_at = now()
       RETURNING id, user_id, check_in_measurement_id, entry_date, photo_type,
                 file_path, created_at`,
      [userId, measurementId, entryDate, photoType, filePath]
    );
    const r = result.rows[0];
    return {
      ...r,
      entry_date:
        r.entry_date instanceof Date
          ? r.entry_date.toISOString().split('T')[0]
          : String(r.entry_date),
      created_at:
        r.created_at instanceof Date
          ? r.created_at.toISOString()
          : String(r.created_at),
    };
  } finally {
    client.release();
  }
};

export const deletePhoto = async (
  userId: string,
  photoId: string
): Promise<void> => {
  const client = await getClient(userId);
  try {
    const result = await client.query(
      `DELETE FROM check_in_photos WHERE id = $1 AND user_id = $2
       RETURNING file_path`,
      [photoId, userId]
    );
    if (result.rows.length === 0) {
      return;
    }
    const filePath = resolveFilePath(result.rows[0].file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      log('debug', `Deleted check-in photo file: ${filePath}`);
    }
  } finally {
    client.release();
  }
};

export default { getPhotosByDate, upsertPhoto, deletePhoto };
