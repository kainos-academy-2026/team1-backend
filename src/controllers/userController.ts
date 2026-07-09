import type { Request, Response } from 'express';
import type { UserService } from '../services/userService';

export class UserController {
    constructor(private readonly userService: UserService) {}

    async createUser(req: Request, res: Response) {
        try {
            const users = await this.userService.createUser({ email: req.body.email, password: req.body.password });
            res.status(201).json(users);
        } catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
