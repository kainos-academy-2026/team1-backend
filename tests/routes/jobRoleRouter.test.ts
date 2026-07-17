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
					capability: {
						capabilityId: 2,
						capabilityName: 'Data and AI',
					},
					band: {
						bandId: 3,
						bandName: 'Consultant',
					},
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
					capabilityName: 'Data and AI',
				},
				band: {
					bandId: 3,
					bandName: 'Consultant',
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

	it('returns capabilityName and bandName in GET /job-roles list response', async () => {
		const app = express();
		app.use('/job-roles', JobRoleRouter);
		const token = await createToken();

		const response = await request(app)
			.get('/job-roles')
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(response.body).toHaveLength(1);
		const jobRole = response.body[0];
		expect(jobRole.capabilityName).toBe('Data and AI');
		expect(jobRole.bandName).toBe('Consultant');
		expect(jobRole.capabilityId).toBe(2);
		expect(jobRole.bandId).toBe(3);
	});

	it('regression: fails if capability or band joins are removed from list query', async () => {
		const app = express();
		app.use('/job-roles', JobRoleRouter);
		const token = await createToken();

		const response = await request(app)
			.get('/job-roles')
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(200);
		const jobRole = response.body[0];

		// These fields must be present and non-empty strings
		expect(typeof jobRole.capabilityName).toBe('string');
		expect(jobRole.capabilityName.length).toBeGreaterThan(0);
		expect(typeof jobRole.bandName).toBe('string');
		expect(jobRole.bandName.length).toBeGreaterThan(0);
	});
});
