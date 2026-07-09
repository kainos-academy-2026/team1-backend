import type SignupResponse from '../dtos/signupResponse';
import type { User } from '../generated/prisma/client';
import { UserRole } from '../models/user';

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
