import { JobRoleStatus } from '../models/jobRole';

export default interface JobRoleResponse {
	id: Number,
	roleName: String,
	location: String,
	capabilityId: Number,
	bandId: Number,
	closingDate: String,
	status: JobRoleStatus,
}