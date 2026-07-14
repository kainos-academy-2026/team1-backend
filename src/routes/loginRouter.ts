import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Router } from 'express';
import { LoginController } from '../controllers/loginController.js';
import { UserController } from '../controllers/userController.js';
import { PrismaUserDao } from '../daos/prismaUserDao.js';
import LoginRequestSchema from '../dtos/loginRequest.js';
import SignupRequestSchema from '../dtos/signupRequest.js';
import { PrismaClient } from '../generated/prisma/client.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { JoseTokenService } from '../services/joseTokenService.js';
import { LoginService } from '../services/loginService.js';
import { UserService } from '../services/userService.js';

const connectionString = process.env.DATABASE_URL as string;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
const userDao = new PrismaUserDao(prisma);

const router = Router();
const userService = new UserService(userDao);
const userController = new UserController(userService);
const loginService = new LoginService(userDao, new JoseTokenService());
const loginController = new LoginController(loginService);

router.post(
	'/signup',
	validateBody(SignupRequestSchema),
	userController.createUser.bind(userController),
);

router.post(
	'/login',
	validateBody(LoginRequestSchema),
	loginController.login.bind(loginController),
);

router.post(
	'/logout',
	authenticate(),
	loginController.logout.bind(loginController),
);

export default router;
