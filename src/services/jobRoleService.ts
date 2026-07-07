import type { JobRoleDao } from '../daos/jobRoleDao';
import type { JobRole } from '../models/jobRole';

export class JobRoleService {
	constructor(private readonly jobRoleDao: JobRoleDao) {}

	async findAll(): Promise<JobRole[]> {
		return this.jobRoleDao.findAll();
	}
}
