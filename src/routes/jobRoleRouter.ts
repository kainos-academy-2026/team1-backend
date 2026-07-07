import { type Request, type Response, Router } from 'express';
import type { JobRoleController } from '../controllers/jobRoleController';

export function createJobRoleRouter(
	jobRoleController: JobRoleController,
): Router {
	const router = Router();

	router.get('/', async (req: Request, res: Response) => {
		await jobRoleController.getAll(req, res);
	});

	return router;
}
