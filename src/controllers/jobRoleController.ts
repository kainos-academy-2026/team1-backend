import type { Request, Response } from 'express';
import type { JobRoleService } from '../services/jobRoleService.js';

export class JobRoleController {
	constructor(private readonly jobRoleService: JobRoleService) {}

	async getAll(req: Request, res: Response) {
		try {
			const limitRaw = req.query.limit;
			const offsetRaw = req.query.offset;

			const limit =
				typeof limitRaw === 'string' ? Number.parseInt(limitRaw, 10) : 10;
			const offset =
				typeof offsetRaw === 'string' ? Number.parseInt(offsetRaw, 10) : 0;

			if (
				!Number.isInteger(limit) ||
				!Number.isInteger(offset) ||
				limit < 1 ||
				offset < 0
			) {
				return res.status(400).json({
					error:
						'Invalid pagination parameters. limit must be >= 1 and offset must be >= 0',
				});
			}

			const jobRoles = await this.jobRoleService.findAll(limit, offset);
			res.set('X-Total-Count', String(jobRoles.total));
			res.status(200).json(jobRoles.data);
		} catch {
			res.status(500).json({ error: 'Internal server error' });
		}
	}

	async getById(req: Request, res: Response) {
		try {
			const jobRoleId = parseInt(req.params.jobRoleId, 10);
			if (Number.isNaN(jobRoleId)) {
				return res.status(400).json({ error: 'Invalid job role ID' });
			}

			const jobRole = await this.jobRoleService.findById(jobRoleId);

			if (!jobRole) {
				return res.status(404).json({ error: 'Job role not found' });
			}

			res.status(200).json(jobRole);
		} catch {
			res.status(500).json({ error: 'Internal server error' });
		}
	}
}
