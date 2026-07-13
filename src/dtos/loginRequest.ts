import { z } from 'zod';

export const LoginRequestSchema = z
	.object({
		email: z.email('A valid email is required'),
		password: z.string().min(1, 'Password is required'),
	})
	.strict();

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export default LoginRequestSchema;
