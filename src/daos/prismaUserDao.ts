import type { PrismaClient, User } from '../generated/prisma/client.js';
import type { CreateUserData } from './userDao.js';
import type { UserDao } from './userDao.js';

export class PrismaUserDao implements UserDao {
	constructor(private readonly prisma: PrismaClient) {}

	async createUser(data: CreateUserData): Promise<User> {
		return this.prisma.user.create({
			data: {
				email: data.email,
				password: data.password,
				role: data.role ?? 'USER',
			},
		});
	}
}
