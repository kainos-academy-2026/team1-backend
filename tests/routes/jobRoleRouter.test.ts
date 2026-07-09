import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
	process.env.DATABASE_URL = 'postgresql://test:test@localhost/test';
});

vi.mock('@prisma/adapter-pg', () => ({
	PrismaPg: vi.fn(() => ({})),
}));

vi.mock('../../src/generated/prisma/client', () => ({
	PrismaClient: vi.fn(() => ({
		jobRole: { findMany: vi.fn().mockResolvedValue([]) },
	})),
}));

import JobRoleRouter from '../../src/routes/jobRoleRouter';

describe('createJobRoleRouter', () => {
	it('wires GET /job-roles to controller.getAll', async () => {
		const app = express();
		app.use('/job-roles', JobRoleRouter);

		const response = await request(app).get('/job-roles');

		expect(response.status).toBe(200);
		expect(response.body).toEqual([]);
	});
});
