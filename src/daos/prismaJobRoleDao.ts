import type {
	Application,
	JobRole,
	Prisma,
	PrismaClient,
} from '../generated/prisma/client.js';
import { Status } from '../generated/prisma/enums.js';
import type { CreateApplicationData, JobRoleDao } from './jobRoleDao.js';

const JOB_ROLE_INCLUDE = { capability: true, band: true } as const;
const APPLICATION_WITH_USER_INCLUDE = { user: true } as const;

export type ApplicationWithUser = Prisma.ApplicationGetPayload<{
	include: typeof APPLICATION_WITH_USER_INCLUDE;
}>;

export type JobRoleWithDetails = Prisma.JobRoleGetPayload<{
	include: typeof JOB_ROLE_INCLUDE;
}>;

export class PrismaJobRoleDao implements JobRoleDao {
	constructor(private readonly prisma: PrismaClient) {}

	async findAll(limit: number, offset: number): Promise<JobRoleWithDetails[]> {
		const rows = await this.prisma.jobRole.findMany({
			include: JOB_ROLE_INCLUDE,
			orderBy: { jobRoleId: 'asc' },
			take: limit,
			skip: offset,
		});

		return rows;
	}

	async count(): Promise<number> {
		return this.prisma.jobRole.count();
	}

	async findById(jobRoleId: number): Promise<JobRoleWithDetails | null> {
		const row = await this.prisma.jobRole.findUnique({
			where: { jobRoleId },
			include: JOB_ROLE_INCLUDE,
		});
		return row;
	}

	async createApplication(data: CreateApplicationData): Promise<Application> {
		return this.prisma.application.create({
			data: {
				userId: data.userId,
				jobRoleId: data.jobRoleId,
				cvURL: data.cvURL,
				status: Status.IN_PROGRESS,
			},
		});
	}

	async findApplicationsByJobRoleId(
		jobRoleId: number,
	): Promise<ApplicationWithUser[]> {
		return this.prisma.application.findMany({
			where: { jobRoleId },
			include: APPLICATION_WITH_USER_INCLUDE,
			orderBy: { dateApplied: 'asc' },
		});
	}

	async findApplicationById(
		applicationId: number,
	): Promise<Application | null> {
		return this.prisma.application.findUnique({
			where: { applicationId },
		});
	}

	async updateApplicationStatus(
		applicationId: number,
		status: Status,
	): Promise<Application> {
		return this.prisma.application.update({
			where: { applicationId },
			data: { status },
		});
	}

	async decrementOpenPositions(jobRoleId: number): Promise<JobRole> {
		return this.prisma.jobRole.update({
			where: { jobRoleId },
			data: { numberOfOpenPositions: { decrement: 1 } },
		});
	}
}
