import { hash } from 'argon2';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type SignupResponse from '../../src/dtos/signupResponse';
import type UserMapper from '../../src/mappers/userMapper';
import { UserService } from '../../src/services/userService';

vi.mock('argon2', () => ({
	hash: vi.fn(),
}));

describe('UserService', () => {
	beforeEach(() => {
		vi.mocked(hash).mockReset();
	});

	it('hashes the password before creating a user and returns mapped response', async () => {
		vi.mocked(hash).mockResolvedValue('hashed-password');

		const createdUser = {
			userId: 1,
			email: 'test@example.com',
			password: 'hashed-password',
			role: 'USER',
		};
		const response = {
			id: 1,
			email: 'test@example.com',
			role: 'USER',
		} as SignupResponse;

		const userDao = {
			createUser: vi.fn().mockResolvedValue(createdUser),
		};
		const userMapper = {
			toSignupResponse: vi.fn().mockReturnValue(response),
		} as unknown as UserMapper;

		const service = new UserService(userDao, userMapper);

		const result = await service.createUser({
			email: 'test@example.com',
			password: 'Password123!',
		});

		expect(hash).toHaveBeenCalledWith('Password123!');
		expect(userDao.createUser).toHaveBeenCalledWith({
			email: 'test@example.com',
			password: 'hashed-password',
		});
		expect(userMapper.toSignupResponse).toHaveBeenCalledWith(createdUser);
		expect(result).toEqual(response);
	});

	it('propagates errors thrown by the DAO', async () => {
		vi.mocked(hash).mockResolvedValue('hashed-password');

		const userDao = {
			createUser: vi.fn().mockRejectedValue(new Error('database failed')),
		};
		const userMapper = {
			toSignupResponse: vi.fn(),
		} as unknown as UserMapper;

		const service = new UserService(userDao, userMapper);

		await expect(
			service.createUser({
				email: 'test@example.com',
				password: 'Password123!',
			}),
		).rejects.toThrow('database failed');

		expect(userMapper.toSignupResponse).not.toHaveBeenCalled();
	});
});
