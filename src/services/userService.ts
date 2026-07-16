import { hash } from 'argon2';
import type { UserDao } from '../daos/userDao.js';
import { DuplicateEmailError } from '../errors/duplicateEmailError.js';
import { UserRole } from '../models/user.js';

export class UserService {
	constructor(private readonly userDao: UserDao) {}

	async createUser(data: { email: string; password: string }) {
		const normalisedEmail = data.email.trim().toLowerCase();
		const existing = await this.userDao.findUserByEmail(normalisedEmail);
		if (existing) {
			throw new DuplicateEmailError();
		}
		const hashedPassword = await hash(data.password);
		await this.userDao.createUser({
			email: normalisedEmail,
			password: hashedPassword,
			role: UserRole.USER,
		});
	}
}
