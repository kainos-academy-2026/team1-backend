import type { JobRole } from '../generated/prisma/client';

export interface JobRoleDao {
	findAll(): Promise<JobRole[]>;
}