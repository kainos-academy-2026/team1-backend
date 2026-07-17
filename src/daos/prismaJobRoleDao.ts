import type {
	Application,
	Prisma,
	PrismaClient,
} from '../generated/prisma/client.js';
import { Status } from '../generated/prisma/enums.js';
import type { CreateApplicationData, JobRoleDao } from './jobRoleDao.js';

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
}
