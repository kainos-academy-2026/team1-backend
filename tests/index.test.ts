import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { app } from '../src/app.js';

vi.hoisted(() => {
	process.env.DATABASE_URL = 'postgresql://test:test@localhost/test';
	process.env.JWT_SECRET_KEY = 'test-secret-key';
	process.env.AWS_REGION = 'us-east-1';
	process.env.S3_BUCKET_NAME = 'test-bucket';
});

describe('GET /health', () => {
	it('returns service health details', async () => {
		const response = await request(app).get('/health');

		expect(response.status).toBe(200);
		expect(response.body.status).toBe('OK');
		expect(typeof response.body.time).toBe('string');
		expect(Number.isNaN(Date.parse(response.body.time))).toBe(false);
	});
});
