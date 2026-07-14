import * as jose from 'jose';
import type { User } from '../generated/prisma/client.js';
import {
	TokenPayloadSchema,
	type TokenPayload,
} from '../models/tokenPayload.js';
import type { UserRole } from '../models/user.js';

export class JoseTokenService {
	private readonly secretKey: Uint8Array;

	constructor() {
		const secretKey = process.env.JWT_SECRET_KEY;
		if (!secretKey) {
			throw new Error('JWT_SECRET_KEY is not set');
		}

		this.secretKey = new TextEncoder().encode(secretKey);
	}

	async create(user: User): Promise<string> {
		const payload: TokenPayload = {
			sub: user.userId.toString(),
			email: user.email,
			role: user.role as UserRole,
		};

		return new jose.SignJWT({ ...payload })
			.setProtectedHeader({ alg: 'HS256' })
			.setIssuedAt()
			.setExpirationTime('2h')
			.sign(this.secretKey);
	}

	async verify(token: string): Promise<TokenPayload> {
		const { payload } = await jose.jwtVerify(token, this.secretKey);

		return TokenPayloadSchema.parse(payload);
	}
}
