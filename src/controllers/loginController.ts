import type { Request, Response } from 'express';
import { InvalidCredentialsError } from '../errors/invalidCredentialsError.js';
import { UserNotFoundError } from '../errors/userNotFoundError.js';
import type { LoginService } from '../services/loginService.js';

export class LoginController {
	constructor(private readonly loginService: LoginService) {}

	async login(req: Request, res: Response) {
		try {
			const response = await this.loginService.login(req.body);
			res.status(200).json(response);
		} catch (error: unknown) {
			if (
				error instanceof UserNotFoundError ||
				error instanceof InvalidCredentialsError
			) {
				res.status(401).json({ error: 'Invalid email or password' });
				return;
			}

			res.status(500).json({ error: 'Internal server error' });
		}
	}
}
