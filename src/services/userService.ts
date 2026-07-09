import { hash } from 'argon2';
import type { UserDao } from '../daos/userDao.js';
import type UserMapper from '../mappers/userMapper.js';
import { UserRole } from '../models/user.js';

export class UserService {
	constructor(
		private readonly userDao: UserDao,
		private readonly userMapper: UserMapper,
	) {}

	async createUser(data: {
		email: string;
		password: string;
	}): Promise<SignupResponse> {
		const hashedPassword = await hash(data.password);
		const user = await this.userDao.createUser({
			email: data.email,
			password: hashedPassword,
		});

		return this.userMapper.toSignupResponse(user);
	}
}
