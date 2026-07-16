export class DuplicateEmailError extends Error {
	constructor() {
		super('Email already in use');
		this.name = 'DuplicateEmailError';
	}
}
