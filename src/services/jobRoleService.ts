import type { JobRoleDao } from '../daos/jobRoleDao.js';
import type ApplyJobRoleResponse from '../dtos/ApplyJobRoleResponse.js';
import type JobRoleDetailedResponse from '../dtos/jobRoleDetailedResponse.js';
import type JobRoleResponse from '../dtos/jobRoleResponse.js';
import type PaginatedJobRolesResponse from '../dtos/paginatedJobRolesResponse.js';
import { JobRoleNotOpenError } from '../errors/jobRoleNotOpenError.js';
import type JobRoleMapper from '../mappers/jobRoleMapper.js';
import type { S3Service } from './s3Service.js';

export class JobRoleService {
	constructor(
		private readonly jobRoleDao: JobRoleDao,
		private readonly jobRoleMapper: JobRoleMapper,
		private readonly s3Service: S3Service,
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

	async applyForJobRole(
		userId: number,
		jobRoleId: number,
		fileName: string,
		contentType: string,
	): Promise<ApplyJobRoleResponse | null> {
		const jobRole = await this.jobRoleDao.findById(jobRoleId);
		if (!jobRole) {
			return null;
		}

		if (
			jobRole.status.toUpperCase() !== 'OPEN' ||
			jobRole.numberOfOpenPositions <= 0
		) {
			throw new JobRoleNotOpenError();
		}

		const { uploadUrl, key } = await this.s3Service.getPresignedUploadUrl(
			userId,
			jobRoleId,
			fileName,
			contentType,
		);

		await this.jobRoleDao.createApplication({ userId, jobRoleId, cvURL: key });

		return { uploadUrl, key };
	}
}
