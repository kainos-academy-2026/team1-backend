import type { PrismaClient } from '../generated/prisma/client';
import { JobRole } from '../models/jobRole';
import type { JobRoleDao } from './jobRoleDao';

export class PrismaJobRoleDao implements JobRoleDao {
	constructor(private readonly prisma: PrismaClient) {}

	async findAll(): Promise<JobRole[]> {
		const rows = await this.prisma.jobRole.findMany({
			orderBy: { jobRoleId: 'asc' },
		});

		return rows.map(
			(row) =>
				new JobRole(
					row.jobRoleId,
					row.roleName,
					row.location,
					row.capabilityId,
					row.bandId,
					row.closingDate,
					row.status,
				),
		);
	}
}
