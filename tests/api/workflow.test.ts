import * as jose from 'jose';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { app } from '../../src/app.js';

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

const {
	createUserMock,
	findUniqueMock,
	findManyMock,
	countMock,
	findByIdMock,
	createApplicationMock,
} = vi.hoisted(() => ({
	createUserMock: vi.fn(),
	findUniqueMock: vi.fn(),
	findManyMock: vi.fn(),
	countMock: vi.fn(),
	findByIdMock: vi.fn(),
	createApplicationMock: vi.fn(),
}));

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

vi.mock('argon2', () => ({
	hash: vi.fn().mockResolvedValue('hashed-password'),
	verify: vi.fn().mockResolvedValue(true),
}));

vi.mock('../../src/generated/prisma/client.js', () => ({
	UserRole: {
		ADMIN: 'ADMIN',
		USER: 'USER',
	},
	PrismaClient: class PrismaClient {
		user = {
			create: createUserMock,
			findUnique: findUniqueMock,
		};
		jobRole = {
			findMany: findManyMock,
			count: countMock,
			findUnique: findByIdMock,
		};
		application = {
			create: createApplicationMock,
		};
	},
}));

const defaultJobRole = {
	jobRoleId: 1,
	roleName: 'Senior Software Engineer',
	location: 'Belfast',
	capabilityId: 2,
	bandId: 3,
	closingDate: new Date('2026-08-15T00:00:00.000Z'),
	status: 'open',
	specification: 'https://example.com/spec.pdf',
	description: 'Lead backend development.',
	responsibilities: 'Design and implement APIs.',
	numberOfOpenPositions: 3,
	capability: { capabilityId: 2, capabilityName: 'Data and AI' },
	band: { bandId: 3, bandName: 'Senior Consultant' },
};

