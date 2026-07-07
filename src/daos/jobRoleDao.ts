import type { JobRole } from '../models/jobRole';

export interface JobRoleDao {
	findAll(): Promise<JobRole[]>;
}
