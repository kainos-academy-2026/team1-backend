import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '../src/app';
import { getPortFromEnv } from '../src/port';

describe('GET /health', () => {
  it('returns service health details', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('UP');
    expect(typeof response.body.time).toBe('string');
    expect(Number.isNaN(Date.parse(response.body.time))).toBe(false);
  });
});

describe('getPortFromEnv', () => {
  it('returns the configured port when valid', () => {
    expect(getPortFromEnv('8080')).toBe(8080);
  });

  it('uses the default port when PORT is not set', () => {
    const originalPort = process.env.PORT;
    delete process.env.PORT;

    try {
      expect(getPortFromEnv()).toBe(3000);
    } finally {
      if (typeof originalPort === 'undefined') {
        delete process.env.PORT;
      } else {
        process.env.PORT = originalPort;
      }
    }
  });

  it('returns NaN for non-numeric values', () => {
    expect(Number.isNaN(getPortFromEnv('abc'))).toBe(true);
    expect(Number.isNaN(getPortFromEnv('8080abc'))).toBe(true);
  });

  it('coerces numeric string values', () => {
    expect(getPortFromEnv('3000.5')).toBe(3000.5);
    expect(getPortFromEnv('70000')).toBe(70000);
  });
});
