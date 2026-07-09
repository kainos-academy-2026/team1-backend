import { describe, expect, it, vi } from 'vitest';
import { PrismaUserDao } from '../../src/daos/prismaUserDao';

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
		});

		expect(prisma.user.create).toHaveBeenCalledWith({
			data: {
				email: 'test@example.com',
				password: 'hashed-password',
				role: 'USER',
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
			dao.createUser({ email: 'test@example.com', password: 'hashed-password' }),
		).rejects.toThrow('database failed');
	});
});
