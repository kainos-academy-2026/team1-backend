import type { Request, Response } from 'express';
import { DuplicateEmailError } from '../errors/userErrors.js';
import type { UserService } from '../services/userService.js';

export class UserController {
	constructor(private readonly userService: UserService) {}

	async createUser(req: Request, res: Response) {
		try {
			await this.userService.createUser({
				email: req.body.email,
				password: req.body.password,
			});
			res.status(201).end();
		} catch (err) {
			if (err instanceof DuplicateEmailError) {
				res.status(409).json({ error: err.message });
			} else {
				res.status(500).json({ error: 'Internal server error' });
			}
		}
	}
}
