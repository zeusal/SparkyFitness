import { z } from 'zod/v4';

export const PhotoTypeSchema = z.enum(['front', 'back', 'side']);

export const CheckInPhotoDateParamSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
});

export const CheckInPhotoUploadParamSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
  type: PhotoTypeSchema,
});

export const CheckInPhotoIdParamSchema = z.object({
  id: z.string().uuid('id must be a valid UUID'),
});

export const CheckInPhotoResponseSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  check_in_measurement_id: z.string().uuid().nullable(),
  entry_date: z.string(),
  photo_type: PhotoTypeSchema,
  file_path: z.string(),
  created_at: z.string(),
});

/**
 * One photo in the progress gallery, paired with the weight recorded on the
 * same day. `file_path` is deliberately omitted: clients fetch the image bytes
 * through the authenticated /file/{id} route, so the on-disk layout stays a
 * server detail. `weight` is null when no check-in measurement exists for that
 * day, or when one exists without a weight.
 */
export const CheckInPhotoWithWeightSchema = z.object({
  id: z.string().uuid(),
  entry_date: z.string(),
  photo_type: PhotoTypeSchema,
  weight: z.number().nullable(),
});

export type CheckInPhotoResponse = z.infer<typeof CheckInPhotoResponseSchema>;
export type PhotoType = z.infer<typeof PhotoTypeSchema>;
export type CheckInPhotoWithWeight = z.infer<
  typeof CheckInPhotoWithWeightSchema
>;
