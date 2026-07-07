import { describe, expect, it, vi } from 'vitest';
import type { JobRole } from '../../src/generated/prisma/client';
import type { JobRoleResponse } from '../../src/dtos/jobRoleResponse';
import type JobRoleMapper from '../../src/mappers/jobRoleMapper';
import { JobRoleService } from '../../src/services/jobRoleService';

describe('JobRoleService', () => {
	const rows = [
		{
			jobRoleId: 1,
			roleName: 'Engineer',
			location: 'Belfast',
			capabilityId: 2,
			bandId: 3,
			closingDate: '2026-07-01T00:00:00.000Z',
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
		};
		const jobRoleMapper = {
			toJobRoleResponse: vi.fn().mockReturnValue(responses[0]),
		} as unknown as JobRoleMapper;

		const service = new JobRoleService(jobRoleDao, jobRoleMapper);

		const result = await service.findAll();

		expect(jobRoleDao.findAll).toHaveBeenCalledOnce();
		expect(jobRoleMapper.toJobRoleResponse).toHaveBeenCalledWith(
			rows[0],
			0,
			rows,
		);
		expect(result).toEqual(responses);
	});

	it('returns an empty array when the DAO returns no rows', async () => {
		const jobRoleDao = {
			findAll: vi.fn().mockResolvedValue([]),
		};
		const jobRoleMapper = {
			toJobRoleResponse: vi.fn(),
		} as unknown as JobRoleMapper;

		const service = new JobRoleService(jobRoleDao, jobRoleMapper);

		await expect(service.findAll()).resolves.toEqual([]);
		expect(jobRoleMapper.toJobRoleResponse).not.toHaveBeenCalled();
	});

	it('propagates DAO errors', async () => {
		const error = new Error('database failed');
		const jobRoleDao = {
			findAll: vi.fn().mockRejectedValue(error),
		};
		const jobRoleMapper = {
			toJobRoleResponse: vi.fn(),
		} as unknown as JobRoleMapper;

		const service = new JobRoleService(jobRoleDao, jobRoleMapper);

		await expect(service.findAll()).rejects.toThrow('database failed');
	});
});