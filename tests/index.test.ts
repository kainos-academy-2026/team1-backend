import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
	process.env.DATABASE_URL = 'postgresql://test:test@localhost/test';
});

import { app } from '../src/app';

describe('GET /health', () => {
	it('returns service health details', async () => {
		const response = await request(app).get('/health');

		expect(response.status).toBe(200);
		expect(response.body.status).toBe('OK');
		expect(typeof response.body.time).toBe('string');
		expect(Number.isNaN(Date.parse(response.body.time))).toBe(false);
	});
});