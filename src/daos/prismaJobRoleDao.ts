import type { JobRole, Prisma, PrismaClient } from '../generated/prisma/client.js';
import type { JobRoleDao } from './jobRoleDao.js';

export type JobRoleWithDetails = Prisma.JobRoleGetPayload<{
	include: {
		capability: true;
		band: true;
	};
}>;

export class PrismaJobRoleDao implements JobRoleDao {
	constructor(private readonly prisma: PrismaClient) {}

	async findAll(): Promise<JobRole[]> {
		const rows = await this.prisma.jobRole.findMany({
			orderBy: { jobRoleId: 'asc' },
		});

		return rows;
	}

	async findById(jobRoleId: number): Promise<JobRoleWithDetails | null> {
		const row = await this.prisma.jobRole.findUnique({
			where: { jobRoleId },
			include: {
				capability: true,
				band: true,
			},
		});
		return row;
	}
}
