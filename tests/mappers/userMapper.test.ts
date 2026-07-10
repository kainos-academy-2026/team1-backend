import { describe, expect, it } from 'vitest';
import UserMapper from '../../src/mappers/userMapper';

describe('UserMapper', () => {
	it('maps a prisma user into a signup response DTO', () => {
		const mapper = new UserMapper();
		const user = {
			userId: 1,
			email: 'test@example.com',
			password: 'hashed-password',
			role: 'USER',
		} as never;

		expect(mapper.toSignupResponse(user)).toEqual({
			id: 1,
			email: 'test@example.com',
			role: 'USER',
		});
	});
});
