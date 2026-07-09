import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Router } from 'express';
import { JobRoleController } from '../controllers/jobRoleController.js';
import { PrismaJobRoleDao } from '../daos/prismaJobRoleDao.js';
import { PrismaClient } from '../generated/prisma/client.js';
import JobRoleMapper from '../mappers/jobRoleMapper.js';
import { JobRoleService } from '../services/jobRoleService.js';

const connectionString = process.env.DATABASE_URL as string;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
const jobRoleDao = new PrismaJobRoleDao(prisma);

const router = Router();
const jobRoleService = new JobRoleService(jobRoleDao, new JobRoleMapper());
const jobRoleController: JobRoleController = new JobRoleController(
	jobRoleService,
);

router.get('/', jobRoleController.getAll.bind(jobRoleController));

router.get('/:jobRoleId', jobRoleController.getById.bind(jobRoleController));

export default router;