describe('API Workflow Tests', () => {
	beforeEach(() => {
		createUserMock.mockReset();
		findUniqueMock.mockReset();
		findManyMock.mockReset();
		countMock.mockReset();
		findByIdMock.mockReset();
		createApplicationMock.mockReset();

		// Default mock responses
		createUserMock.mockResolvedValue({
			userId: 1,
			email: 'testuser@example.com',
			password: 'hashed-password',
			role: 'USER',
		});

		findUniqueMock.mockResolvedValue({
			userId: 1,
			email: 'testuser@example.com',
			password: 'hashed-password',
			role: 'USER',
		});

		findManyMock.mockResolvedValue([
			{
				jobRoleId: 1,
				roleName: 'Senior Software Engineer',
				location: 'Belfast',
				capabilityId: 2,
				bandId: 3,
				closingDate: new Date('2026-08-15T00:00:00.000Z'),
				status: 'open',
				capability: { capabilityId: 2, capabilityName: 'Data and AI' },
				band: { bandId: 3, bandName: 'Senior Consultant' },
			},
		]);

		countMock.mockResolvedValue(1);

		findByIdMock.mockResolvedValue(defaultJobRole);

		createApplicationMock.mockResolvedValue({
			applicationId: 1,
			userId: 1,
			jobRoleId: 1,
			cvURL: 'job-applications/1/1/cv-123.pdf',
			status: 'IN_PROGRESS',
			dateApplied: new Date(),
		});
	});

	describe('Happy path: Complete user workflow', () => {
		it('user can sign up, log in, view job roles, and apply for a role', async () => {
			// Mock first findUnique to return null (email doesn't exist yet)
			findUniqueMock.mockResolvedValueOnce(null);

			// 1. Sign up
			const signupRes = await request(app).post('/auth/signup').send({
				email: 'newuser@example.com',
				password: 'SecurePass123!',
			});

			expect(signupRes.status).toBe(201);
			expect(createUserMock).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({ email: 'newuser@example.com' }),
				}),
			);

			// Mock subsequent findUnique for login
			findUniqueMock.mockResolvedValueOnce({
				userId: 1,
				email: 'newuser@example.com',
				password: 'hashed-password',
				role: 'USER',
			});

			// 2. Log in with same credentials
			const loginRes = await request(app).post('/auth/login').send({
				email: 'newuser@example.com',
				password: 'SecurePass123!',
			});

			expect(loginRes.status).toBe(200);
			expect(loginRes.body).toHaveProperty('token');
			const token = loginRes.body.token;

			// 3. View all job roles (authenticated)
			const rolesRes = await request(app)
				.get('/job-roles')
				.set('Authorization', `Bearer ${token}`);

			expect(rolesRes.status).toBe(200);
			expect(Array.isArray(rolesRes.body)).toBe(true);
			expect(rolesRes.body).toHaveLength(1);
			expect(rolesRes.body[0]).toHaveProperty(
				'roleName',
				'Senior Software Engineer',
			);
			expect(rolesRes.body[0]).toHaveProperty('capabilityName', 'Data and AI');

			// 4. View job role details
			const roleDetailsRes = await request(app)
				.get('/job-roles/1')
				.set('Authorization', `Bearer ${token}`);

			expect(roleDetailsRes.status).toBe(200);
			expect(roleDetailsRes.body).toHaveProperty('id', 1);
			expect(roleDetailsRes.body).toHaveProperty(
				'description',
				'Lead backend development.',
			);

			// 5. Apply for job role
			const applyRes = await request(app)
				.post('/job-roles/1/apply')
				.set('Authorization', `Bearer ${token}`)
				.send({
					fileName: 'my-cv.pdf',
					contentType: 'application/pdf',
				});

			expect(applyRes.status).toBe(200);
			expect(applyRes.body).toHaveProperty('uploadUrl');
			expect(applyRes.body).toHaveProperty('key');
			expect(createApplicationMock).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						userId: 1,
						jobRoleId: 1,
					}),
				}),
			);
		});
	});

	describe('Authentication errors', () => {
		it('login fails with invalid email', async () => {
			findUniqueMock.mockResolvedValueOnce(null);

			const res = await request(app).post('/auth/login').send({
				email: 'nonexistent@example.com',
				password: 'AnyPassword123!',
			});

			expect(res.status).toBe(401);
			expect(res.body).toEqual({ error: 'Invalid email or password' });
		});

		it('accessing protected route without token returns 401', async () => {
			const res = await request(app).get('/job-roles');

			expect(res.status).toBe(401);
		});

		it('accessing protected route with invalid token returns 401', async () => {
			const res = await request(app)
				.get('/job-roles')
				.set('Authorization', 'Bearer invalid-token');

			expect(res.status).toBe(401);
		});

		it('signup rejects duplicate email', async () => {
			findUniqueMock.mockResolvedValueOnce({
				userId: 999,
				email: 'duplicate@example.com',
				password: 'hashed',
				role: 'USER',
			});

			const res = await request(app).post('/auth/signup').send({
				email: 'duplicate@example.com',
				password: 'SecurePass123!',
			});

			expect(res.status).toBe(409);
			expect(res.body).toHaveProperty('error');
		});
	});

	describe('Job role operations', () => {
		it('retrieving non-existent job role returns 404', async () => {
			const token = await createToken();
			findByIdMock.mockResolvedValueOnce(null);

			const res = await request(app)
				.get('/job-roles/999')
				.set('Authorization', `Bearer ${token}`);

			expect(res.status).toBe(404);
			expect(res.body).toEqual({ error: 'Job role not found' });
		});

		it('pagination parameters are validated', async () => {
			const token = await createToken();

			const res = await request(app)
				.get('/job-roles?limit=0&offset=-1')
				.set('Authorization', `Bearer ${token}`);

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error');
		});
	});

	describe('Application workflow', () => {
		it('applying for a closed job role returns 409', async () => {
			const closedRole = { ...defaultJobRole, status: 'closed' };
			findByIdMock.mockResolvedValueOnce(closedRole);

			const token = await createToken();

			const applyRes = await request(app)
				.post('/job-roles/1/apply')
				.set('Authorization', `Bearer ${token}`)
				.send({
					fileName: 'cv.pdf',
					contentType: 'application/pdf',
				});

			expect(applyRes.status).toBe(409);
			expect(applyRes.body).toEqual({
				error: 'Job role is not open for applications',
			});
		});

		it('applying for a job role with invalid file type returns 400', async () => {
			const token = await createToken();

			const applyRes = await request(app)
				.post('/job-roles/1/apply')
				.set('Authorization', `Bearer ${token}`)
				.send({
					fileName: 'document.jpg',
					contentType: 'image/jpeg',
				});

			expect(applyRes.status).toBe(400);
		});

		it('applying to non-existent job role returns 404', async () => {
			const token = await createToken();
			findByIdMock.mockResolvedValueOnce(null);

			const applyRes = await request(app)
				.post('/job-roles/999/apply')
				.set('Authorization', `Bearer ${token}`)
				.send({
					fileName: 'cv.pdf',
					contentType: 'application/pdf',
				});

			expect(applyRes.status).toBe(404);
			expect(applyRes.body).toEqual({ error: 'Job role not found' });
		});
	});

	describe('Data validation', () => {
		it('signup rejects invalid email format', async () => {
			const res = await request(app).post('/auth/signup').send({
				email: 'not-an-email',
				password: 'SecurePass123!',
			});

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('errors');
		});

		it('signup rejects weak password', async () => {
			const res = await request(app).post('/auth/signup').send({
				email: 'user@example.com',
				password: 'weak',
			});

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('errors');
		});

		it('login rejects missing required fields', async () => {
			const res = await request(app).post('/auth/login').send({
				email: 'user@example.com',
			});

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('errors');
		});
	});
});
