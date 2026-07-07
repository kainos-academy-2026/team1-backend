import type { JobRoleDao } from '../daos/jobRoleDao';
import type { JobRoleResponse } from '../dtos/jobRoleResponse';
import type JobRoleMapper from '../mappers/jobRoleMapper';

export class JobRoleService {
	constructor(
		private readonly jobRoleDao: JobRoleDao,
		private readonly jobRoleMapper: JobRoleMapper,
	) { }

	async findAll(): Promise<JobRoleResponse[]> {
		const jobRoles = await this.jobRoleDao.findAll();
		// map each job role to a JobRoleResponse using the mapper
		return jobRoles.map((jobRole) => this.jobRoleMapper.toJobRoleResponse(jobRole));
	}
}