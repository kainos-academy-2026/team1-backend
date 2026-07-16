import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { JobRoleController } from '../../src/controllers/jobRoleController.js';

describe('JobRoleController', () => {
	it('returns 200 with job roles when the service succeeds', async () => {
		const jobRoles = {
			data: [{ id: 1, roleName: 'Engineer' }],
			total: 1,
		};
		const jobRoleService = {
			findAll: vi.fn().mockResolvedValue(jobRoles),
		};
		const controller = new JobRoleController(jobRoleService as never);
		const req = { query: {} } as unknown as Request;
		const res = {
			set: vi.fn().mockReturnThis(),
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.getAll(req, res);

		expect(jobRoleService.findAll).toHaveBeenCalledWith(10, 0);
		expect(res.set).toHaveBeenCalledWith('X-Total-Count', '1');
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(jobRoles.data);
	});

	it('returns 200 and forwards parsed pagination params', async () => {
		const jobRoleService = {
			findAll: vi.fn().mockResolvedValue({ data: [], total: 12 }),
		};
		const controller = new JobRoleController(jobRoleService as never);
		const req = {
			query: { limit: '20', offset: '40' },
		} as unknown as Request;
		const res = {
			set: vi.fn().mockReturnThis(),
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.getAll(req, res);

		expect(jobRoleService.findAll).toHaveBeenCalledWith(20, 40);
		expect(res.set).toHaveBeenCalledWith('X-Total-Count', '12');
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith([]);
	});

	it('returns 400 when pagination params are invalid', async () => {
		const jobRoleService = {
			findAll: vi.fn(),
		};
		const controller = new JobRoleController(jobRoleService as never);
		const req = {
			query: { limit: 'abc', offset: '0' },
		} as unknown as Request;
		const res = {
			set: vi.fn().mockReturnThis(),
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.getAll(req, res);

		expect(jobRoleService.findAll).not.toHaveBeenCalled();
		expect(res.set).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			error:
				'Invalid pagination parameters. limit must be >= 1 and offset must be >= 0',
		});
	});

	it('returns 400 when pagination params are out of range', async () => {
		const jobRoleService = {
			findAll: vi.fn(),
		};
		const controller = new JobRoleController(jobRoleService as never);
		const req = {
			query: { limit: '0', offset: '-1' },
		} as unknown as Request;
		const res = {
			set: vi.fn().mockReturnThis(),
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.getAll(req, res);

		expect(jobRoleService.findAll).not.toHaveBeenCalled();
		expect(res.set).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(400);
	});

	it('returns 500 when the service throws', async () => {
		const jobRoleService = {
			findAll: vi.fn().mockRejectedValue(new Error('database failed')),
		};
		const controller = new JobRoleController(jobRoleService as never);
		const req = { query: {} } as unknown as Request;
		const res = {
			set: vi.fn().mockReturnThis(),
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.getAll(req, res);

		expect(res.set).not.toHaveBeenCalled();
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
