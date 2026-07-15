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
	process.env.AWS_REGION = 'us-east-1';
	process.env.S3_BUCKET_NAME = 'test-bucket';
});

vi.mock('@prisma/adapter-pg', () => ({
	PrismaPg: class PrismaPg {},
}));

vi.mock('@aws-sdk/client-s3', () => ({
	S3Client: class S3Client {},
	PutObjectCommand: class PutObjectCommand {},
}));

vi.mock('@aws-sdk/s3-request-presigner', () => ({
	getSignedUrl: vi.fn().mockResolvedValue('https://s3.example.com/upload'),
}));

vi.mock('../../src/generated/prisma/client.js', () => ({
	PrismaClient: class PrismaClient {
		application = {
			create: vi.fn().mockResolvedValue({
				applicationId: 1,
				userId: 1,
				jobRoleId: 1,
				cvURL: 'job-applications/1/1/123-cv.pdf',
				status: 'IN_PROGRESS',
				dateApplied: new Date('2026-07-01T00:00:00.000Z'),
			}),
		};
		jobRole = {
			findMany: vi.fn().mockResolvedValue([]),
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
		expect(response.body).toEqual([]);
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

	it('returns 401 for unauthenticated POST /job-roles/:id/apply', async () => {
		const app = express();
		app.use(express.json());
		app.use('/job-roles', JobRoleRouter);

		const response = await request(app)
			.post('/job-roles/1/apply')
			.send({ fileName: 'cv.pdf', contentType: 'application/pdf' });

		expect(response.status).toBe(401);
	});

	it('returns 400 when the apply body is invalid', async () => {
		const app = express();
		app.use(express.json());
		app.use('/job-roles', JobRoleRouter);
		const token = await createToken();

		const response = await request(app)
			.post('/job-roles/1/apply')
			.set('Authorization', `Bearer ${token}`)
			.send({ fileName: 'cv.pdf', contentType: 'image/png' });

		expect(response.status).toBe(400);
	});

	it('wires authenticated POST /job-roles/:id/apply to controller.applyForJobRole', async () => {
		const app = express();
		app.use(express.json());
		app.use('/job-roles', JobRoleRouter);
		const token = await createToken();

		const response = await request(app)
			.post('/job-roles/1/apply')
			.set('Authorization', `Bearer ${token}`)
			.send({ fileName: 'cv.pdf', contentType: 'application/pdf' });

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('uploadUrl');
		expect(response.body).toHaveProperty('key');
	});
});
