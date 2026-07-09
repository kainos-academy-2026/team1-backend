import type { JobRoleWithDetails } from '../daos/prismaJobRoleDao.js';
import type JobRoleDetailedResponse from '../dtos/jobRoleDetailedResponse.js';
import type JobRoleResponse from '../dtos/jobRoleResponse.js';
import type { JobRole } from '../generated/prisma/client.js';
import { JobRoleStatus } from '../models/jobRole.js';

export default class JobRoleMapper {
	private toJobRoleStatus(status: string): JobRoleStatus {
		switch (status) {
			case JobRoleStatus.OPEN:
			case JobRoleStatus.CLOSED:
				return status;
			default:
				throw new Error(`Invalid job role status: ${status}`);
		}
	}

	toJobRoleResponse(jobRole: JobRole): JobRoleResponse {
		return {
			id: jobRole.jobRoleId,
			roleName: jobRole.roleName,
			location: jobRole.location,
			capabilityId: jobRole.capabilityId,
			bandId: jobRole.bandId,
			closingDate: new Date(jobRole.closingDate),
			status: this.toJobRoleStatus(jobRole.status),
		};
	}

	toDetailedJobRoleResponse(
		jobRole: JobRoleWithDetails,
	): JobRoleDetailedResponse {
		return {
			id: jobRole.jobRoleId,
			roleName: jobRole.roleName,
			location: jobRole.location,
			capabilityId: jobRole.capability.capabilityId,
			capabilityName: jobRole.capability.capabilityName,
			bandId: jobRole.band.bandId,
			bandName: jobRole.band.bandName,
			status: jobRole.status,
			closingDate: new Date(jobRole.closingDate),
			specification: jobRole.specification,
			description: jobRole.description,
			responsibilities: jobRole.responsibilities,
			numberOfOpenPositions: jobRole.numberOfOpenPositions,
		};
	}
}