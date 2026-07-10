import { describe, expect, it, vi } from 'vitest';
import type JobRoleDetailedResponse from '../../src/dtos/jobRoleDetailedResponse.js';
import type JobRoleResponse from '../../src/dtos/jobRoleResponse.js';
import type { JobRole } from '../../src/generated/prisma/client.js';
import type JobRoleMapper from '../../src/mappers/jobRoleMapper.js';
import { JobRoleService } from '../../src/services/jobRoleService.js';

describe('JobRoleService', () => {
	const rows = [
		{
			jobRoleId: 1,
			roleName: 'Engineer',
			location: 'Belfast',
			capabilityId: 2,
			bandId: 3,
			closingDate: new Date('2026-07-01T00:00:00.000Z'),
			status: 'open',
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
				status: 'open',
			},
		] as JobRoleResponse[];

		const jobRoleDao = {
			findAll: vi.fn().mockResolvedValue(rows),
			findById: vi.fn(),
		};
		const jobRoleMapper = {
			toJobRoleResponse: vi.fn().mockReturnValue(responses[0]),
		} as unknown as JobRoleMapper;

		const service = new JobRoleService(jobRoleDao as never, jobRoleMapper);

		const result = await service.findAll();

		expect(jobRoleDao.findAll).toHaveBeenCalledOnce();
		expect(jobRoleMapper.toJobRoleResponse).toHaveBeenCalledWith(rows[0]);
		expect(result).toEqual(responses);
	});

	it('returns an empty array when the DAO returns no rows', async () => {
		const jobRoleDao = {
			findAll: vi.fn().mockResolvedValue([]),
			findById: vi.fn(),
		};
		const jobRoleMapper = {
			toJobRoleResponse: vi.fn(),
		} as unknown as JobRoleMapper;

		const service = new JobRoleService(jobRoleDao as never, jobRoleMapper);

		await expect(service.findAll()).resolves.toEqual([]);
		expect(jobRoleMapper.toJobRoleResponse).not.toHaveBeenCalled();
	});

	it('propagates DAO errors', async () => {
		const error = new Error('database failed');
		const jobRoleDao = {
			findAll: vi.fn().mockRejectedValue(error),
			findById: vi.fn(),
		};
		const jobRoleMapper = {
			toJobRoleResponse: vi.fn(),
		} as unknown as JobRoleMapper;

		const service = new JobRoleService(jobRoleDao as never, jobRoleMapper);

		await expect(service.findAll()).rejects.toThrow('database failed');
	});

	it('returns null when the DAO returns no row', async () => {
		const jobRoleDao = {
			findById: vi.fn().mockResolvedValue(null),
		};

		const jobRoleMapper = {
			toJobRoleResponse: vi.fn(),
			toDetailedJobRoleResponse: vi.fn(),
		} as unknown as JobRoleMapper;

		const service = new JobRoleService(jobRoleDao as never, jobRoleMapper);

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
			status: 'open',
			specification:
				'https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20-%20Software%20Engineer%20(Associate).pdf',
			description: 'Build and maintain backend services.',
			responsibilities: 'Design, implement, test, and support APIs.',
			numberOfOpenPositions: 2,
		} as JobRoleDetailedResponse;

		const jobRoleDao = {
			findById: vi.fn().mockResolvedValue(row),
		};

		const jobRoleMapper = {
			toJobRoleResponse: vi.fn(),
			toDetailedJobRoleResponse: vi.fn().mockReturnValue(response),
		} as unknown as JobRoleMapper;

		const service = new JobRoleService(jobRoleDao as never, jobRoleMapper);

		const result = await service.findById(1);

		expect(jobRoleDao.findById).toHaveBeenCalledWith(1);
		expect(jobRoleMapper.toDetailedJobRoleResponse).toHaveBeenCalledWith(row);
		expect(jobRoleMapper.toJobRoleResponse).not.toHaveBeenCalled();
		expect(result).toEqual(response);
	});

	it('propagates DAO errors for findById', async () => {
		const error = new Error('database failed');
		const jobRoleDao = {
			findById: vi.fn().mockRejectedValue(error),
		};
		const jobRoleMapper = {
			toJobRoleResponse: vi.fn(),
			toDetailedJobRoleResponse: vi.fn(),
		} as unknown as JobRoleMapper;

		const service = new JobRoleService(jobRoleDao as never, jobRoleMapper);

		await expect(service.findById(1)).rejects.toThrow('database failed');
		expect(jobRoleMapper.toDetailedJobRoleResponse).not.toHaveBeenCalled();
	});
});
