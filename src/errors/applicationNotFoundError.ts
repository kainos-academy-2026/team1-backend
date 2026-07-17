export class ApplicationNotFoundError extends Error {
	constructor() {
		super('Application not found');
		this.name = 'ApplicationNotFoundError';
	}
}
