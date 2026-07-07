import type { Request, Response } from 'express';
import type { JobRoleResponse } from '../dtos/jobRoleResponse';
import { toJobRoleResponse } from '../mappers/jobRoleMapper';
import type { JobRoleService } from '../services/jobRoleService';

export class JobRoleController {
	constructor(private readonly jobRoleService: JobRoleService) {}

	async getAll(_req: Request, res: Response): Promise<void> {
		try {
			const jobRoles = await this.jobRoleService.findAll();
			const response: JobRoleResponse[] = jobRoles.map((jobRole) =>
				toJobRoleResponse(jobRole),
			);

			res.status(200).json(response);
		} catch {
			res.status(500).json({ error: 'Internal server error' });
		}
	}
}
