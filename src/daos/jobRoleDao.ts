import type { JobRole } from '../generated/prisma/client';
import { JobRoleWithDetails } from './prismaJobRoleDao';

export interface JobRoleDao {
	findAll(): Promise<JobRole[]>;
	findById(jobRoleId: number): Promise<JobRoleWithDetails | null>;
}
