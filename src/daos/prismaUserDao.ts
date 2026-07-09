import type { PrismaClient, User } from '../generated/prisma/client';
import { UserRole } from '../models/user';
import type { UserDao } from './userDao';

export class PrismaUserDao implements UserDao {
	constructor(private readonly prisma: PrismaClient) {}

	async createUser(data: { email: string; password: string }): Promise<User> {
		return this.prisma.user.create({
			data: {
				email: data.email,
				password: data.password,
				role: UserRole.USER,
			},
		});
	}
}
