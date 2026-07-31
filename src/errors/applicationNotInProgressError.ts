export class ApplicationNotInProgressError extends Error {
	constructor() {
		super('Application is not in progress');
		this.name = 'ApplicationNotInProgressError';
	}
}
