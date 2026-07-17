import type { Application, JobRole } from '../generated/prisma/client.js';
import type { Status } from '../generated/prisma/enums.js';
import type {
	ApplicationWithUser,
	JobRoleWithDetails,
} from './prismaJobRoleDao.js';

export interface CreateApplicationData {
	userId: number;
	jobRoleId: number;
	cvURL: string;
}

export interface JobRoleDao {
	findAll(limit: number, offset: number): Promise<JobRoleWithDetails[]>;
	count(): Promise<number>;
	findById(jobRoleId: number): Promise<JobRoleWithDetails | null>;
	createApplication(data: CreateApplicationData): Promise<Application>;
	findApplicationsByJobRoleId(
		jobRoleId: number,
	): Promise<ApplicationWithUser[]>;
	findApplicationById(applicationId: number): Promise<Application | null>;
	updateApplicationStatus(
		applicationId: number,
		status: Status,
	): Promise<Application>;
	decrementOpenPositions(jobRoleId: number): Promise<JobRole>;
}
