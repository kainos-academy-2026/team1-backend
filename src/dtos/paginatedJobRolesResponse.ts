import type JobRoleResponse from './jobRoleResponse.js';

export default interface PaginatedJobRolesResponse {
	data: JobRoleResponse[];
	total: number;
}
