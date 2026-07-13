import { describe, expect, it, vi } from 'vitest';
import { PrismaUserDao } from '../../src/daos/prismaUserDao';
import { UserRole } from '../../src/models/user';

describe('PrismaUserDao', () => {
	it('creates a user with the USER role and returns the result', async () => {
		const created = {
			userId: 1,
			email: 'test@example.com',
			password: 'hashed-password',
			role: 'USER',
		};

		const prisma = {
			user: {
				create: vi.fn().mockResolvedValue(created),
			},
		};

		const dao = new PrismaUserDao(prisma as never);

		const result = await dao.createUser({
			email: 'test@example.com',
			password: 'hashed-password',
			role: UserRole.USER,
		});

		expect(prisma.user.create).toHaveBeenCalledWith({
			data: {
				email: 'test@example.com',
				password: 'hashed-password',
				role: UserRole.USER,
			},
		});
		expect(result).toBe(created);
	});

	it('propagates errors thrown by prisma', async () => {
		const prisma = {
			user: {
				create: vi.fn().mockRejectedValue(new Error('database failed')),
			},
		};

		const dao = new PrismaUserDao(prisma as never);

		await expect(
			dao.createUser({
				email: 'test@example.com',
				password: 'hashed-password',
			}),
		).rejects.toThrow('database failed');
	});

	it('uses the provided role when one is supplied', async () => {
		const created = {
			userId: 2,
			email: 'admin@example.com',
			password: 'hashed-password',
			role: 'ADMIN',
		};

		const prisma = {
			user: {
				create: vi.fn().mockResolvedValue(created),
			},
		};

		const dao = new PrismaUserDao(prisma as never);

		const result = await dao.createUser({
			email: 'admin@example.com',
			password: 'hashed-password',
			role: UserRole.ADMIN,
		});

		expect(prisma.user.create).toHaveBeenCalledWith({
			data: {
				email: 'admin@example.com',
				password: 'hashed-password',
				role: 'ADMIN',
			},
		});
		expect(result).toBe(created);
	});

	it('finds a user by email', async () => {
		const foundUser = {
			userId: 1,
			email: 'test@example.com',
			password: 'hashed-password',
			role: 'USER',
		};

		const prisma = {
			user: {
				create: vi.fn(),
				findUnique: vi.fn().mockResolvedValue(foundUser),
			},
		};

		const dao = new PrismaUserDao(prisma as never);
		const result = await dao.findUserByEmail('test@example.com');

		expect(prisma.user.findUnique).toHaveBeenCalledWith({
			where: { email: 'test@example.com' },
		});
		expect(result).toBe(foundUser);
	});
});
