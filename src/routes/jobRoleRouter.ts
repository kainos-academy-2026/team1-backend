import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Router } from 'express';
import { JobRoleController } from '../controllers/jobRoleController';
import { PrismaJobRoleDao } from '../daos/prismaJobRoleDao';
import { PrismaClient } from '../generated/prisma/client';
import JobRoleMapper from '../mappers/jobRoleMapper';
import { JobRoleService } from '../services/jobRoleService';

//Move to index.ts
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
const jobRoleDao = new PrismaJobRoleDao(prisma);

const router = Router();
const jobRoleService = new JobRoleService(jobRoleDao, new JobRoleMapper());
const jobRoleController: JobRoleController = new JobRoleController(
	jobRoleService,
);

router.get('/', jobRoleController.getAll.bind(jobRoleController));

export default router;
