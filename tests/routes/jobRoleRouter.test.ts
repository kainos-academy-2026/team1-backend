import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { JobRoleRouter } from '../../src/routes/jobRoleRouter';

describe('createJobRoleRouter', () => {
	it('wires GET /job-roles to controller.getAll', async () => {
		const controller = {
			getAll: vi.fn(async (_req, res) => {
				res.status(200).json([{ id: 1, roleName: 'Engineer' }]);
			}),
		};

		const app = express();
		app.use('/job-roles', JobRoleRouter(controller as never));

		const response = await request(app).get('/job-roles');

		expect(response.status).toBe(200);
		expect(response.body).toEqual([{ id: 1, roleName: 'Engineer' }]);
		expect(controller.getAll).toHaveBeenCalledOnce();
	});
});