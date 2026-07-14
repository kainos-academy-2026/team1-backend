import type { RequestHandler } from 'express';
import type { UserRole } from '../models/user.js';
import type { JoseTokenService } from '../services/joseTokenService.js';

export function authorize(
	tokenService: JoseTokenService,
	...allowedRoles: UserRole[]
): RequestHandler {
	return async (req, res, next) => {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			res.status(401).json({ message: 'Missing authentication token' });
			return;
		}

		const token = authHeader.slice('Bearer '.length).trim();
		if (!token) {
			res.status(401).json({ message: 'Missing authentication token' });
			return;
		}

		const payload = await tokenService.verify(token).catch(() => null);
		if (!payload) {
			res.status(401).json({ message: 'Invalid authentication token' });
			return;
		}

		if (!allowedRoles.includes(payload.role)) {
			res.status(403).json({ message: 'Insufficient role' });
			return;
		}

		req.user = payload;
		next();
	};
}

export const authorise = authorize;
