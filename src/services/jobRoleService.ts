import type { JobRoleDao } from '../daos/jobRoleDao.js';
import type JobRoleDetailedResponse from '../dtos/jobRoleDetailedResponse.js';
import type JobRoleResponse from '../dtos/jobRoleResponse.js';
import type JobRoleMapper from '../mappers/jobRoleMapper.js';

export class JobRoleService {
	constructor(
		private readonly jobRoleDao: JobRoleDao,
		private readonly jobRoleMapper: JobRoleMapper,
	) {}

	async findAll(): Promise<JobRoleResponse[]> {
		const jobRoles = await this.jobRoleDao.findAll();
		return jobRoles.map((jobRole) =>
			this.jobRoleMapper.toJobRoleResponse(jobRole),
		);
	}

	async findById(jobRoleId: number): Promise<JobRoleDetailedResponse | null> {
		const jobRole = await this.jobRoleDao.findById(jobRoleId);
		if (!jobRole) {
			return null;
		}
		return this.jobRoleMapper.toDetailedJobRoleResponse(jobRole);
	}
}
