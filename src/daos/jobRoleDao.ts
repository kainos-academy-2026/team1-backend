import type { JobRole } from '../generated/prisma/client.js';
import type { JobRoleWithDetails } from './prismaJobRoleDao.js';

export interface JobRoleDao {
	findAll(): Promise<JobRole[]>;
	findById(jobRoleId: number): Promise<JobRoleWithDetails | null>;
}
