import { vi, beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'supertest'
import request from 'supertest';
import express from 'express';
import measurementService from '../services/measurementService.js';
import measurementRoutes from '../routes/measurementRoutes.js';

vi.mock('../services/measurementService.js', () => ({
  default: {
    addSteps: vi.fn(),
    processHealthData: vi.fn(),
    processMobileHealthData: vi.fn(),
    upsertCheckInMeasurements: vi.fn(),
    getCheckInMeasurements: vi.fn(),
    getLatestCheckInMeasurementsOnOrBeforeDate: vi.fn(),
    updateCheckInMeasurements: vi.fn(),
    deleteCheckInMeasurements: vi.fn(),
    getCheckInMeasurementsByDateRange: vi.fn(),
    getWaterIntake: vi.fn(),
    upsertWaterIntake: vi.fn(),
    updateWaterIntake: vi.fn(),
    deleteWaterIntake: vi.fn(),
    getCustomCategories: vi.fn(),
    createCustomCategory: vi.fn(),
    updateCustomCategory: vi.fn(),
    deleteCustomCategory: vi.fn(),
    getCustomMeasurementEntries: vi.fn(),
    getCustomMeasurementEntriesByDate: vi.fn(),
    getCustomMeasurementsByDateRange: vi.fn(),
    upsertCustomMeasurementEntry: vi.fn(),
    deleteCustomMeasurementEntry: vi.fn(),
    getMostRecentMeasurement: vi.fn(),
    getWaterIntakeLog: vi.fn(),
    deleteWaterIntakeLogEntry: vi.fn(),
    updateWaterIntakeLogTime: vi.fn(),
  },
}));

vi.mock('../middleware/authMiddleware.js', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authenticate: (req: any, _res: any, next: any) => {
    req.userId = 'test-user-id';
    req.authenticatedUserId = 'test-user-id';
    req.originalUserId = 'test-user-id';
    next();
  },
}));

vi.mock('../middleware/checkPermissionMiddleware.js', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: vi.fn(() => (_req: any, _res: any, next: any) => next()),
}));

vi.mock('../config/logging.js', () => ({
  log: vi.fn(),
}));

vi.mock('../services/AdaptiveTdeeService.js', () => ({
  clearUserTdeeCache: vi.fn(),
}));

vi.mock('../utils/permissionUtils.js', () => ({
  canAccessUserData: vi.fn().mockResolvedValue(true),
}));

const app = express();
app.use(express.json());
app.use('/api/measurements', measurementRoutes);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, _req: any, res: any, _next: any) => {
  res.status(err.status || 500).json({ error: err.message });
});

describe('POST /api/measurements/steps', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('records steps with valid body', async () => {
    const row = {
      user_id: 'test-user-id',
      entry_date: '2024-06-15',
      steps: 5000,
    };
    // @ts-expect-error TS(2339)
    measurementService.addSteps.mockResolvedValue(row);

    const res = await request(app)
      .post('/api/measurements/steps')
      .send({ entry_date: '2024-06-15', steps: 5000 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(row);
    expect(measurementService.addSteps).toHaveBeenCalledWith(
      'test-user-id',
      'test-user-id',
      '2024-06-15',
      5000,
      false
    );
  });

  it('records steps with incremental=true', async () => {
    const row = {
      user_id: 'test-user-id',
      entry_date: '2024-06-15',
      steps: 8000,
    };
    // @ts-expect-error TS(2339)
    measurementService.addSteps.mockResolvedValue(row);

    const res = await request(app)
      .post('/api/measurements/steps')
      .send({ entry_date: '2024-06-15', steps: 3000, incremental: true });

    expect(res.statusCode).toBe(200);
    expect(measurementService.addSteps).toHaveBeenCalledWith(
      'test-user-id',
      'test-user-id',
      '2024-06-15',
      3000,
      true
    );
  });

  it('returns 400 when entry_date is missing', async () => {
    const res = await request(app)
      .post('/api/measurements/steps')
      .send({ steps: 5000 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when steps is negative', async () => {
    const res = await request(app)
      .post('/api/measurements/steps')
      .send({ entry_date: '2024-06-15', steps: -100 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when steps is a non-integer float', async () => {
    const res = await request(app)
      .post('/api/measurements/steps')
      .send({ entry_date: '2024-06-15', steps: 1000.5 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 500 when service throws', async () => {
    // @ts-expect-error TS(2339)
    measurementService.addSteps.mockRejectedValue(new Error('DB error'));

    const res = await request(app)
      .post('/api/measurements/steps')
      .send({ entry_date: '2024-06-15', steps: 5000 });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error', 'DB error');
  });
});
