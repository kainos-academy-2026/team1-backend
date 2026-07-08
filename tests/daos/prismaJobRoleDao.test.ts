import { describe, expect, it, vi } from 'vitest';
import { PrismaJobRoleDao } from '../../src/daos/prismaJobRoleDao';

describe('PrismaJobRoleDao', () => {
	it('requests all job roles ordered by id ascending', async () => {
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
});