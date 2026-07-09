import type { User } from '../generated/prisma/client';

export interface UserDao {
	createUser(data: { email: string; password: string }): Promise<User>;
}
