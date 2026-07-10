import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { PrismaUserDao } from '../daos/prismaUserDao.js';
import SignupRequestSchema from '../dtos/signupRequest.js';
import { PrismaClient } from '../generated/prisma/client.js';
import { validateBody } from '../middleware/validate.js';
import { UserService } from '../services/userService.js';

const connectionString = process.env.DATABASE_URL as string;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
const userDao = new PrismaUserDao(prisma);

const router = Router();
const userService = new UserService(userDao);
const userController: UserController = new UserController(userService);

router.post(
	'/signup',
	validateBody(SignupRequestSchema),
	userController.createUser.bind(userController),
);

export default router;
