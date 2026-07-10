import type { JobRoleDao } from '../daos/jobRoleDao';
import type JobRoleDetailedResponse from '../dtos/jobRoleDetailedResponse';
import type JobRoleResponse from '../dtos/jobRoleResponse';
import type JobRoleMapper from '../mappers/jobRoleMapper';

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
