import type { UserRole } from '../models/user';

export default interface SignupResponse {
	id: number;
	email: string;
	role: UserRole;
}
