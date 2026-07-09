import type { JobRoleStatus } from '../generated/prisma/client';

export default interface JobRoleResponse {
	id: number;
	roleName: string;
	location: string;
	capabilityId: number;
	bandId: number;
	closingDate: Date;
	status: JobRoleStatus;
}
