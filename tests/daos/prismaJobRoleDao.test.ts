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
				capability: {
					capabilityId: 2,
					capabilityName: 'Data and AI',
				},
				band: {
					bandId: 3,
					bandName: 'Consultant',
				},
			},
		];

		const prisma = {
			jobRole: {
				findMany: vi.fn().mockResolvedValue(rows),
				count: vi.fn(),
			},
		};

		const dao = new PrismaJobRoleDao(prisma as never);

		const result = await dao.findAll(10, 20);

		expect(prisma.jobRole.findMany).toHaveBeenCalledWith({
			include: {
				capability: true,
				band: true,
			},
			orderBy: { jobRoleId: 'asc' },
			take: 10,
			skip: 20,
		});
		expect(result).toBe(rows);
	});

	it('requests total job role count', async () => {
		const prisma = {
			jobRole: {
				findMany: vi.fn(),
				count: vi.fn().mockResolvedValue(42),
				findUnique: vi.fn(),
			},
		};

		const dao = new PrismaJobRoleDao(prisma as never);

		const result = await dao.count();

		expect(prisma.jobRole.count).toHaveBeenCalledOnce();
		expect(result).toBe(42);
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
				findMany: vi.fn(),
				count: vi.fn(),
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
				count: vi.fn(),
			},
		};

		const dao = new PrismaJobRoleDao(prisma as never);

		await expect(dao.findAll(10, 0)).rejects.toThrow('database failed');
	});

	it('propagates errors thrown by prisma', async () => {
		const prisma = {
			jobRole: {
				count: vi.fn().mockRejectedValue(new Error('database failed')),
			},
		};

		const dao = new PrismaJobRoleDao(prisma as never);

		await expect(dao.count()).rejects.toThrow('database failed');
	});
});
