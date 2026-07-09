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
});
