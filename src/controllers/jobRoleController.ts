import type { Request, Response } from 'express';
import type { JobRoleService } from '../services/jobRoleService';

export class JobRoleController {
	constructor(private readonly jobRoleService: JobRoleService) {}

	async getAll(_req: Request, res: Response) {
		try {
			const response = await this.jobRoleService.findAll();
			res.status(200).json(response);
		} catch {
			res.status(500).json({ error: 'Internal server error' });
		}
	}
}
