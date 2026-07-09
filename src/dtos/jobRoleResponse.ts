import type { JobRoleStatus } from '../models/jobRole';

export default interface JobRoleResponse {
	id: number;
	roleName: string;
	location: string;
	capabilityId: number;
	bandId: number;
	closingDate: Date;
	status: JobRoleStatus;
}
