import type { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginController } from '../../src/controllers/loginController';
import { InvalidCredentialsError } from '../../src/errors/invalidCredentialsError';
import { UserNotFoundError } from '../../src/errors/userNotFoundError';

describe('LoginController', () => {
	const loginMock = vi.fn();
	const statusMock = vi.fn();
	const jsonMock = vi.fn();

	beforeEach(() => {
		vi.resetAllMocks();
		statusMock.mockReturnThis();
	});

	it('returns 200 and token when login succeeds', async () => {
		loginMock.mockResolvedValue({ token: 'jwt-token' });
		const controller = new LoginController({ login: loginMock } as never);
		const req = {
			body: { email: 'test@example.com', password: 'Password123!' },
		} as Request;
		const res = {
			status: statusMock,
			json: jsonMock,
		} as unknown as Response;

		await controller.login(req, res);

		expect(statusMock).toHaveBeenCalledWith(200);
		expect(jsonMock).toHaveBeenCalledWith({ token: 'jwt-token' });
	});

	it('returns 401 for invalid credentials', async () => {
		loginMock.mockRejectedValue(new InvalidCredentialsError());
		const controller = new LoginController({ login: loginMock } as never);
		const req = {
			body: { email: 'test@example.com', password: 'wrong' },
		} as Request;
		const res = {
			status: statusMock,
			json: jsonMock,
		} as unknown as Response;

		await controller.login(req, res);

		expect(statusMock).toHaveBeenCalledWith(401);
		expect(jsonMock).toHaveBeenCalledWith({
			error: 'Invalid email or password',
		});
	});

	it('returns 401 when user is not found', async () => {
		loginMock.mockRejectedValue(new UserNotFoundError());
		const controller = new LoginController({ login: loginMock } as never);
		const req = {
			body: { email: 'missing@example.com', password: 'Password123!' },
		} as Request;
		const res = {
			status: statusMock,
			json: jsonMock,
		} as unknown as Response;

		await controller.login(req, res);

		expect(statusMock).toHaveBeenCalledWith(401);
		expect(jsonMock).toHaveBeenCalledWith({
			error: 'Invalid email or password',
		});
	});

	it('returns 500 for unexpected errors', async () => {
		loginMock.mockRejectedValue(new Error('token provider down'));
		const controller = new LoginController({ login: loginMock } as never);
		const req = {
			body: { email: 'test@example.com', password: 'Password123!' },
		} as Request;
		const res = {
			status: statusMock,
			json: jsonMock,
		} as unknown as Response;

		await controller.login(req, res);

		expect(statusMock).toHaveBeenCalledWith(500);
		expect(jsonMock).toHaveBeenCalledWith({ error: 'Internal server error' });
	});
});
