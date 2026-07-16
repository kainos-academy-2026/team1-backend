import type { JobRoleDao } from '../daos/jobRoleDao.js';
import type JobRoleDetailedResponse from '../dtos/jobRoleDetailedResponse.js';
import type JobRoleResponse from '../dtos/jobRoleResponse.js';
import type PaginatedJobRolesResponse from '../dtos/paginatedJobRolesResponse.js';
import type JobRoleMapper from '../mappers/jobRoleMapper.js';

export class JobRoleService {
	constructor(
		private readonly jobRoleDao: JobRoleDao,
		private readonly jobRoleMapper: JobRoleMapper,
	) {}

	async findAll(
		limit: number,
		offset: number,
	): Promise<PaginatedJobRolesResponse> {
		const [jobRoles, total] = await Promise.all([
			this.jobRoleDao.findAll(limit, offset),
			this.jobRoleDao.count(),
		]);

		const data: JobRoleResponse[] = jobRoles.map((jobRole) =>
			this.jobRoleMapper.toJobRoleResponse(jobRole),
		);

		return { data, total };
	}

	async findById(jobRoleId: number): Promise<JobRoleDetailedResponse | null> {
		const jobRole = await this.jobRoleDao.findById(jobRoleId);
		if (!jobRole) {
			return null;
		}
		return this.jobRoleMapper.toDetailedJobRoleResponse(jobRole);
	}
}
