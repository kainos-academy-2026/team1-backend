import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { PrismaUserDao } from '../daos/prismaUserDao';
import SignupRequestSchema from '../dtos/signupRequest';
import { PrismaClient } from '../generated/prisma/client';
import UserMapper from '../mappers/userMapper';
import { validateBody } from '../middleware/validate';
import { UserService } from '../services/userService';

const connectionString = process.env.DATABASE_URL as string;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
const userDao = new PrismaUserDao(prisma);

const router = Router();
const userService = new UserService(userDao, new UserMapper());
const userController: UserController = new UserController(userService);

router.post(
    '/signup',
    validateBody(SignupRequestSchema),
    userController.createUser.bind(userController),
);

export default router;
