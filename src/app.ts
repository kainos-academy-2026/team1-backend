import { PrismaPg } from '@prisma/adapter-pg';
import express, { type Request, type Response } from 'express';
import { JobRoleController } from './controllers/jobRoleController';
import { PrismaJobRoleDao } from './daos/prismaJobRoleDao';
import { PrismaClient } from './generated/prisma/client';
import { createJobRoleRouter } from './routes/jobRoleRouter';
import { JobRoleService } from './services/jobRoleService';

export const app = express();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const jobRoleDao = new PrismaJobRoleDao(prisma);
const jobRoleService = new JobRoleService(jobRoleDao);
const jobRoleController = new JobRoleController(jobRoleService);

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
	res.json({
		status: 'UP',
		time: new Date().toISOString(),
	});
});

app.use('/job-roles', createJobRoleRouter(jobRoleController));
