import { vi, beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'supertest'
import request from 'supertest';
import express from 'express';
import checkInPhotoRoutes from '../routes/checkInPhotoRoutes.js';
import checkInPhotoService from '../services/checkInPhotoService.js';
import errorHandler from '../middleware/errorHandler.js';

vi.mock('../services/checkInPhotoService.js');
vi.mock('../middleware/authMiddleware', () => ({
  authenticate: vi.fn((req: any, _res: any, next: any) => {
    req.userId = 'test-user-id';
    next();
  }),
}));
vi.mock('../middleware/checkPermissionMiddleware', () => ({
  default: vi.fn(() => (_req: any, _res: any, next: any) => next()),
}));
vi.mock('../middleware/checkInPhotoUpload', () => ({
  default: {
    single: vi.fn(() => (req: any, _res: any, next: any) => {
      req.file = {
        path: '/uploads/check-in/test-user-id/2026-06-14/front.jpg',
        originalname: 'front.jpg',
      };
      next();
    }),
  },
}));

const app = express();
app.use(express.json());
app.use('/', checkInPhotoRoutes);
app.use(errorHandler);

const MOCK_PHOTO = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  user_id: 'test-user-id',
  check_in_measurement_id: null,
  entry_date: '2026-06-14',
  photo_type: 'front',
  file_path: 'uploads/check-in/test-user-id/2026-06-14/front.jpg',
  created_at: '2026-06-14T10:00:00.000Z',
};

describe('GET /:date', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns photos for a valid date', async () => {
    // @ts-expect-error mock
    checkInPhotoService.getPhotosByDate.mockResolvedValue([MOCK_PHOTO]);
    const res = await request(app).get('/2026-06-14');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([MOCK_PHOTO]);
    expect(checkInPhotoService.getPhotosByDate).toHaveBeenCalledWith(
      'test-user-id',
      '2026-06-14'
    );
  });

  it('returns 400 for invalid date format', async () => {
    const res = await request(app).get('/not-a-date');
    expect(res.status).toBe(400);
  });

  it('returns 500 when service throws', async () => {
    // @ts-expect-error mock
    checkInPhotoService.getPhotosByDate.mockRejectedValue(
      new Error('DB error')
    );
    const res = await request(app).get('/2026-06-14');
    expect(res.status).toBe(500);
  });
});

describe('POST /:date/:type', () => {
  beforeEach(() => vi.clearAllMocks());

  it('uploads a photo successfully', async () => {
    // @ts-expect-error mock
    checkInPhotoService.upsertPhoto.mockResolvedValue(MOCK_PHOTO);
    const res = await request(app).post('/2026-06-14/front');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(MOCK_PHOTO);
    expect(checkInPhotoService.upsertPhoto).toHaveBeenCalledWith(
      'test-user-id',
      '2026-06-14',
      'front',
      expect.stringContaining('front.jpg')
    );
  });

  it('returns 400 for an invalid photo type', async () => {
    const res = await request(app).post('/2026-06-14/diagonal');
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid date format', async () => {
    const res = await request(app).post('/bad-date/front');
    expect(res.status).toBe(400);
  });

  it('returns 500 when service throws', async () => {
    // @ts-expect-error mock
    checkInPhotoService.upsertPhoto.mockRejectedValue(new Error('DB error'));
    const res = await request(app).post('/2026-06-14/front');
    expect(res.status).toBe(500);
  });
});

describe('DELETE /photo/:id', () => {
  beforeEach(() => vi.clearAllMocks());

  it('deletes a photo by id', async () => {
    // @ts-expect-error mock
    checkInPhotoService.deletePhoto.mockResolvedValue(undefined);
    const res = await request(app).delete(
      '/photo/a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    );
    expect(res.status).toBe(204);
    expect(checkInPhotoService.deletePhoto).toHaveBeenCalledWith(
      'test-user-id',
      'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    );
  });

  it('returns 400 for non-UUID id', async () => {
    const res = await request(app).delete('/photo/not-a-uuid');
    expect(res.status).toBe(400);
  });

  it('returns 500 when service throws', async () => {
    // @ts-expect-error mock
    checkInPhotoService.deletePhoto.mockRejectedValue(new Error('DB error'));
    const res = await request(app).delete(
      '/photo/a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    );
    expect(res.status).toBe(500);
  });
});
