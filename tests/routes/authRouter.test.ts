import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AuthRouter from '../../src/routes/authRouter';

const { createUserMock } = vi.hoisted(() => ({
	createUserMock: vi.fn(),
}));

vi.hoisted(() => {
	process.env.DATABASE_URL = 'postgresql://test:test@localhost/test';
});

vi.mock('argon2', () => ({
	hash: vi.fn().mockResolvedValue('hashed-password'),
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
		};
	},
}));

describe('AuthRouter', () => {
	beforeEach(() => {
		createUserMock.mockReset();
		createUserMock.mockResolvedValue({
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
		expect(response.body).toEqual({
			id: 1,
			email: 'test@example.com',
			role: 'USER',
		});
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
});
