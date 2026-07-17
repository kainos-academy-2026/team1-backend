import type {
	Application,
	Prisma,
	PrismaClient,
} from '../generated/prisma/client.js';
import { Status } from '../generated/prisma/enums.js';
import type { CreateApplicationData, JobRoleDao } from './jobRoleDao.js';

export type ApplicationWithUser = Prisma.ApplicationGetPayload<{
	include: { user: true };
}>;

export type JobRoleWithDetails = Prisma.JobRoleGetPayload<{
	include: {
		capability: true;
		band: true;
	};
}>;

export class PrismaJobRoleDao implements JobRoleDao {
	constructor(private readonly prisma: PrismaClient) {}

	async findAll(limit: number, offset: number): Promise<JobRoleWithDetails[]> {
		const rows = await this.prisma.jobRole.findMany({
			include: {
				capability: true,
				band: true,
			},
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
			include: {
				capability: true,
				band: true,
			},
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
			include: { user: true },
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
	): Promise<void> {
		await this.prisma.application.update({
			where: { applicationId },
			data: { status },
		});
	}

	async decrementOpenPositions(jobRoleId: number): Promise<void> {
		await this.prisma.jobRole.update({
			where: { jobRoleId },
			data: { numberOfOpenPositions: { decrement: 1 } },
		});
	}
}
