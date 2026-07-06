/// <reference types="jest" />
import request from 'supertest';
import app from '../index';

describe('GET /health', () => {
  it('should return UP status with timestamp', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'UP');
    expect(response.body).toHaveProperty('time');
    expect(typeof response.body.time).toBe('string');
  });

  it('should return a valid ISO timestamp', async () => {
    const response = await request(app).get('/health');

    const timestamp = new Date(response.body.time);
    expect(timestamp.toString()).not.toBe('Invalid Date');
  });
});
