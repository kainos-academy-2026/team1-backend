import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { JobRoleController } from '../../src/controllers/jobRoleController';
import type { JobRoleResponse } from '../../src/dtos/jobRoleResponse';
import { JobRoleStatus } from '../../src/models/jobRole';

describe('JobRoleController', () => {
	it('returns 200 with job roles when the service succeeds', async () => {
		const responseRoles: JobRoleResponse[] = [
			{
				id: 1,
				roleName: 'Engineer',
				location: 'Belfast',
				capabilityId: 2,
				bandId: 3,
				closingDate: '2026-07-01 00:00:00',
				status: JobRoleStatus.OPEN,
			},
		];

		const jobRoleService = {
			findAll: vi.fn().mockResolvedValue(responseRoles),
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
		expect(res.json).toHaveBeenCalledWith(responseRoles);
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