import { hash } from 'argon2';
import type { UserDao } from '../daos/userDao.js';
import { UserRole } from '../models/user.js';

export class UserService {
	constructor(private readonly userDao: UserDao) {}

	async createUser(data: { email: string; password: string }) {
		const hashedPassword = await hash(data.password);
		await this.userDao.createUser({
			email: data.email,
			password: hashedPassword,
			role: UserRole.USER,
		});
	}
}
