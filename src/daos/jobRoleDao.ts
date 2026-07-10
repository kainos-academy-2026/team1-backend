import type { JobRole } from '../generated/prisma/client.js';

export interface JobRoleDao {
	findAll(): Promise<JobRole[]>;
}
