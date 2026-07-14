import type { TokenPayload } from '../models/tokenPayload.js';

declare global {
	namespace Express {
		interface Request {
			user?: TokenPayload;
		}
	}
}
