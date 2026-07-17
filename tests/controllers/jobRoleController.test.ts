import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { JobRoleController } from '../../src/controllers/jobRoleController.js';
import { JobRoleNotOpenError } from '../../src/errors/jobRoleNotOpenError.js';
import { UserRole } from '../../src/models/user.js';

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

	it('returns 400 when applying with an invalid job role ID', async () => {
		const jobRoleService = {
			applyForJobRole: vi.fn(),
		};
		const controller = new JobRoleController(jobRoleService as never);
		const req = {
			params: { jobRoleId: 'invalid' },
			body: { fileName: 'cv.pdf', contentType: 'application/pdf' },
			user: { sub: '1', email: 'test@example.com', role: UserRole.USER },
		} as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.applyForJobRole(req, res);

		expect(jobRoleService.applyForJobRole).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			error: 'Invalid job role ID',
		});
	});

	it('returns 404 when applying to a missing job role', async () => {
		const jobRoleService = {
			applyForJobRole: vi.fn().mockResolvedValue(null),
		};
		const controller = new JobRoleController(jobRoleService as never);
		const req = {
			params: { jobRoleId: '1' },
			body: { fileName: 'cv.pdf', contentType: 'application/pdf' },
			user: { sub: '1', email: 'test@example.com', role: UserRole.USER },
		} as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.applyForJobRole(req, res);

		expect(jobRoleService.applyForJobRole).toHaveBeenCalledWith(
			1,
			1,
			'cv.pdf',
			'application/pdf',
		);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			error: 'Job role not found',
		});
	});

	it('returns 409 when the job role is not open for applications', async () => {
		const jobRoleService = {
			applyForJobRole: vi.fn().mockRejectedValue(new JobRoleNotOpenError()),
		};
		const controller = new JobRoleController(jobRoleService as never);
		const req = {
			params: { jobRoleId: '1' },
			body: { fileName: 'cv.pdf', contentType: 'application/pdf' },
			user: { sub: '1', email: 'test@example.com', role: UserRole.USER },
		} as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.applyForJobRole(req, res);

		expect(res.status).toHaveBeenCalledWith(409);
		expect(res.json).toHaveBeenCalledWith({
			error: 'Job role is not open for applications',
		});
	});

	it('returns 200 with presigned upload data when applying succeeds', async () => {
		const presignedUpload = {
			uploadUrl: 'https://s3.example.com/upload',
			key: 'job-applications/1/1/123-cv.pdf',
		};
		const jobRoleService = {
			applyForJobRole: vi.fn().mockResolvedValue(presignedUpload),
		};
		const controller = new JobRoleController(jobRoleService as never);
		const req = {
			params: { jobRoleId: '1' },
			body: { fileName: 'cv.pdf', contentType: 'application/pdf' },
			user: { sub: '1', email: 'test@example.com', role: UserRole.USER },
		} as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.applyForJobRole(req, res);

		expect(jobRoleService.applyForJobRole).toHaveBeenCalledWith(
			1,
			1,
			'cv.pdf',
			'application/pdf',
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(presignedUpload);
	});

	it('returns 400 when job role ID is invalid for getApplicationsForJobRole', async () => {
		const jobRoleService = { getApplicationsForJobRole: vi.fn() };
		const controller = new JobRoleController(jobRoleService as never);
		const req = { params: { jobRoleId: 'invalid' } } as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.getApplicationsForJobRole(req, res);

		expect(jobRoleService.getApplicationsForJobRole).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(400);
	});

	it('returns 200 with applications list', async () => {
		const applications = [
			{
				applicationId: 1,
				userId: 7,
				userEmail: 'alice@example.com',
				status: 'IN_PROGRESS',
				dateApplied: new Date(),
				cvPresignedUrl: 'https://s3.example.com/download',
			},
		];
		const jobRoleService = {
			getApplicationsForJobRole: vi.fn().mockResolvedValue(applications),
		};
		const controller = new JobRoleController(jobRoleService as never);
		const req = { params: { jobRoleId: '2' } } as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.getApplicationsForJobRole(req, res);

		expect(jobRoleService.getApplicationsForJobRole).toHaveBeenCalledWith(2);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(applications);
	});

	it('returns 400 when application ID is invalid for hireApplicant', async () => {
		const jobRoleService = { hireApplicant: vi.fn() };
		const controller = new JobRoleController(jobRoleService as never);
		const req = {
			params: { jobRoleId: '1', applicationId: 'invalid' },
		} as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.hireApplicant(req, res);

		expect(jobRoleService.hireApplicant).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(400);
	});

	it('returns 404 when hireApplicant throws ApplicationNotFoundError', async () => {
		const { ApplicationNotFoundError } = await import(
			'../../src/errors/applicationNotFoundError.js'
		);
		const jobRoleService = {
			hireApplicant: vi.fn().mockRejectedValue(new ApplicationNotFoundError()),
		};
		const controller = new JobRoleController(jobRoleService as never);
		const req = {
			params: { jobRoleId: '1', applicationId: '99' },
		} as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.hireApplicant(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: 'Application not found' });
	});

	it('returns 409 when hireApplicant throws ApplicationNotInProgressError', async () => {
		const { ApplicationNotInProgressError } = await import(
			'../../src/errors/applicationNotInProgressError.js'
		);
		const jobRoleService = {
			hireApplicant: vi
				.fn()
				.mockRejectedValue(new ApplicationNotInProgressError()),
		};
		const controller = new JobRoleController(jobRoleService as never);
		const req = {
			params: { jobRoleId: '1', applicationId: '1' },
		} as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.hireApplicant(req, res);

		expect(res.status).toHaveBeenCalledWith(409);
		expect(res.json).toHaveBeenCalledWith({
			error: 'Application is not in progress',
		});
	});

	it('returns 200 when hireApplicant succeeds', async () => {
		const jobRoleService = {
			hireApplicant: vi.fn().mockResolvedValue(undefined),
		};
		const controller = new JobRoleController(jobRoleService as never);
		const req = {
			params: { jobRoleId: '2', applicationId: '1' },
		} as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.hireApplicant(req, res);

		expect(jobRoleService.hireApplicant).toHaveBeenCalledWith(1, 2);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ message: 'Applicant hired' });
	});

	it('returns 400 when application ID is invalid for rejectApplicant', async () => {
		const jobRoleService = { rejectApplicant: vi.fn() };
		const controller = new JobRoleController(jobRoleService as never);
		const req = {
			params: { applicationId: 'invalid' },
		} as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.rejectApplicant(req, res);

		expect(jobRoleService.rejectApplicant).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(400);
	});

	it('returns 404 when rejectApplicant throws ApplicationNotFoundError', async () => {
		const { ApplicationNotFoundError } = await import(
			'../../src/errors/applicationNotFoundError.js'
		);
		const jobRoleService = {
			rejectApplicant: vi
				.fn()
				.mockRejectedValue(new ApplicationNotFoundError()),
		};
		const controller = new JobRoleController(jobRoleService as never);
		const req = {
			params: { applicationId: '99' },
		} as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.rejectApplicant(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: 'Application not found' });
	});

	it('returns 200 when rejectApplicant succeeds', async () => {
		const jobRoleService = {
			rejectApplicant: vi.fn().mockResolvedValue(undefined),
		};
		const controller = new JobRoleController(jobRoleService as never);
		const req = {
			params: { applicationId: '1' },
		} as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;

		await controller.rejectApplicant(req, res);

		expect(jobRoleService.rejectApplicant).toHaveBeenCalledWith(1);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ message: 'Applicant rejected' });
	});
});
