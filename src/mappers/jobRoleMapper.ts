import type { JobRoleWithDetails } from '../daos/prismaJobRoleDao.js';
import type JobRoleDetailedResponse from '../dtos/jobRoleDetailedResponse.js';
import type JobRoleResponse from '../dtos/jobRoleResponse.js';
import type { JobRole } from '../generated/prisma/client.js';

export default class JobRoleMapper {
	toJobRoleResponse(jobRole: JobRole): JobRoleResponse {
		return {
			id: jobRole.jobRoleId,
			roleName: jobRole.roleName,
			location: jobRole.location,
			capabilityId: jobRole.capabilityId,
			bandId: jobRole.bandId,
			closingDate: new Date(jobRole.closingDate),
			status: jobRole.status,
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
			specification: jobRole.specification,
			description: jobRole.description,
			responsibilities: jobRole.responsibilities,
			numberOfOpenPositions: jobRole.numberOfOpenPositions,
			closingDate: new Date(jobRole.closingDate),
		};
	}
}
