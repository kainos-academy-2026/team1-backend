import { z } from 'zod';

export const SignupRequestSchema = z.object({
	email: z.string().email('A valid email is required'),
	password: z
		.string()
		.min(9, 'Password must be more than 8 characters')
		.regex(/[A-Z]/, 'Password must include at least one uppercase letter')
		.regex(/[a-z]/, 'Password must include at least one lowercase letter')
		.regex(/[^A-Za-z0-9]/, 'Password must include at least one special character'),
}).strict();

export type SignupRequest = z.infer<typeof SignupRequestSchema>;

export default SignupRequestSchema;
