import type { UserRole } from './user.js';

export interface TokenPayload {
	sub: string;
	email: string;
	role: UserRole;
}
