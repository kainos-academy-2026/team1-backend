import type { JobRole, PrismaClient } from '../generated/prisma/client';
import type { JobRoleDao } from './jobRoleDao';

export class PrismaJobRoleDao implements JobRoleDao {
	constructor(private readonly prisma: PrismaClient) {}

	async findAll(): Promise<JobRole[]> {
		return this.prisma.jobRole.findMany();
	}
}
