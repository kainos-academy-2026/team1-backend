import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import argon2 from 'argon2';
import { PrismaClient } from '../src/generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
	const result = await prisma.capability.createMany({
		data: [
			{ capabilityId: 1, capabilityName: 'Software Development' },
			{ capabilityId: 2, capabilityName: 'Data Science' },
			{ capabilityId: 3, capabilityName: 'Product Management' },
		],
		skipDuplicates: true,
	});
	console.log('createMany count:', result.count);

	await prisma.band.createMany({
		data: [
			{ bandId: 1, bandName: 'Junior' },
			{ bandId: 2, bandName: 'Mid' },
			{ bandId: 3, bandName: 'Senior' },
		],
		skipDuplicates: true,
	});

	await prisma.user.createMany({
		data: [
			{
				email: 'test@example.com',
				password: await argon2.hash('Password123!'),
				role: 'USER',
			},
			{
				email: 'admin@example.com',
				password: await argon2.hash('AdminPassword123!'),
				role: 'ADMIN',
			},
		],
		skipDuplicates: true,
	});

	await prisma.jobRole.createMany({
		data: [
			{
				jobRoleId: 1,
				roleName: 'Software Engineer',
				location: 'New York',
				capabilityId: 1,
				bandId: 2,
				closingDate: new Date('2024-12-31'),
				status: 'open',
				specification:
					'https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20-%20Software%20Engineer%20(Associate).pdf',
				description: 'Build and maintain backend services.',
				responsibilities: 'Design, implement, test, and support APIs.',
				numberOfOpenPositions: 2,
			},
			{
				jobRoleId: 2,
				roleName: 'Data Scientist',
				location: 'San Francisco',
				capabilityId: 2,
				bandId: 3,
				closingDate: new Date('2024-11-30'),
				status: 'open',
				specification:
					'https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Data%20and%20Artificial%20Intelligence/Job%20Profile%20-%20Senior%20Data%20Scientist%20(Senior%20Associate).pdf',
				description:
					'Analyze and interpret complex data to drive business decisions.',
				responsibilities:
					'Collect, process, and analyze data to provide insights.',
				numberOfOpenPositions: 1,
			},
			{
				jobRoleId: 3,
				roleName: 'Product Manager',
				location: 'Chicago',
				capabilityId: 3,
				bandId: 3,
				closingDate: new Date('2024-10-31'),
				status: 'closed',
				specification:
					'https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Product/Job%20Profile%20-%20Product%20Consultant%20(Manager).pdf',
				description: 'Lead product development and strategy.',
				responsibilities: 'Define product vision, strategy, and roadmap.',
				numberOfOpenPositions: 1,
			},
		],
		skipDuplicates: true,
	});
}

main()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
