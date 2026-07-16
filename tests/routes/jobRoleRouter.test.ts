import express from 'express';
import * as jose from 'jose';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import JobRoleRouter from '../../src/routes/jobRoleRouter.js';

const SECRET = 'test-secret-key';

function createToken(role: 'ADMIN' | 'USER' = 'USER'): Promise<string> {
	return new jose.SignJWT({
		sub: '1',
		email: 'test@example.com',
		role,
	})
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('2h')
		.sign(new TextEncoder().encode(SECRET));
}

vi.hoisted(() => {
	process.env.DATABASE_URL = 'postgresql://test:test@localhost/test';
	process.env.JWT_SECRET_KEY = 'test-secret-key';
});

vi.mock('@prisma/adapter-pg', () => ({
	PrismaPg: class PrismaPg {},
}));

vi.mock('../../src/generated/prisma/client.js', () => ({
	PrismaClient: class PrismaClient {
		jobRole = {
			findMany: vi.fn().mockResolvedValue([
				{
					jobRoleId: 1,
					roleName: 'Engineer',
					location: 'Belfast',
					capabilityId: 2,
					bandId: 3,
					closingDate: new Date('2026-07-01T00:00:00.000Z'),
					status: 'open',
				},
			]),
			count: vi.fn().mockResolvedValue(1),
			findUnique: vi.fn().mockResolvedValue({
				jobRoleId: 1,
				roleName: 'Engineer',
				location: 'Belfast',
				capabilityId: 2,
				bandId: 3,
				closingDate: new Date('2026-07-01T00:00:00.000Z'),
				status: 'open',
				specification:
					'https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20-%20Software%20Engineer%20(Associate).pdf',
				description: 'Build and maintain backend services.',
				responsibilities: 'Design, implement, test, and support APIs.',
				numberOfOpenPositions: 2,
				capability: {
					capabilityId: 2,
					capabilityName: 'Engineering',
				},
				band: {
					bandId: 3,
					bandName: 'Associate',
				},
			}),
		};
	},
}));

describe('JobRoleRouter', () => {
	it('returns 401 for unauthenticated GET /job-roles', async () => {
		const app = express();
		app.use('/job-roles', JobRoleRouter);

		const response = await request(app).get('/job-roles');

		expect(response.status).toBe(401);
	});

	it('wires authenticated GET /job-roles to controller.getAll', async () => {
		const app = express();
		app.use('/job-roles', JobRoleRouter);
		const token = await createToken();

		const response = await request(app)
			.get('/job-roles')
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(response.headers['x-total-count']).toBe('1');
		expect(response.body).toHaveLength(1);
	});

	it('wires authenticated GET /job-roles/:id to controller.getById', async () => {
		const app = express();
		app.use('/job-roles', JobRoleRouter);
		const token = await createToken();

		const response = await request(app)
			.get('/job-roles/1')
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(response.body.id).toBe(1);
	});
});
