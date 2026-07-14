import { z } from 'zod';
import { UserRole } from './user.js';

export const TokenPayloadSchema = z.object({
	sub: z.string().min(1),
	email: z.email(),
	role: z.enum(UserRole),
});

export type TokenPayload = z.infer<typeof TokenPayloadSchema>;
