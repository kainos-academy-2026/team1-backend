import type { User } from '../generated/prisma/client.js';
import { UserRole } from '../models/user.js';

export default class UserMapper {
	private toUserRole(role: string): UserRole {
		switch (role) {
			case UserRole.ADMIN:
			case UserRole.USER:
				return role;
			default:
				throw new Error(`Invalid user role: ${role}`);
		}
	}

	toSignupResponse(user: User) {
		return {
			id: user.userId,
			email: user.email,
			role: this.toUserRole(user.role),
		};
	}
}
