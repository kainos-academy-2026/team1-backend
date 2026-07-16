import type { JobRole } from '../generated/prisma/client.js';
import type { JobRoleWithDetails } from './prismaJobRoleDao.js';

export interface JobRoleDao {
	findAll(limit: number, offset: number): Promise<JobRole[]>;
	count(): Promise<number>;
	findById(jobRoleId: number): Promise<JobRoleWithDetails | null>;
}
