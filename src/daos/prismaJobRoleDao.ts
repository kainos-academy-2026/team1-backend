import type {
	Application,
	JobRole,
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

	async findAll(): Promise<JobRole[]> {
		const rows = await this.prisma.jobRole.findMany({
			orderBy: { jobRoleId: 'asc' },
		});

		return rows;
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
