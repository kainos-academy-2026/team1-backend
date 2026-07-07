import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { JobRoleController } from '../../src/controllers/jobRoleController';

describe('JobRoleController', () => {
	it('returns 200 with job roles when the service succeeds', async () => {
		const jobRoles = [{ id: 1, roleName: 'Engineer' }];
		const jobRoleService = {
			findAll: vi.fn().mockResolvedValue(jobRoles),
		};
		const controller = new JobRoleController(jobRoleService as never);
		const req = {} as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.getAll(req, res);

		expect(jobRoleService.findAll).toHaveBeenCalledOnce();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(jobRoles);
	});

	it('returns 500 when the service throws', async () => {
		const jobRoleService = {
			findAll: vi.fn().mockRejectedValue(new Error('database failed')),
		};
		const controller = new JobRoleController(jobRoleService as never);
		const req = {} as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.getAll(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			error: 'Internal server error',
		});
	});
});