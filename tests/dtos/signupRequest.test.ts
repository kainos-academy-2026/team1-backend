import { describe, expect, it } from 'vitest';
import SignupRequestSchema from '../../src/dtos/signupRequest';

describe('SignupRequestSchema', () => {
	const valid = { email: 'test@example.com', password: 'Password123!' };

	it('accepts a valid signup request', () => {
		expect(SignupRequestSchema.safeParse(valid).success).toBe(true);
	});

	it('rejects a missing email', () => {
		const result = SignupRequestSchema.safeParse({ password: valid.password });
		expect(result.success).toBe(false);
	});

	it('rejects an invalid email format', () => {
		const result = SignupRequestSchema.safeParse({
			...valid,
			email: 'not-an-email',
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('A valid email is required');
		}
	});

	it('rejects a missing password', () => {
		const result = SignupRequestSchema.safeParse({ email: valid.email });
		expect(result.success).toBe(false);
	});

	it('rejects a password shorter than 9 characters', () => {
		const result = SignupRequestSchema.safeParse({
			...valid,
			password: 'Abc123!',
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain('Password must be more than 8 characters');
		}
	});

	it('rejects a password without an uppercase letter', () => {
		const result = SignupRequestSchema.safeParse({
			...valid,
			password: 'password123!',
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain(
				'Password must include at least one uppercase letter',
			);
		}
	});

	it('rejects a password without a lowercase letter', () => {
		const result = SignupRequestSchema.safeParse({
			...valid,
			password: 'PASSWORD123!',
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain(
				'Password must include at least one lowercase letter',
			);
		}
	});

	it('rejects a password without a special character', () => {
		const result = SignupRequestSchema.safeParse({
			...valid,
			password: 'Password123',
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain(
				'Password must include at least one special character',
			);
		}
	});

	it('rejects unrecognised fields', () => {
		const result = SignupRequestSchema.safeParse({ ...valid, role: 'ADMIN' });
		expect(result.success).toBe(false);
	});
});
