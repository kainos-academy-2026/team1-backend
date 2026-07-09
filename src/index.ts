import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import { createApp } from './app';
import { JobRoleController } from './controllers/jobRoleController';
import { PrismaJobRoleDao } from './daos/prismaJobRoleDao';
import { PrismaClient } from './generated/prisma/client';
import JobRoleMapper from './mappers/jobRoleMapper';
import { JobRoleService } from './services/jobRoleService';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const jobRoleDao = new PrismaJobRoleDao(prisma);
const jobRoleService = new JobRoleService(jobRoleDao, new JobRoleMapper());
const jobRoleController = new JobRoleController(jobRoleService);
const app = createApp(jobRoleController);

const PORT = Number(process.env.PORT ?? '3001');

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

export default app;
