export enum JobRoleStatus {
  OPEN = "open",
  CLOSED = "closed",
}

export class JobRole {
	constructor(
		public readonly jobRoleId: number,
		public readonly roleName: string,
		public readonly location: string,
		public readonly capabilityId: number,
		public readonly bandId: number,
		public readonly closingDate: Date,
		public readonly status: JobRoleStatus,
	) {
		if (jobRoleId <= 0) {
			throw new Error('ID must be greater than 0');
		}
		if (!roleName) {
			throw new Error('Role name is required');
		}
		if (!location) {
			throw new Error('Location is required');
		}
		if (!capabilityId) {
			throw new Error('Capability ID is required');
		}
		if (!closingDate) {
			throw new Error('Closing date is required');
		}
		if (!bandId) {
			throw new Error('Band ID is required');
		}
		if (!status) {
			throw new Error('Status is required');
		}
	}
}
