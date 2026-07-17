export class JobRoleNotOpenError extends Error {
	constructor() {
		super('Job role is not open for applications');
		this.name = 'JobRoleNotOpenError';
	}
}
