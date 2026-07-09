import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { UserController } from '../../src/controllers/userController';

describe('UserController', () => {
	it('returns 201 with signup response when the service succeeds', async () => {
		const signupResponse = {
			id: 1,
			email: 'test@example.com',
			role: 'USER',
		};
		const userService = {
			createUser: vi.fn().mockResolvedValue(signupResponse),
		};
		const controller = new UserController(userService as never);
		const req = {
			body: { email: 'test@example.com', password: 'Password123!' },
		} as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.createUser(req, res);

		expect(userService.createUser).toHaveBeenCalledWith({
			email: 'test@example.com',
			password: 'Password123!',
		});
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith(signupResponse);
	});

	it('returns 500 when the service throws', async () => {
		const userService = {
			createUser: vi.fn().mockRejectedValue(new Error('database failed')),
		};
		const controller = new UserController(userService as never);
		const req = {
			body: { email: 'test@example.com', password: 'Password123!' },
		} as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.createUser(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			error: 'Internal server error',
		});
	});
});
