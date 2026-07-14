import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Router } from 'express';
import { JobRoleController } from '../controllers/jobRoleController.js';
import { PrismaJobRoleDao } from '../daos/prismaJobRoleDao.js';
import { PrismaClient } from '../generated/prisma/client.js';
import JobRoleMapper from '../mappers/jobRoleMapper.js';
import { authorize } from '../middleware/auth.js';
import { UserRole } from '../models/user.js';
import { JobRoleService } from '../services/jobRoleService.js';
import { JoseTokenService } from '../services/joseTokenService.js';

const connectionString = process.env.DATABASE_URL as string;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
const jobRoleDao = new PrismaJobRoleDao(prisma);

const router = Router();
const jobRoleService = new JobRoleService(jobRoleDao, new JobRoleMapper());
const jobRoleController = new JobRoleController(jobRoleService);
const tokenService = new JoseTokenService();

router.get(
	'/',
	authorize(tokenService, [UserRole.ADMIN, UserRole.USER]),
	jobRoleController.getAll.bind(jobRoleController),
);

router.get(
	'/:jobRoleId',
	authorize(tokenService, [UserRole.ADMIN, UserRole.USER]),
	jobRoleController.getById.bind(jobRoleController),
);

export default router;
