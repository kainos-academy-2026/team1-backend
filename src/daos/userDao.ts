import type { User } from '../generated/prisma/client.js';
import type { UserRole } from '../models/user.js';

export interface CreateUserData {
	email: string;
	password: string;
	role: UserRole;
}

export interface UserDao {
	createUser(data: CreateUserData): Promise<User>;
}
