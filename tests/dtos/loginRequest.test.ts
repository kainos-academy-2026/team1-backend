import { describe, expect, it } from 'vitest';
import LoginRequestSchema from '../../src/dtos/loginRequest';

describe('LoginRequestSchema', () => {
	it('accepts a valid login request', () => {
		expect(
			LoginRequestSchema.safeParse({
				email: 'test@example.com',
				password: 'Password123!',
			}).success,
		).toBe(true);
	});

	it('rejects invalid email format', () => {
		expect(
			LoginRequestSchema.safeParse({
				email: 'invalid-email',
				password: 'Password123!',
			}).success,
		).toBe(false);
	});

	it('rejects missing password', () => {
		expect(
			LoginRequestSchema.safeParse({
				email: 'test@example.com',
			}).success,
		).toBe(false);
	});

	it('rejects unrecognized fields', () => {
		expect(
			LoginRequestSchema.safeParse({
				email: 'test@example.com',
				password: 'Password123!',
				extra: 'bad',
			}).success,
		).toBe(false);
	});
});
