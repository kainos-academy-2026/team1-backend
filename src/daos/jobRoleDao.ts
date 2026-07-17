import type { JobRoleWithDetails } from './prismaJobRoleDao.js';

export interface JobRoleDao {
	findAll(limit: number, offset: number): Promise<JobRoleWithDetails[]>;
	count(): Promise<number>;
	findById(jobRoleId: number): Promise<JobRoleWithDetails | null>;
}
