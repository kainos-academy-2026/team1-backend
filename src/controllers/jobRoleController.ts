import type { Request, Response } from 'express';
import type { ApplyJobRoleRequest } from '../dtos/ApplyJobRoleRequest.js';
import { JobRoleNotOpenError } from '../errors/jobRoleNotOpenError.js';
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

	async applyForJobRole(req: Request, res: Response) {
		try {
			const jobRoleId = parseInt(req.params.jobRoleId, 10);
			if (Number.isNaN(jobRoleId)) {
				return res.status(400).json({ error: 'Invalid job role ID' });
			}

			const userId = Number.parseInt(req.user?.sub ?? '', 10);
			if (Number.isNaN(userId)) {
				return res.status(401).json({ error: 'Invalid authentication token' });
			}

			const { fileName, contentType } = req.body as ApplyJobRoleRequest;
			const application = await this.jobRoleService.applyForJobRole(
				userId,
				jobRoleId,
				fileName,
				contentType,
			);

			if (!application) {
				return res.status(404).json({ error: 'Job role not found' });
			}

			return res.status(200).json(application);
		} catch (error) {
			if (error instanceof JobRoleNotOpenError) {
				return res.status(409).json({ error: error.message });
			}
			return res.status(500).json({ error: 'Internal server error' });
		}
	}
}
