import type { JobRole } from '../models/jobRole';
import type { JobRoleResponse } from '../models/jobRoleResponse';

export function toJobRoleResponse(jobRole: JobRole): JobRoleResponse {
	return {
		id: jobRole.jobRoleId,
		roleName: jobRole.roleName,
		location: jobRole.location,
		capabilityId: jobRole.capabilityId,
		bandId: jobRole.bandId,
		closingDate: jobRole.closingDate,
		status: jobRole.status,
	};
}
