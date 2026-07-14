import type { RequestHandler } from 'express';
import {
	InsufficientRoleError,
	InvalidTokenError,
	MissingTokenError,
} from '../errors/authErrors.js';
import type { UserRole } from '../models/user.js';
import { JoseTokenService } from '../services/joseTokenService.js';

export function authenticate(): RequestHandler {
	return async (req, res, next) => {
		const authHeader = req.headers.authorization;
		const tokenService = new JoseTokenService();
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			sendAuthError(res, new MissingTokenError());
			return;
		}

		const token = authHeader.split(' ')[1];
		try {
			const payload = await tokenService.verify(token);
			req.user = payload;
			next();
		} catch {
			sendAuthError(res, new InvalidTokenError());
		}
	};
}

export function authorize(allowedRoles: UserRole[]): RequestHandler {
	return (req, res, next) => {
		if (!req.user) {
			sendAuthError(res, new MissingTokenError());
			return;
		}
		if (!allowedRoles.includes(req.user.role)) {
			sendAuthError(res, new InsufficientRoleError());
			return;
		}
		next();
	};
}

export const authorise = authorize;

function sendAuthError(
	res: Parameters<RequestHandler>[1],
	error: MissingTokenError | InvalidTokenError | InsufficientRoleError,
): void {
	if (error instanceof InsufficientRoleError) {
		res.status(403).json({ message: error.message });
		return;
	}

	res.status(401).json({ message: error.message });
}
