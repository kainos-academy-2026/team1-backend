import express, { type Request, type Response } from 'express';
import type { JobRoleController } from './controllers/jobRoleController';
import { createJobRoleRouter } from './routes/jobRoleRouter';

export function createApp(jobRoleController?: JobRoleController) {
	const app = express();

	app.use(express.json());

	app.get('/health', (_req: Request, res: Response) => {
		res.json({
			status: 'UP',
			time: new Date().toISOString(),
		});
	});

	if (jobRoleController) {
		app.use('/job-roles', createJobRoleRouter(jobRoleController));
	}

	return app;
}

export const app = createApp();
