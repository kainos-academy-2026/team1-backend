import { hash } from 'argon2';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserRole } from '../../src/models/user';
import { UserService } from '../../src/services/userService';

vi.mock('argon2', () => ({
	hash: vi.fn(),
}));

describe('UserService', () => {
	beforeEach(() => {
		vi.mocked(hash).mockReset();
	});

	it('hashes the password before creating a user', async () => {
		vi.mocked(hash).mockResolvedValue('hashed-password');

		const createdUser = {
			userId: 1,
			email: 'test@example.com',
			password: 'hashed-password',
			role: UserRole.USER,
		};

		const userDao = {
			createUser: vi.fn().mockResolvedValue(createdUser),
		};

		const service = new UserService(userDao);

		await service.createUser({
			email: 'test@example.com',
			password: 'Password123!',
		});

		expect(hash).toHaveBeenCalledWith('Password123!');
		expect(userDao.createUser).toHaveBeenCalledWith({
			email: 'test@example.com',
			password: 'hashed-password',
			role: UserRole.USER,
		});
	});

	it('propagates errors thrown by the DAO', async () => {
		vi.mocked(hash).mockResolvedValue('hashed-password');

		const userDao = {
			createUser: vi.fn().mockRejectedValue(new Error('database failed')),
		};

		const service = new UserService(userDao);

		await expect(
			service.createUser({
				email: 'test@example.com',
				password: 'Password123!',
			}),
		).rejects.toThrow('database failed');
	});
});
