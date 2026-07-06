import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app, getPortFromEnv } from '../src/server';

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

  it('throws for non-integer values', () => {
    expect(() => getPortFromEnv('abc')).toThrow(
      'Invalid PORT value "abc". PORT must be an integer between 1 and 65535.',
    );
    expect(() => getPortFromEnv('8080abc')).toThrow(
      'Invalid PORT value "8080abc". PORT must be an integer between 1 and 65535.',
    );
    expect(() => getPortFromEnv('3000.5')).toThrow(
      'Invalid PORT value "3000.5". PORT must be an integer between 1 and 65535.',
    );
  });

  it('throws for values outside the valid range', () => {
    expect(() => getPortFromEnv('70000')).toThrow(
      'Invalid PORT value "70000". PORT must be an integer between 1 and 65535.',
    );
  });
});
