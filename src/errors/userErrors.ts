export class UserNotFoundError extends Error {
	constructor() {
		super('User not found');
		this.name = 'UserNotFoundError';
	}
}

export class InvalidCredentialsError extends Error {
	constructor() {
		super('Invalid credentials');
		this.name = 'InvalidCredentialsError';
	}
}

export class DuplicateEmailError extends Error {
	constructor() {
		super('Email already in use');
		this.name = 'DuplicateEmailError';
	}
}
