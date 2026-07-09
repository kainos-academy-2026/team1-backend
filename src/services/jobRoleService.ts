import type { JobRoleDao } from '../daos/jobRoleDao';
import type JobRoleMapper from '../mappers/jobRoleMapper';
import type { JobRole } from '../models/jobRole';

export class JobRoleService {
	constructor(
		private readonly jobRoleDao: JobRoleDao,
		private readonly jobRoleMapper: JobRoleMapper,
	) {}

	async findAll(): Promise<JobRole[]> {
		const rows = await this.jobRoleDao.findAll();
		return rows.map((row) => this.jobRoleMapper.toDomain(row));
	}
}
