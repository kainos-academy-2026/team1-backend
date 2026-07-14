import express from 'express';
import * as jose from 'jose';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { authenticate, authorize } from '../../src/middleware/auth.js';
import { UserRole } from '../../src/models/user.js';

const SECRET = 'test-secret-key';

function createToken(role: UserRole): Promise<string> {
	return new jose.SignJWT({
		sub: '1',
		email: 'test@example.com',
		role,
	})
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('2h')
		.sign(new TextEncoder().encode(SECRET));
}

describe('auth middleware', () => {
	beforeEach(() => {
		process.env.JWT_SECRET_KEY = SECRET;
	});

	it('returns 401 when the token is missing', async () => {
		const app = express();
		app.get('/protected', authenticate(), (_req, res) => {
			res.sendStatus(204);
		});

		const response = await request(app).get('/protected');

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ message: 'Missing authentication token' });
	});

	it('returns 401 when the token is invalid', async () => {
		const app = express();
		app.get('/protected', authenticate(), (_req, res) => {
			res.sendStatus(204);
		});

		const response = await request(app)
			.get('/protected')
			.set('Authorization', 'Bearer invalid-token');

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ message: 'Invalid authentication token' });
	});

	it('returns 403 when the authenticated role is not allowed', async () => {
		const app = express();
		const userToken = await createToken(UserRole.USER);

		app.get(
			'/admin',
			authenticate(),
			authorize([UserRole.ADMIN]),
			(_req, res) => {
				res.sendStatus(204);
			},
		);

		const response = await request(app)
			.get('/admin')
			.set('Authorization', `Bearer ${userToken}`);

		expect(response.status).toBe(403);
		expect(response.body).toEqual({ message: 'Insufficient role' });
	});

	it('passes through when the authenticated role is allowed', async () => {
		const app = express();
		const adminToken = await createToken(UserRole.ADMIN);

		app.get(
			'/admin',
			authenticate(),
			authorize([UserRole.ADMIN]),
			(_req, res) => {
				res.sendStatus(204);
			},
		);

		const response = await request(app)
			.get('/admin')
			.set('Authorization', `Bearer ${adminToken}`);

		expect(response.status).toBe(204);
	});
});
