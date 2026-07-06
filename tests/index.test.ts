import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp, getPortFromEnv } from '../src/server';

describe('GET /health', () => {
  it('returns service health details', async () => {
    const app = createApp();

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

  it('uses the default port when undefined', () => {
    expect(getPortFromEnv(undefined)).toBe(3000);
  });

  it('throws for non-integer values', () => {
    expect(() => getPortFromEnv('abc')).toThrow(
      'Invalid PORT value "abc". PORT must be an integer between 1 and 65535.',
    );
  });

  it('throws for values outside the valid range', () => {
    expect(() => getPortFromEnv('70000')).toThrow(
      'Invalid PORT value "70000". PORT must be an integer between 1 and 65535.',
    );
  });
});
