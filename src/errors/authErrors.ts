export class MissingTokenError extends Error {
	constructor() {
		super('Missing authentication token');
		this.name = 'MissingTokenError';
	}
}

export class InvalidTokenError extends Error {
	constructor() {
		super('Invalid authentication token');
		this.name = 'InvalidTokenError';
	}
}

export class InsufficientRoleError extends Error {
	constructor() {
		super('Insufficient role');
		this.name = 'InsufficientRoleError';
	}
}

export class JWTKeyNotSetError extends Error {
	constructor() {
		super('JWT secret key is not set');
		this.name = 'JWTKeyNotSetError';
	}
}
