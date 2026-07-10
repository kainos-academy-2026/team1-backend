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

	it('returns 400 when the job role ID is invalid', async () => {
		const jobRoleService = {
			findById: vi.fn(),
		};
		const controller = new JobRoleController(jobRoleService as never);
		const req = {
			params: { jobRoleId: 'invalid' },
		} as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.getById(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			error: 'Invalid job role ID',
		});
	});

	it('returns 404 when the job role is not found', async () => {
		const jobRoleService = {
			findById: vi.fn().mockResolvedValue(null),
		};
		const controller = new JobRoleController(jobRoleService as never);
		const req = {
			params: { jobRoleId: '1' },
		} as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.getById(req, res);

		expect(jobRoleService.findById).toHaveBeenCalledWith(1);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			error: 'Job role not found',
		});
	});

	it('returns 200 with the job role when found', async () => {
		const jobRole = { id: 1, roleName: 'Engineer' };
		const jobRoleService = {
			findById: vi.fn().mockResolvedValue(jobRole),
		};
		const controller = new JobRoleController(jobRoleService as never);
		const req = {
			params: { jobRoleId: '1' },
		} as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.getById(req, res);

		expect(jobRoleService.findById).toHaveBeenCalledWith(1);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(jobRole);
	});
});
