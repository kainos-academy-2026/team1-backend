import type SignupResponse from '../dtos/signupResponse';
import type { User } from '../generated/prisma/client';

export default class UserMapper {
	toSignupResponse(user: User): SignupResponse {
		return {
			id: user.userId,
			email: user.email,
			role: user.role,
		};
	}
}
