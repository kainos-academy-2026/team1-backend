import * as jose from 'jose';
import { beforeEach, describe, expect, it } from 'vitest';
import type { User } from '../../src/generated/prisma/client';
import { JoseTokenService } from '../../src/services/joseTokenService';

const SECRET = 'test-secret-key';

const user = {
	userId: 1,
	email: 'test@example.com',
	role: 'ADMIN',
} as unknown as User;

describe('JoseTokenService', () => {
	beforeEach(() => {
		process.env.JWT_SECRET_KEY = SECRET;
	});

	it('throws when JWT_SECRET_KEY is not set', () => {
		delete process.env.JWT_SECRET_KEY;
		expect(() => new JoseTokenService()).toThrow('JWT_SECRET_KEY is not set');
	});

	it('creates a token that verifies back to the original claims', async () => {
		const service = new JoseTokenService();

		const token = await service.create(user);
		const payload = await service.verify(token);

		expect(payload).toEqual({
			sub: '1',
			email: 'test@example.com',
			role: 'ADMIN',
		});
	});

	it('rejects a token signed with a different key', async () => {
		const service = new JoseTokenService();
		const foreignKey = new TextEncoder().encode('a-different-secret');
		const foreignToken = await new jose.SignJWT({
			sub: '1',
			email: 'test@example.com',
			role: 'ADMIN',
		})
			.setProtectedHeader({ alg: 'HS256' })
			.setIssuedAt()
			.setExpirationTime('2h')
			.sign(foreignKey);

		await expect(service.verify(foreignToken)).rejects.toThrow();
	});

	it('rejects a tampered token', async () => {
		const service = new JoseTokenService();
		const token = await service.create(user);
		const tampered = `${token}tampered`;

		await expect(service.verify(tampered)).rejects.toThrow();
	});

	it('rejects an expired token', async () => {
		const service = new JoseTokenService();
		const expiredToken = await new jose.SignJWT({
			sub: '1',
			email: 'test@example.com',
			role: 'ADMIN',
		})
			.setProtectedHeader({ alg: 'HS256' })
			.setIssuedAt(0)
			.setExpirationTime(1)
			.sign(new TextEncoder().encode(SECRET));

		await expect(service.verify(expiredToken)).rejects.toThrow();
	});
});
