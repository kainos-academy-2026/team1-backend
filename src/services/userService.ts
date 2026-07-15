import { hash } from 'argon2';
import type { UserDao } from '../daos/userDao.js';
import { DuplicateEmailError } from '../errors/userErrors.js';
import { UserRole } from '../models/user.js';

export class UserService {
	constructor(private readonly userDao: UserDao) {}

	async createUser(data: { email: string; password: string }) {
		const existing = await this.userDao.findUserByEmail(data.email);
		if (existing) {
			throw new DuplicateEmailError();
		}
		const hashedPassword = await hash(data.password);
		await this.userDao.createUser({
			email: data.email,
			password: hashedPassword,
			role: UserRole.USER,
		});
	}
}
