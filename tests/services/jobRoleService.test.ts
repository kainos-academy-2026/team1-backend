import { describe, expect, it, vi } from 'vitest';
import type JobRoleDetailedResponse from '../../src/dtos/jobRoleDetailedResponse.js';
import type JobRoleResponse from '../../src/dtos/jobRoleResponse.js';
import { JobRoleNotOpenError } from '../../src/errors/jobRoleNotOpenError.js';
import type { JobRole } from '../../src/generated/prisma/client.js';
import type JobRoleMapper from '../../src/mappers/jobRoleMapper.js';
import { JobRoleService } from '../../src/services/jobRoleService.js';
import type { S3Service } from '../../src/services/s3Service.js';

function createS3ServiceMock(): S3Service {
	return {
		getPresignedUploadUrl: vi.fn(),
	} as unknown as S3Service;
}

describe('JobRoleService', () => {
	const rows = [
		{
			jobRoleId: 1,
			roleName: 'Engineer',
			location: 'Belfast',
			capabilityId: 2,
			bandId: 3,
			closingDate: new Date('2026-07-01T00:00:00.000Z'),
			status: 'OPEN',
		},
	] as JobRole[];

	it('returns mapped job roles from the DAO', async () => {
		const responses = [
			{
				id: 1,
				roleName: 'Engineer',
				location: 'Belfast',
				capabilityId: 2,
				bandId: 3,
				closingDate: new Date(rows[0].closingDate),
				status: 'OPEN',
			},
		] as JobRoleResponse[];

		const jobRoleDao = {
			findAll: vi.fn().mockResolvedValue(rows),
			count: vi.fn().mockResolvedValue(1),
			findById: vi.fn(),
		};
		const jobRoleMapper = {
			toJobRoleResponse: vi.fn().mockReturnValue(responses[0]),
		} as unknown as JobRoleMapper;

		const service = new JobRoleService(
			jobRoleDao as never,
			jobRoleMapper,
			createS3ServiceMock(),
		);

		const result = await service.findAll(10, 0);

		expect(jobRoleDao.findAll).toHaveBeenCalledWith(10, 0);
		expect(jobRoleDao.count).toHaveBeenCalledOnce();
		expect(jobRoleMapper.toJobRoleResponse).toHaveBeenCalledWith(rows[0]);
		expect(result).toEqual({ data: responses, total: 1 });
	});

	it('returns an empty array when the DAO returns no rows', async () => {
		const jobRoleDao = {
			findAll: vi.fn().mockResolvedValue([]),
			count: vi.fn().mockResolvedValue(0),
			findById: vi.fn(),
		};
		const jobRoleMapper = {
			toJobRoleResponse: vi.fn(),
		} as unknown as JobRoleMapper;

		const service = new JobRoleService(
			jobRoleDao as never,
			jobRoleMapper,
			createS3ServiceMock(),
		);

		await expect(service.findAll(10, 0)).resolves.toEqual({
			data: [],
			total: 0,
		});
		expect(jobRoleMapper.toJobRoleResponse).not.toHaveBeenCalled();
	});

	it('propagates DAO errors', async () => {
		const error = new Error('database failed');
		const jobRoleDao = {
			findAll: vi.fn().mockRejectedValue(error),
			count: vi.fn().mockResolvedValue(1),
			findById: vi.fn(),
		};
		const jobRoleMapper = {
			toJobRoleResponse: vi.fn(),
		} as unknown as JobRoleMapper;

		const service = new JobRoleService(
			jobRoleDao as never,
			jobRoleMapper,
			createS3ServiceMock(),
		);

		await expect(service.findAll(10, 0)).rejects.toThrow('database failed');
	});

	it('returns null when the DAO returns no row', async () => {
		const jobRoleDao = {
			findAll: vi.fn(),
			count: vi.fn(),
			findById: vi.fn().mockResolvedValue(null),
		};

		const jobRoleMapper = {
			toJobRoleResponse: vi.fn(),
			toDetailedJobRoleResponse: vi.fn(),
		} as unknown as JobRoleMapper;

		const service = new JobRoleService(
			jobRoleDao as never,
			jobRoleMapper,
			createS3ServiceMock(),
		);

		await expect(service.findById(1)).resolves.toBeNull();
		expect(jobRoleMapper.toJobRoleResponse).not.toHaveBeenCalled();
		expect(jobRoleMapper.toDetailedJobRoleResponse).not.toHaveBeenCalled();
	});

	it('returns a mapped detailed job role when the DAO returns one row by id', async () => {
		const row = {
			jobRoleId: 1,
			roleName: 'Engineer',
			location: 'Belfast',
			capabilityId: 2,
			bandId: 3,
			closingDate: new Date('2026-07-01T00:00:00.000Z'),
			status: 'open',
			specification:
				'https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20-%20Software%20Engineer%20(Associate).pdf',
			description: 'Build and maintain backend services.',
			responsibilities: 'Design, implement, test, and support APIs.',
			numberOfOpenPositions: 2,
			capability: {
				capabilityId: 2,
				capabilityName: 'Engineering',
			},
			band: {
				bandId: 3,
				bandName: 'Associate',
			},
		} as JobRole & {
			capability: { capabilityId: number; capabilityName: string };
			band: { bandId: number; bandName: string };
		};

		const response = {
			id: 1,
			roleName: 'Engineer',
			location: 'Belfast',
			capabilityId: 2,
			capabilityName: 'Engineering',
			bandId: 3,
			bandName: 'Associate',
			closingDate: new Date(row.closingDate),
			status: 'OPEN',
			specification:
				'https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20-%20Software%20Engineer%20(Associate).pdf',
			description: 'Build and maintain backend services.',
			responsibilities: 'Design, implement, test, and support APIs.',
			numberOfOpenPositions: 2,
		} as JobRoleDetailedResponse;

		const jobRoleDao = {
			findAll: vi.fn(),
			count: vi.fn(),
			findById: vi.fn().mockResolvedValue(row),
		};

		const jobRoleMapper = {
			toJobRoleResponse: vi.fn(),
			toDetailedJobRoleResponse: vi.fn().mockReturnValue(response),
		} as unknown as JobRoleMapper;

		const service = new JobRoleService(
			jobRoleDao as never,
			jobRoleMapper,
			createS3ServiceMock(),
		);

		const result = await service.findById(1);

		expect(jobRoleDao.findById).toHaveBeenCalledWith(1);
		expect(jobRoleMapper.toDetailedJobRoleResponse).toHaveBeenCalledWith(row);
		expect(jobRoleMapper.toJobRoleResponse).not.toHaveBeenCalled();
		expect(result).toEqual(response);
	});

	it('propagates DAO errors for findById', async () => {
		const error = new Error('database failed');
		const jobRoleDao = {
			findAll: vi.fn(),
			count: vi.fn(),
			findById: vi.fn().mockRejectedValue(error),
		};
		const jobRoleMapper = {
			toJobRoleResponse: vi.fn(),
			toDetailedJobRoleResponse: vi.fn(),
		} as unknown as JobRoleMapper;

		const service = new JobRoleService(
			jobRoleDao as never,
			jobRoleMapper,
			createS3ServiceMock(),
		);

		await expect(service.findById(1)).rejects.toThrow('database failed');
		expect(jobRoleMapper.toDetailedJobRoleResponse).not.toHaveBeenCalled();
	});

	it('returns presigned upload data and creates an application when the role is open', async () => {
		const openJobRole = {
			jobRoleId: 2,
			status: 'open',
			numberOfOpenPositions: 3,
		};
		const jobRoleDao = {
			findById: vi.fn().mockResolvedValue(openJobRole),
			createApplication: vi.fn().mockResolvedValue(undefined),
		};
		const jobRoleMapper = {} as unknown as JobRoleMapper;
		const s3Service = createS3ServiceMock();
		vi.mocked(s3Service.getPresignedUploadUrl).mockResolvedValue({
			uploadUrl: 'https://s3.example.com/upload',
			key: 'job-applications/2/7/123-cv.pdf',
		});

		const service = new JobRoleService(
			jobRoleDao as never,
			jobRoleMapper,
			s3Service,
		);

		const result = await service.applyForJobRole(
			7,
			2,
			'cv.pdf',
			'application/pdf',
		);

		expect(jobRoleDao.findById).toHaveBeenCalledWith(2);
		expect(s3Service.getPresignedUploadUrl).toHaveBeenCalledWith(
			7,
			2,
			'cv.pdf',
			'application/pdf',
		);
		expect(jobRoleDao.createApplication).toHaveBeenCalledWith({
			userId: 7,
			jobRoleId: 2,
			cvURL: 'job-applications/2/7/123-cv.pdf',
		});
		expect(result).toEqual({
			uploadUrl: 'https://s3.example.com/upload',
			key: 'job-applications/2/7/123-cv.pdf',
		});
	});

	it('returns null when applying to a missing job role', async () => {
		const jobRoleDao = {
			findById: vi.fn().mockResolvedValue(null),
			createApplication: vi.fn(),
		};
		const jobRoleMapper = {} as unknown as JobRoleMapper;
		const s3Service = createS3ServiceMock();

		const service = new JobRoleService(
			jobRoleDao as never,
			jobRoleMapper,
			s3Service,
		);

		await expect(
			service.applyForJobRole(7, 2, 'cv.pdf', 'application/pdf'),
		).resolves.toBeNull();
		expect(s3Service.getPresignedUploadUrl).not.toHaveBeenCalled();
		expect(jobRoleDao.createApplication).not.toHaveBeenCalled();
	});

	it('throws when the job role is not open', async () => {
		const closedJobRole = {
			jobRoleId: 2,
			status: 'closed',
			numberOfOpenPositions: 3,
		};
		const jobRoleDao = {
			findById: vi.fn().mockResolvedValue(closedJobRole),
			createApplication: vi.fn(),
		};
		const jobRoleMapper = {} as unknown as JobRoleMapper;
		const s3Service = createS3ServiceMock();

		const service = new JobRoleService(
			jobRoleDao as never,
			jobRoleMapper,
			s3Service,
		);

		await expect(
			service.applyForJobRole(7, 2, 'cv.pdf', 'application/pdf'),
		).rejects.toThrow(JobRoleNotOpenError);
		expect(s3Service.getPresignedUploadUrl).not.toHaveBeenCalled();
		expect(jobRoleDao.createApplication).not.toHaveBeenCalled();
	});

	it('throws when the job role has no open positions', async () => {
		const noPositionsJobRole = {
			jobRoleId: 2,
			status: 'open',
			numberOfOpenPositions: 0,
		};
		const jobRoleDao = {
			findById: vi.fn().mockResolvedValue(noPositionsJobRole),
			createApplication: vi.fn(),
		};
		const jobRoleMapper = {} as unknown as JobRoleMapper;
		const s3Service = createS3ServiceMock();

		const service = new JobRoleService(
			jobRoleDao as never,
			jobRoleMapper,
			s3Service,
		);

		await expect(
			service.applyForJobRole(7, 2, 'cv.pdf', 'application/pdf'),
		).rejects.toThrow(JobRoleNotOpenError);
		expect(s3Service.getPresignedUploadUrl).not.toHaveBeenCalled();
		expect(jobRoleDao.createApplication).not.toHaveBeenCalled();
	});

	it('returns application responses with presigned download URLs', async () => {
		const applications = [
			{
				applicationId: 1,
				userId: 7,
				jobRoleId: 2,
				cvURL: 'job-applications/2/7/cv.pdf',
				status: 'IN_PROGRESS',
				dateApplied: new Date('2026-07-15T00:00:00.000Z'),
				user: { userId: 7, email: 'alice@example.com' },
			},
		];

		const jobRoleDao = {
			findApplicationsByJobRoleId: vi.fn().mockResolvedValue(applications),
		};
		const s3Service = {
			...createS3ServiceMock(),
			getPresignedDownloadUrl: vi
				.fn()
				.mockResolvedValue('https://s3.example.com/download'),
		} as unknown as S3Service;

		const service = new JobRoleService(
			jobRoleDao as never,
			{} as never,
			s3Service,
		);

		const result = await service.getApplicationsForJobRole(2);

		expect(jobRoleDao.findApplicationsByJobRoleId).toHaveBeenCalledWith(2);
		expect(s3Service.getPresignedDownloadUrl).toHaveBeenCalledWith(
			'job-applications/2/7/cv.pdf',
		);
		expect(result).toEqual([
			{
				applicationId: 1,
				userId: 7,
				userEmail: 'alice@example.com',
				status: 'IN_PROGRESS',
				dateApplied: new Date('2026-07-15T00:00:00.000Z'),
				cvPresignedUrl: 'https://s3.example.com/download',
			},
		]);
	});

	it('throws ApplicationNotFoundError when hiring a missing application', async () => {
		const { ApplicationNotFoundError } = await import(
			'../../src/errors/applicationNotFoundError.js'
		);
		const jobRoleDao = {
			findApplicationById: vi.fn().mockResolvedValue(null),
		};

		const service = new JobRoleService(
			jobRoleDao as never,
			{} as never,
			createS3ServiceMock(),
		);

		await expect(service.hireApplicant(99, 1)).rejects.toThrow(
			ApplicationNotFoundError,
		);
	});

	it('throws ApplicationNotInProgressError when hiring a non-in-progress application', async () => {
		const { ApplicationNotInProgressError } = await import(
			'../../src/errors/applicationNotInProgressError.js'
		);
		const jobRoleDao = {
			findApplicationById: vi
				.fn()
				.mockResolvedValue({ applicationId: 1, status: 'HIRED' }),
		};

		const service = new JobRoleService(
			jobRoleDao as never,
			{} as never,
			createS3ServiceMock(),
		);

		await expect(service.hireApplicant(1, 2)).rejects.toThrow(
			ApplicationNotInProgressError,
		);
	});

	it('updates status to HIRED and decrements open positions', async () => {
		const jobRoleDao = {
			findApplicationById: vi
				.fn()
				.mockResolvedValue({ applicationId: 1, status: 'IN_PROGRESS' }),
			updateApplicationStatus: vi.fn().mockResolvedValue(undefined),
			decrementOpenPositions: vi.fn().mockResolvedValue(undefined),
		};

		const service = new JobRoleService(
			jobRoleDao as never,
			{} as never,
			createS3ServiceMock(),
		);

		await service.hireApplicant(1, 2);

		expect(jobRoleDao.updateApplicationStatus).toHaveBeenCalledWith(1, 'HIRED');
		expect(jobRoleDao.decrementOpenPositions).toHaveBeenCalledWith(2);
	});

	it('throws ApplicationNotFoundError when rejecting a missing application', async () => {
		const { ApplicationNotFoundError } = await import(
			'../../src/errors/applicationNotFoundError.js'
		);
		const jobRoleDao = {
			findApplicationById: vi.fn().mockResolvedValue(null),
		};

		const service = new JobRoleService(
			jobRoleDao as never,
			{} as never,
			createS3ServiceMock(),
		);

		await expect(service.rejectApplicant(99)).rejects.toThrow(
			ApplicationNotFoundError,
		);
	});

	it('throws ApplicationNotInProgressError when rejecting a non-in-progress application', async () => {
		const { ApplicationNotInProgressError } = await import(
			'../../src/errors/applicationNotInProgressError.js'
		);
		const jobRoleDao = {
			findApplicationById: vi
				.fn()
				.mockResolvedValue({ applicationId: 1, status: 'REJECTED' }),
		};

		const service = new JobRoleService(
			jobRoleDao as never,
			{} as never,
			createS3ServiceMock(),
		);

		await expect(service.rejectApplicant(1)).rejects.toThrow(
			ApplicationNotInProgressError,
		);
	});

	it('updates status to REJECTED', async () => {
		const jobRoleDao = {
			findApplicationById: vi
				.fn()
				.mockResolvedValue({ applicationId: 1, status: 'IN_PROGRESS' }),
			updateApplicationStatus: vi.fn().mockResolvedValue(undefined),
		};

		const service = new JobRoleService(
			jobRoleDao as never,
			{} as never,
			createS3ServiceMock(),
		);

		await service.rejectApplicant(1);

		expect(jobRoleDao.updateApplicationStatus).toHaveBeenCalledWith(
			1,
			'REJECTED',
		);
	});
});
