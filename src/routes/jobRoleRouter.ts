import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Router } from 'express';
import { JobRoleController } from '../controllers/jobRoleController.js';
import { PrismaJobRoleDao } from '../daos/prismaJobRoleDao.js';
import ApplyJobRoleRequestSchema from '../dtos/ApplyJobRoleRequest.js';
import { PrismaClient } from '../generated/prisma/client.js';
import JobRoleMapper from '../mappers/jobRoleMapper.js';
import { authorize } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { UserRole } from '../models/user.js';
import { JobRoleService } from '../services/jobRoleService.js';
import { JoseTokenService } from '../services/joseTokenService.js';
import { S3Service } from '../services/s3Service.js';

const connectionString = process.env.DATABASE_URL as string;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
const jobRoleDao = new PrismaJobRoleDao(prisma);

const router = Router();
const s3Service = new S3Service();
const jobRoleService = new JobRoleService(
	jobRoleDao,
	new JobRoleMapper(),
	s3Service,
);
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

router.post(
	'/:jobRoleId/apply',
	authorize(tokenService, [UserRole.ADMIN, UserRole.USER]),
	validateBody(ApplyJobRoleRequestSchema),
	jobRoleController.applyForJobRole.bind(jobRoleController),
);

export default router;
