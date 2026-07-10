import type { UserRole } from '../models/user.js';

export default interface SignupResponse {
	id: number;
	email: string;
	role: UserRole;
}
