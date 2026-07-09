import type { Request, Response } from 'express';
import type { JobRoleResponse } from '../dtos/jobRoleResponse';
import JobRoleMapper from '../mappers/jobRoleMapper';
import type { JobRoleService } from '../services/jobRoleService';

export class JobRoleController {
	constructor(private readonly jobRoleService: JobRoleService) {}

	async getAll(_req: Request, res: Response) {
		try {
			const jobRoles = await this.jobRoleService.findAll();
 			const mapper = new JobRoleMapper();
			const response: JobRoleResponse[] = jobRoles.map((jobRole) =>
				mapper.toJobRoleResponse(jobRole),
			);
			res.status(200).json(response);
		} catch {
			res.status(500).json({ error: 'Internal server error' });
		}
	}
}
