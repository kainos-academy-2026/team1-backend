import type { JobRoleDao } from '../daos/jobRoleDao';
import type { JobRole } from '../models/jobRole';
import {toJobRole} from '../mappers/jobRoleMapper';

export class JobRoleService {
	constructor(private readonly jobRoleDao: JobRoleDao) {}

	async findAll(): Promise<JobRole[]> {
		const jobRoles = await this.jobRoleDao.findAll();
		return jobRoles.map(toJobRole);
	}
}
