import type { PrismaClient } from '../generated/prisma/client';
import type { JobRole } from '../models/jobRole';
import type { JobRoleDao } from './jobRoleDao';

export class PrismaJobRoleDao implements JobRoleDao {
	constructor(private readonly prisma: PrismaClient) {}

	async findAll(): Promise<JobRole[]> {
		const rows = await this.prisma.jobRole.findMany({
			orderBy: { jobRoleId: 'asc' },
		});

		return rows;
	}
}
