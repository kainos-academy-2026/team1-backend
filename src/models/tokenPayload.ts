import { z } from 'zod';
import type { UserRole } from './user.js';
import { UserRole as UserRoleEnum } from './user.js';

export interface TokenPayload {
	sub: string;
	email: string;
	role: UserRole;
}

export const TokenPayloadSchema = z.object({
	sub: z.string().min(1),
	email: z.email(),
	role: z.enum(UserRoleEnum),
});
