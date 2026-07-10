import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { validateBody } from '../../src/middleware/validate';

describe('validateBody', () => {
	const schema = z.object({ name: z.string() }).strict();

	function buildApp() {
		const app = express();
		app.use(express.json());
		app.post('/test', validateBody(schema), (_req, res) => {
			res.status(200).json({ ok: true });
		});
		return app;
	}

	it('calls next and passes valid body through', async () => {
		const response = await request(buildApp())
			.post('/test')
			.send({ name: 'Alice' });
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ ok: true });
	});

	it('returns 400 with errors when a required field is missing', async () => {
		const response = await request(buildApp()).post('/test').send({});
		expect(response.status).toBe(400);
		expect(response.body.errors).toEqual(
			expect.arrayContaining([expect.objectContaining({ field: 'name' })]),
		);
	});

	it('returns 400 with errors when an unrecognised field is present', async () => {
		const response = await request(buildApp())
			.post('/test')
			.send({ name: 'Alice', extra: 'bad' });
		expect(response.status).toBe(400);
		expect(response.body.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					message: expect.stringContaining('Unrecognized key'),
				}),
			]),
		);
	});

	it('includes the field path in the error', async () => {
		const response = await request(buildApp()).post('/test').send({});
		expect(response.body.errors[0]).toHaveProperty('field');
		expect(response.body.errors[0]).toHaveProperty('message');
	});
});
