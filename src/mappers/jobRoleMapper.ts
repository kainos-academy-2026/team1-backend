import type { JobRoleResponse } from '../dtos/jobRoleResponse';
import type { JobRole } from '../generated/prisma/client';

export default class JobRoleMapper {
	toJobRoleResponse(jobRole: JobRole): JobRoleResponse {
		return {
			id: jobRole.jobRoleId,
			roleName: jobRole.roleName,
			location: jobRole.location,
			capabilityId: jobRole.capabilityId,
			bandId: jobRole.bandId,
			closingDate: jobRole.closingDate,
			status: jobRole.status as JobRoleResponse['status'],
		};
	}
}
