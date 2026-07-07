import { PrismaClient } from '../generated/prisma/client';
import type { CreateJobRoleInput, JobRoleDao, UpdateJobRoleInput } from './jobRoleDao';
import { JobRole } from '../models/jobRole';

export class PrismaJobRoleDao implements JobRoleDao {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<JobRole[]> {
    const rows = await this.prisma.jobRole.findMany({
      orderBy: { jobRoleId: 'asc' },
    });

    return rows.map(this.toDomain);
  }

  async findById(jobRoleId: number): Promise<JobRole | null> {
    const row = await this.prisma.jobRole.findUnique({
      where: { jobRoleId },
    });

    return row ? this.toDomain(row) : null;
  }

  async create(input: CreateJobRoleInput): Promise<JobRole> {
    const row = await this.prisma.jobRole.create({
      data: {
        roleName: input.roleName,
        location: input.location,
        capabilityId: input.capabilityId,
        bandId: input.bandId,
        closingDate: input.closingDate,
        status: input.status,
      },
    });

    return this.toDomain(row);
  }

  async update(jobRoleId: number, input: UpdateJobRoleInput): Promise<JobRole | null> {
    const exists = await this.prisma.jobRole.findUnique({
      where: { jobRoleId },
      select: { jobRoleId: true },
    });

    if (!exists) return null;

    const row = await this.prisma.jobRole.update({
      where: { jobRoleId },
      data: {
        roleName: input.roleName,
        location: input.location,
        capabilityId: input.capabilityId,
        bandId: input.bandId,
        closingDate: input.closingDate,
        status: input.status,
      },
    });

    return this.toDomain(row);
  }

  async delete(jobRoleId: number): Promise<boolean> {
    const result = await this.prisma.jobRole.deleteMany({
      where: { jobRoleId },
    });

    return result.count > 0;
  }

  private toDomain(row: {
    jobRoleId: number;
    roleName: string;
    location: string;
    capabilityId: number;
    bandId: number;
    closingDate: string;
    status: string;
  }): JobRole {
    return new JobRole(
      row.jobRoleId,
      row.roleName,
      row.location,
      row.capabilityId,
      row.bandId,
      row.closingDate,
      row.status
    );
  }
}