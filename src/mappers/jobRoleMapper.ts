import type { JobRoleResponse } from '../dtos/jobRoleResponse';
import { JobRoleResponseSchema } from '../dtos/jobRoleResponse';
import type { JobRole as PrismaJobRole } from '../generated/prisma/client';
import type { JobRole } from '../models/jobRole';
import { JobRoleStatus } from '../models/jobRole';

export default class JobRoleMapper {
	toJobRoleResponse(jobRole: JobRole): JobRoleResponse {
		return JobRoleResponseSchema.parse({
			id: jobRole.jobRoleId,
			roleName: jobRole.roleName,
			location: jobRole.location,
			capabilityId: jobRole.capabilityId,
			bandId: jobRole.bandId,
			closingDate: jobRole.closingDate.toISOString().slice(0, 19).replace('T', ' '),
			status: jobRole.status,
		});
	}

	toDomain(jobRole: PrismaJobRole): JobRole {
		return {
			jobRoleId: jobRole.jobRoleId,
			roleName: jobRole.roleName,
			location: jobRole.location,
			capabilityId: jobRole.capabilityId,
			bandId: jobRole.bandId,
			closingDate: jobRole.closingDate,
			status: this.toStatus(jobRole.status),
		};
	}

	private toStatus(status: string): JobRoleStatus {
		if (status === JobRoleStatus.OPEN) return JobRoleStatus.OPEN;
		if (status === JobRoleStatus.CLOSED) return JobRoleStatus.CLOSED;
		throw new Error(`Invalid job role status: ${status}`);
	}
}
