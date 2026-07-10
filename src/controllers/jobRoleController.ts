import type { Request, Response } from 'express';
import type { JobRoleService } from '../services/jobRoleService.js';

export class JobRoleController {
	constructor(private readonly jobRoleService: JobRoleService) {}

	async getAll(_req: Request, res: Response) {
		try {
			const jobRoles = await this.jobRoleService.findAll();
			res.status(200).json(jobRoles);
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
