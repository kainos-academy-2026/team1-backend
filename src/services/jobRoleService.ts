import type { JobRoleDao } from '../daos/jobRoleDao';
import type { JobRoleResponse } from '../dtos/jobRoleResponse';
import type JobRoleMapper from '../mappers/jobRoleMapper';

export class JobRoleService {
	constructor(
		private readonly jobRoleDao: JobRoleDao,
		private readonly jobRoleMapper: JobRoleMapper,
	) {}

	async findAll(): Promise<JobRoleResponse[]> {
		const rows = await this.jobRoleDao.findAll();
		const jobRoles = rows.map((row) => this.jobRoleMapper.toDomain(row));
		const response: JobRoleResponse[] = jobRoles.map((jobRole) =>
			this.jobRoleMapper.toJobRoleResponse(jobRole),
		);
		return response;
	}
}
