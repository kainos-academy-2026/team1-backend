import { verify } from 'argon2';
import type { UserDao } from '../daos/userDao.js';
import type { LoginRequest } from '../dtos/loginRequest.js';
import { InvalidCredentialsError } from '../errors/invalidCredentialsError.js';
import { UserNotFoundError } from '../errors/userNotFoundError.js';
import type { JoseTokenService } from './joseTokenService.js';

export class LoginService {
	constructor(
		private readonly userDao: UserDao,
		private readonly tokenService: JoseTokenService,
	) {}

	async login(loginRequest: LoginRequest): Promise<{ token: string }> {
		const normalizedEmail = loginRequest.email.trim().toLowerCase();
		const user = await this.userDao.findUserByEmail(normalizedEmail);

		if (!user) {
			throw new UserNotFoundError();
		}

		const isPasswordValid = await verify(user.password, loginRequest.password);
		if (!isPasswordValid) {
			throw new InvalidCredentialsError();
		}

		const token = await this.tokenService.create(user);
		return { token };
	}
}
