import type { Application, JobRole } from '../generated/prisma/client.js';
import type { JobRoleWithDetails } from './prismaJobRoleDao.js';

export interface CreateApplicationData {
	userId: number;
	jobRoleId: number;
	cvURL: string;
}

export interface JobRoleDao {
	findAll(): Promise<JobRole[]>;
	findById(jobRoleId: number): Promise<JobRoleWithDetails | null>;
	createApplication(data: CreateApplicationData): Promise<Application>;
}
