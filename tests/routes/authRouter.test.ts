import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AuthRouter from '../../src/routes/loginRouter';

const { createUserMock, findUniqueMock } = vi.hoisted(() => ({
	createUserMock: vi.fn(),
	findUniqueMock: vi.fn(),
}));

vi.hoisted(() => {
	process.env.DATABASE_URL = 'postgresql://test:test@localhost/test';
	process.env.JWT_SECRET_KEY = 'test-secret-key';
});

vi.mock('argon2', () => ({
	hash: vi.fn().mockResolvedValue('hashed-password'),
	verify: vi.fn().mockResolvedValue(true),
}));

vi.mock('@prisma/adapter-pg', () => ({
	PrismaPg: class PrismaPg {},
}));

vi.mock('../../src/generated/prisma/client', () => ({
	UserRole: {
		ADMIN: 'ADMIN',
		USER: 'USER',
	},
	PrismaClient: class PrismaClient {
		user = {
			create: createUserMock,
			findUnique: findUniqueMock,
		};
	},
}));

describe('AuthRouter', () => {
	beforeEach(() => {
		createUserMock.mockReset();
		findUniqueMock.mockReset();
		createUserMock.mockResolvedValue({
			userId: 1,
			email: 'test@example.com',
			password: 'hashed-password',
			role: 'USER',
		});
		findUniqueMock.mockResolvedValue({
			userId: 1,
			email: 'test@example.com',
			password: 'hashed-password',
			role: 'USER',
		});
	});

	it('creates a user on POST /auth/signup', async () => {
		const app = express();
		app.use(express.json());
		app.use('/auth', AuthRouter);

		const response = await request(app).post('/auth/signup').send({
			email: 'test@example.com',
			password: 'Password123!',
		});

		expect(response.status).toBe(201);
		expect(response.body).toEqual({});
		expect(createUserMock).toHaveBeenCalledWith({
			data: {
				email: 'test@example.com',
				password: 'hashed-password',
				role: 'USER',
			},
		});
	});

	it('rejects unexpected fields in signup body', async () => {
		const app = express();
		app.use(express.json());
		app.use('/auth', AuthRouter);

		const response = await request(app).post('/auth/signup').send({
			email: 'test@example.com',
			password: 'Password123!',
			role: 'ADMIN',
		});

		expect(response.status).toBe(400);
		expect(response.body.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					message: expect.stringContaining('Unrecognized key'),
				}),
			]),
		);
		expect(createUserMock).not.toHaveBeenCalled();
	});

	it('rejects an invalid email', async () => {
		const app = express();
		app.use(express.json());
		app.use('/auth', AuthRouter);

		const response = await request(app).post('/auth/signup').send({
			email: 'not-an-email',
			password: 'Password123!',
		});

		expect(response.status).toBe(400);
		expect(response.body.errors).toEqual(
			expect.arrayContaining([expect.objectContaining({ field: 'email' })]),
		);
		expect(createUserMock).not.toHaveBeenCalled();
	});

	it('rejects a password that is too short', async () => {
		const app = express();
		app.use(express.json());
		app.use('/auth', AuthRouter);

		const response = await request(app).post('/auth/signup').send({
			email: 'test@example.com',
			password: 'Ab1!',
		});

		expect(response.status).toBe(400);
		expect(response.body.errors).toEqual(
			expect.arrayContaining([expect.objectContaining({ field: 'password' })]),
		);
		expect(createUserMock).not.toHaveBeenCalled();
	});

	it('rejects a password missing an uppercase letter', async () => {
		const app = express();
		app.use(express.json());
		app.use('/auth', AuthRouter);

		const response = await request(app).post('/auth/signup').send({
			email: 'test@example.com',
			password: 'password123!',
		});

		expect(response.status).toBe(400);
		expect(response.body.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					message: expect.stringContaining('uppercase'),
				}),
			]),
		);
		expect(createUserMock).not.toHaveBeenCalled();
	});

	it('rejects a password missing a special character', async () => {
		const app = express();
		app.use(express.json());
		app.use('/auth', AuthRouter);

		const response = await request(app).post('/auth/signup').send({
			email: 'test@example.com',
			password: 'Password123',
		});

		expect(response.status).toBe(400);
		expect(response.body.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					message: expect.stringContaining('special character'),
				}),
			]),
		);
		expect(createUserMock).not.toHaveBeenCalled();
	});

	it('returns a token on POST /auth/login for valid credentials', async () => {
		const app = express();
		app.use(express.json());
		app.use('/auth', AuthRouter);

		const response = await request(app).post('/auth/login').send({
			email: 'Test@Example.com',
			password: 'Password123!',
		});

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('token');
		expect(typeof response.body.token).toBe('string');
		expect(findUniqueMock).toHaveBeenCalledWith({
			where: { email: 'test@example.com' },
		});
	});

	it('returns 401 when POST /auth/login credentials are invalid', async () => {
		const app = express();
		app.use(express.json());
		app.use('/auth', AuthRouter);

		findUniqueMock.mockResolvedValueOnce(null);

		const response = await request(app).post('/auth/login').send({
			email: 'missing@example.com',
			password: 'Password123!',
		});

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ error: 'Invalid email or password' });
	});

	it('returns 400 when POST /auth/login body is invalid', async () => {
		const app = express();
		app.use(express.json());
		app.use('/auth', AuthRouter);

		const response = await request(app).post('/auth/login').send({
			email: 'invalid',
			password: '',
		});

		expect(response.status).toBe(400);
	});

	it('returns 204 on POST /auth/logout', async () => {
		const app = express();
		app.use(express.json());
		app.use('/auth', AuthRouter);

		const response = await request(app).post('/auth/logout').send({});

		expect(response.status).toBe(204);
	});
});
