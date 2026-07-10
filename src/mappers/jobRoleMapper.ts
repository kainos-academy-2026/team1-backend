import { JobRoleWithDetails } from '../daos/prismaJobRoleDao';
import JobRoleDetailedResponse from '../dtos/jobRoleDetailedResponse';
import type JobRoleResponse from '../dtos/jobRoleResponse';
import type { JobRole } from '../generated/prisma/client';

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

	toDetailedJobRoleResponse(jobRole: JobRoleWithDetails): JobRoleDetailedResponse {
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
};
