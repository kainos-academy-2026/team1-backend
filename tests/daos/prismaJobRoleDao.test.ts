import { describe, expect, it, vi } from 'vitest';
import { PrismaJobRoleDao } from '../../src/daos/prismaJobRoleDao.js';

describe('PrismaJobRoleDao', () => {
	it('requests all job roles ordered by id ascending', async () => {
		const rows = [
			{
				jobRoleId: 1,
				roleName: 'Engineer',
				location: 'Belfast',
				capabilityId: 2,
				bandId: 3,
				closingDate: new Date(),
				status: 'OPEN',
			},
		];

		const prisma = {
			jobRole: {
				findMany: vi.fn().mockResolvedValue(rows),
			},
		};

		const dao = new PrismaJobRoleDao(prisma as never);

		const result = await dao.findAll();

		expect(prisma.jobRole.findMany).toHaveBeenCalledWith({
			orderBy: { jobRoleId: 'asc' },
		});
		expect(result).toBe(rows);
	});

	it('requests a job role by id', async () => {
		const row = {
			jobRoleId: 1,
			roleName: 'Engineer',
			location: 'Belfast',
			capabilityId: 2,
			bandId: 3,
			closingDate: new Date(),
			status: 'open',
			capability: {
				capabilityId: 2,
				capabilityName: 'Engineering',
			},
			band: {
				bandId: 3,
				bandName: 'Associate',
			},
		};

		const prisma = {
			jobRole: {
				findUnique: vi.fn().mockResolvedValue(row),
			},
		};

		const dao = new PrismaJobRoleDao(prisma as never);

		const result = await dao.findById(1);

		expect(prisma.jobRole.findUnique).toHaveBeenCalledWith({
			where: { jobRoleId: 1 },
			include: {
				capability: true,
				band: true,
			},
		});
		expect(result).toBe(row);
	});

	it('propagates errors thrown by prisma', async () => {
		const prisma = {
			jobRole: {
				findMany: vi.fn().mockRejectedValue(new Error('database failed')),
			},
		};

		const dao = new PrismaJobRoleDao(prisma as never);

		await expect(dao.findAll()).rejects.toThrow('database failed');
	});

	it('creates an application with in progress status', async () => {
		const created = {
			applicationId: 1,
			userId: 7,
			jobRoleId: 2,
			cvURL: 'job-applications/2/7/123-cv.pdf',
			status: 'IN_PROGRESS',
			dateApplied: new Date('2026-07-15T00:00:00.000Z'),
		};

		const prisma = {
			application: {
				create: vi.fn().mockResolvedValue(created),
			},
		};

		const dao = new PrismaJobRoleDao(prisma as never);

		const result = await dao.createApplication({
			userId: 7,
			jobRoleId: 2,
			cvURL: 'job-applications/2/7/123-cv.pdf',
		});

		expect(prisma.application.create).toHaveBeenCalledWith({
			data: {
				userId: 7,
				jobRoleId: 2,
				cvURL: 'job-applications/2/7/123-cv.pdf',
				status: 'IN_PROGRESS',
			},
		});
		expect(result).toBe(created);
	});
});
