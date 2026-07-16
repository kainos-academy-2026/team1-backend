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
	const capabilitySeed = [
		{ capabilityId: 1, capabilityName: 'Engineering' },
		{ capabilityId: 2, capabilityName: 'Data and AI' },
		{ capabilityId: 3, capabilityName: 'Product and Delivery' },
		{ capabilityId: 4, capabilityName: 'Workday Services' },
		{ capabilityId: 5, capabilityName: 'Architecture and Platforms' },
	];

	await Promise.all(
		capabilitySeed.map((capability) =>
			prisma.capability.upsert({
				where: { capabilityId: capability.capabilityId },
				update: { capabilityName: capability.capabilityName },
				create: capability,
			}),
		),
	);
	console.log('capabilities seeded:', capabilitySeed.length);

	const bandSeed = [
		{ bandId: 1, bandName: 'Associate' },
		{ bandId: 2, bandName: 'Senior Associate' },
		{ bandId: 3, bandName: 'Consultant' },
		{ bandId: 4, bandName: 'Manager' },
		{ bandId: 5, bandName: 'Principal' },
	];

	await Promise.all(
		bandSeed.map((band) =>
			prisma.band.upsert({
				where: { bandId: band.bandId },
				update: { bandName: band.bandName },
				create: band,
			}),
		),
	);
	console.log('bands seeded:', bandSeed.length);

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

	const seedJobs = [
		{
			roleName: 'Workday Adaptive Planning Practice Lead, EMEA',
			location: 'Multiple locations',
			capabilityId: 4,
			bandId: 5,
		},
		{
			roleName: 'Workday HCM Consultant (SA)',
			location: 'Multiple locations',
			capabilityId: 4,
			bandId: 2,
		},
		{
			roleName: 'Senior Technical Business Analyst',
			location: 'Belfast, United Kingdom',
			capabilityId: 3,
			bandId: 3,
		},
		{
			roleName: 'Lead Extend Developer',
			location: 'Buenos Aires, Argentina',
			capabilityId: 4,
			bandId: 4,
		},
		{
			roleName: 'Lead Software Engineer',
			location: 'Buenos Aires, Argentina',
			capabilityId: 1,
			bandId: 4,
		},
		{
			roleName: 'Workday AMS Service Manager',
			location: 'Multiple locations',
			capabilityId: 4,
			bandId: 4,
		},
		{
			roleName: 'Product Lead (Defence)',
			location: 'London, United Kingdom',
			capabilityId: 3,
			bandId: 4,
		},
		{
			roleName: 'Technical Architect',
			location: 'London, United Kingdom',
			capabilityId: 5,
			bandId: 4,
		},
		{
			roleName: 'Senior Dynamics 365 Engineer',
			location: 'Gdansk, Poland',
			capabilityId: 5,
			bandId: 3,
		},
		{
			roleName: 'Senior Workday Integrations Consultant',
			location: 'Gdansk, Poland',
			capabilityId: 4,
			bandId: 3,
		},
		{
			roleName: 'Workday Financials Consultant',
			location: 'Dublin, Ireland',
			capabilityId: 4,
			bandId: 3,
		},
		{
			roleName: 'Data Engineer',
			location: 'Belfast, United Kingdom',
			capabilityId: 2,
			bandId: 2,
		},
		{
			roleName: 'Senior Data Engineer',
			location: 'London, United Kingdom',
			capabilityId: 2,
			bandId: 3,
		},
		{
			roleName: 'Cloud Platform Engineer',
			location: 'Toronto, Canada',
			capabilityId: 5,
			bandId: 2,
		},
		{
			roleName: 'Senior Cloud Platform Engineer',
			location: 'Belfast, United Kingdom',
			capabilityId: 5,
			bandId: 3,
		},
		{
			roleName: 'QA Automation Engineer',
			location: 'Gdansk, Poland',
			capabilityId: 1,
			bandId: 2,
		},
		{
			roleName: 'Senior QA Automation Engineer',
			location: 'Belfast, United Kingdom',
			capabilityId: 1,
			bandId: 3,
		},
		{
			roleName: 'DevOps Engineer',
			location: 'Warsaw, Poland',
			capabilityId: 5,
			bandId: 2,
		},
		{
			roleName: 'Site Reliability Engineer',
			location: 'London, United Kingdom',
			capabilityId: 5,
			bandId: 3,
		},
		{
			roleName: 'Delivery Manager',
			location: 'Derry, United Kingdom',
			capabilityId: 3,
			bandId: 4,
		},
		{
			roleName: 'Product Manager',
			location: 'Birmingham, United Kingdom',
			capabilityId: 3,
			bandId: 3,
		},
		{
			roleName: 'Senior Product Manager',
			location: 'London, United Kingdom',
			capabilityId: 3,
			bandId: 4,
		},
		{
			roleName: 'Business Analyst',
			location: 'Belfast, United Kingdom',
			capabilityId: 3,
			bandId: 2,
		},
		{
			roleName: 'Security Engineer',
			location: 'Belfast, United Kingdom',
			capabilityId: 5,
			bandId: 2,
		},
		{
			roleName: 'Lead Security Engineer',
			location: 'Belfast, United Kingdom',
			capabilityId: 5,
			bandId: 4,
		},
		{
			roleName: 'AI Engineer',
			location: 'London, United Kingdom',
			capabilityId: 2,
			bandId: 3,
		},
		{
			roleName: 'Machine Learning Engineer',
			location: 'Toronto, Canada',
			capabilityId: 2,
			bandId: 3,
		},
		{
			roleName: 'Software Engineer',
			location: 'Belfast, United Kingdom',
			capabilityId: 1,
			bandId: 1,
		},
		{
			roleName: 'Senior Software Engineer',
			location: 'Gdansk, Poland',
			capabilityId: 1,
			bandId: 2,
		},
		{
			roleName: 'Principal Software Engineer',
			location: 'London, United Kingdom',
			capabilityId: 1,
			bandId: 5,
		},
		{
			roleName: 'Solutions Architect',
			location: 'Indianapolis, United States Of America',
			capabilityId: 5,
			bandId: 5,
		},
	];

	const capabilityThemes: Record<number, { domain: string; outcomes: string }> =
		{
			1: {
				domain: 'digital product engineering',
				outcomes: 'secure, maintainable platforms for high-volume services',
			},
			2: {
				domain: 'data and AI delivery',
				outcomes: 'decision-ready insight and production-grade ML capabilities',
			},
			3: {
				domain: 'product and delivery leadership',
				outcomes: 'measurable customer value and reliable programme execution',
			},
			4: {
				domain: 'Workday transformation services',
				outcomes: 'scalable HR and finance operations for enterprise clients',
			},
			5: {
				domain: 'architecture and cloud platforms',
				outcomes: 'resilient cloud estates and modern integration patterns',
			},
		};

	const initiatives = [
		'public sector digital services',
		'global HR modernization programmes',
		'regulated cloud migration portfolios',
		'AI-enabled operations transformation',
		'customer experience acceleration initiatives',
		'enterprise platform reliability programmes',
	];

	const deliveryContexts = [
		'multi-disciplinary delivery squads',
		'cross-region client teams',
		'product-led engineering groups',
		'architecture governance forums',
		'managed service delivery pods',
		'rapid discovery and delivery teams',
	];

	const responsibilityFocus = [
		'owning delivery milestones and technical quality',
		'shaping scope with stakeholders and prioritizing outcomes',
		'mentoring team members and improving engineering standards',
		'reducing risk through proactive planning and early validation',
		'strengthening collaboration across engineering, product, and client teams',
		'driving continuous improvement through measurable delivery metrics',
	];

	await Promise.all(
		seedJobs.map((job, index) => {
			const jobRoleId = index + 1;
			const capabilityTheme = capabilityThemes[job.capabilityId];
			const initiative = initiatives[index % initiatives.length];
			const deliveryContext = deliveryContexts[index % deliveryContexts.length];
			const focus = responsibilityFocus[index % responsibilityFocus.length];
			const closingDate = new Date(
				2026,
				7 + (index % 5),
				5 + ((index * 3) % 22),
			);
			const status = index % 9 === 0 ? 'closed' : 'open';
			const numberOfOpenPositions = status === 'closed' ? 0 : (index % 5) + 1;
			const payload = {
				roleName: job.roleName,
				location: job.location,
				capabilityId: job.capabilityId,
				bandId: job.bandId,
				closingDate,
				status,
				specification: `https://careers.kainos.com/gb/en/job/SEED_${String(
					jobRoleId,
				).padStart(4, '0')}/${job.roleName
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, '-')
					.replace(/(^-|-$)/g, '')}`,
				description:
					`${job.roleName} role in ${job.location} focused on ${capabilityTheme.domain}. ` +
					`The position supports ${initiative} and delivers ${capabilityTheme.outcomes}.`,
				responsibilities:
					`Working within ${deliveryContext}, this role is accountable for ${focus}, ` +
					'communicating progress clearly, and ensuring delivery commitments are met.',
				numberOfOpenPositions,
			};

			return prisma.jobRole.upsert({
				where: { jobRoleId },
				update: payload,
				create: {
					jobRoleId,
					...payload,
				},
			});
		}),
	);
	console.log('job roles seeded:', seedJobs.length);
}

main()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
	