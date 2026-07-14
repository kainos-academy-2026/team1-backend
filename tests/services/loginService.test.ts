import { verify } from 'argon2';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { InvalidCredentialsError } from '../../src/errors/invalidCredentialsError';
import { UserNotFoundError } from '../../src/errors/userNotFoundError';
import { LoginService } from '../../src/services/loginService';

vi.mock('argon2', () => ({
	verify: vi.fn(),
}));

describe('LoginService', () => {
	beforeEach(() => {
		vi.mocked(verify).mockReset();
	});

	it('normalizes email before lookup and returns token when credentials are valid', async () => {
		const userDao = {
			findUserByEmail: vi.fn().mockResolvedValue({
				userId: 1,
				email: 'test@example.com',
				password: 'hashed-password',
				role: 'USER',
			}),
		};
		const tokenService = {
			create: vi.fn().mockResolvedValue('jwt-token'),
		};
		vi.mocked(verify).mockResolvedValue(true);

		const service = new LoginService(userDao as never, tokenService as never);

		const result = await service.login({
			email: ' Test@Example.com ',
			password: 'Password123!',
		});

		expect(userDao.findUserByEmail).toHaveBeenCalledWith('test@example.com');
		expect(verify).toHaveBeenCalledWith('hashed-password', 'Password123!');
		expect(tokenService.create).toHaveBeenCalledWith(
			expect.objectContaining({ userId: 1 }),
		);
		expect(result).toEqual({ token: 'jwt-token' });
	});

	it('throws UserNotFoundError when user does not exist', async () => {
		const userDao = {
			findUserByEmail: vi.fn().mockResolvedValue(null),
		};
		const tokenService = {
			create: vi.fn(),
		};

		const service = new LoginService(userDao as never, tokenService as never);

		await expect(
			service.login({ email: 'missing@example.com', password: 'Password123!' }),
		).rejects.toThrow(UserNotFoundError);
		expect(verify).not.toHaveBeenCalled();
		expect(tokenService.create).not.toHaveBeenCalled();
	});

	it('throws InvalidCredentialsError when password is invalid', async () => {
		const userDao = {
			findUserByEmail: vi.fn().mockResolvedValue({
				userId: 2,
				email: 'test@example.com',
				password: 'hashed-password',
				role: 'USER',
			}),
		};
		const tokenService = {
			create: vi.fn(),
		};
		vi.mocked(verify).mockResolvedValue(false);

		const service = new LoginService(userDao as never, tokenService as never);

		await expect(
			service.login({ email: 'test@example.com', password: 'wrong-password' }),
		).rejects.toThrow(InvalidCredentialsError);
		expect(tokenService.create).not.toHaveBeenCalled();
	});
});
