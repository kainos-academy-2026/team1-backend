import { describe, expect, it, vi } from 'vitest';
import type { JobRole as PrismaJobRole } from '../../src/generated/prisma/client';
import type JobRoleMapper from '../../src/mappers/jobRoleMapper';
import { JobRoleStatus } from '../../src/models/jobRole';
import { JobRoleService } from '../../src/services/jobRoleService';

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
	] as PrismaJobRole[];

	it('returns mapped job roles from the DAO', async () => {
		const domainRoles = [
			{
				jobRoleId: 1,
				roleName: 'Engineer',
				location: 'Belfast',
				capabilityId: 2,
				bandId: 3,
				closingDate: new Date('2026-07-01T00:00:00.000Z'),
				status: JobRoleStatus.OPEN,
			},
		];

		const jobRoleDao = {
			findAll: vi.fn().mockResolvedValue(rows),
		};
		const jobRoleMapper = {
			toDomain: vi.fn().mockReturnValue(domainRoles[0]),
		} as unknown as JobRoleMapper;

		const service = new JobRoleService(jobRoleDao, jobRoleMapper);

		const result = await service.findAll();

		expect(jobRoleDao.findAll).toHaveBeenCalledOnce();
		expect(jobRoleMapper.toDomain).toHaveBeenCalledWith(rows[0]);
		expect(result).toEqual(domainRoles);
	});

	it('returns an empty array when the DAO returns no rows', async () => {
		const jobRoleDao = {
			findAll: vi.fn().mockResolvedValue([]),
		};
		const jobRoleMapper = {
			toDomain: vi.fn(),
		} as unknown as JobRoleMapper;

		const service = new JobRoleService(jobRoleDao, jobRoleMapper);

		await expect(service.findAll()).resolves.toEqual([]);
		expect(jobRoleMapper.toDomain).not.toHaveBeenCalled();
	});

	it('propagates DAO errors', async () => {
		const error = new Error('database failed');
		const jobRoleDao = {
			findAll: vi.fn().mockRejectedValue(error),
		};
		const jobRoleMapper = {
			toDomain: vi.fn(),
		} as unknown as JobRoleMapper;

		const service = new JobRoleService(jobRoleDao, jobRoleMapper);

		await expect(service.findAll()).rejects.toThrow('database failed');
	});
});
