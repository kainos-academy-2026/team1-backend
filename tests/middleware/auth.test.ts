import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { authorize } from '../../src/middleware/auth.js';
import type { TokenPayload } from '../../src/models/tokenPayload.js';
import { UserRole } from '../../src/models/user.js';
import type { JoseTokenService } from '../../src/services/joseTokenService.js';

function createTokenServiceMock(
	payload: TokenPayload | null,
): JoseTokenService {
	return {
		verify: vi.fn().mockResolvedValue(payload),
	} as unknown as JoseTokenService;
}

describe('auth middleware', () => {
	it('returns 401 when the token is missing', async () => {
		const app = express();
		app.get(
			'/protected',
			authorize(createTokenServiceMock(null), [UserRole.USER]),
			(_req, res) => {
				res.sendStatus(204);
			},
		);

		const response = await request(app).get('/protected');

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ message: 'Missing authentication token' });
	});

	it('returns 401 when the token is invalid', async () => {
		const app = express();
		app.get(
			'/protected',
			authorize(createTokenServiceMock(null), [UserRole.USER]),
			(_req, res) => {
				res.sendStatus(204);
			},
		);

		const response = await request(app)
			.get('/protected')
			.set('Authorization', 'Bearer invalid-token');

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ message: 'Invalid authentication token' });
	});

	it('returns 403 when the authenticated role is not allowed', async () => {
		const app = express();
		const tokenService = createTokenServiceMock({
			sub: '1',
			email: 'test@example.com',
			role: UserRole.USER,
		});

		app.get(
			'/admin',
			authorize(tokenService, [UserRole.ADMIN]),
			(_req, res) => {
				res.sendStatus(204);
			},
		);

		const response = await request(app)
			.get('/admin')
			.set('Authorization', 'Bearer user-token');

		expect(response.status).toBe(403);
		expect(response.body).toEqual({ message: 'Insufficient role' });
	});

	it('passes through when the authenticated role is allowed', async () => {
		const app = express();
		const tokenService = createTokenServiceMock({
			sub: '1',
			email: 'test@example.com',
			role: UserRole.ADMIN,
		});

		app.get(
			'/admin',
			authorize(tokenService, [UserRole.ADMIN]),
			(_req, res) => {
				res.sendStatus(204);
			},
		);

		const response = await request(app)
			.get('/admin')
			.set('Authorization', 'Bearer admin-token');

		expect(response.status).toBe(204);
	});
});
