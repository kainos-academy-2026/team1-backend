import { describe, expect, it, vi } from 'vitest';
import { PrismaJobRoleDao } from '../../src/daos/prismaJobRoleDao.js';

describe('PrismaJobRoleDao', () => {
	it('requests all job roles ordered by id ascending', async () => {
		const rows = [
			{
				jobRoleId: 1,
				roleName: 'Engineer',
				location: 'Belfast',
				capabilityId: 2,
				bandId: 3,
				closingDate: new Date(),
				status: 'OPEN',
				capability: {
					capabilityId: 2,
					capabilityName: 'Data and AI',
				},
				band: {
					bandId: 3,
					bandName: 'Consultant',
				},
			},
		];

		const prisma = {
			jobRole: {
				findMany: vi.fn().mockResolvedValue(rows),
				count: vi.fn(),
			},
		};

		const dao = new PrismaJobRoleDao(prisma as never);

		const result = await dao.findAll(10, 20);

		expect(prisma.jobRole.findMany).toHaveBeenCalledWith({
			include: {
				capability: true,
				band: true,
			},
			orderBy: { jobRoleId: 'asc' },
			take: 10,
			skip: 20,
		});
		expect(result).toBe(rows);
	});

	it('requests total job role count', async () => {
		const prisma = {
			jobRole: {
				findMany: vi.fn(),
				count: vi.fn().mockResolvedValue(42),
				findUnique: vi.fn(),
			},
		};

		const dao = new PrismaJobRoleDao(prisma as never);

		const result = await dao.count();

		expect(prisma.jobRole.count).toHaveBeenCalledOnce();
		expect(result).toBe(42);
	});

	it('requests a job role by id', async () => {
		const row = {
			jobRoleId: 1,
			roleName: 'Engineer',
			location: 'Belfast',
			capabilityId: 2,
			bandId: 3,
			closingDate: new Date(),
			status: 'open',
			capability: {
				capabilityId: 2,
				capabilityName: 'Engineering',
			},
			band: {
				bandId: 3,
				bandName: 'Associate',
			},
		};

		const prisma = {
			jobRole: {
				findUnique: vi.fn().mockResolvedValue(row),
				findMany: vi.fn(),
				count: vi.fn(),
			},
		};

		const dao = new PrismaJobRoleDao(prisma as never);

		const result = await dao.findById(1);

		expect(prisma.jobRole.findUnique).toHaveBeenCalledWith({
			where: { jobRoleId: 1 },
			include: {
				capability: true,
				band: true,
			},
		});
		expect(result).toBe(row);
	});

	it('propagates errors thrown by prisma', async () => {
		const prisma = {
			jobRole: {
				findMany: vi.fn().mockRejectedValue(new Error('database failed')),
				count: vi.fn(),
			},
		};

		const dao = new PrismaJobRoleDao(prisma as never);

		await expect(dao.findAll(10, 0)).rejects.toThrow('database failed');
	});

	it('creates an application with in progress status', async () => {
		const created = {
			applicationId: 1,
			userId: 7,
			jobRoleId: 2,
			cvURL: 'job-applications/2/7/123-cv.pdf',
			status: 'IN_PROGRESS',
			dateApplied: new Date('2026-07-15T00:00:00.000Z'),
		};

		const prisma = {
			application: {
				create: vi.fn().mockResolvedValue(created),
			},
		};

		const dao = new PrismaJobRoleDao(prisma as never);

		const result = await dao.createApplication({
			userId: 7,
			jobRoleId: 2,
			cvURL: 'job-applications/2/7/123-cv.pdf',
		});

		expect(prisma.application.create).toHaveBeenCalledWith({
			data: {
				userId: 7,
				jobRoleId: 2,
				cvURL: 'job-applications/2/7/123-cv.pdf',
				status: 'IN_PROGRESS',
			},
		});
		expect(result).toBe(created);
	});

	it('returns applications with user for a job role', async () => {
		const applications = [
			{
				applicationId: 1,
				userId: 7,
				jobRoleId: 2,
				cvURL: 'job-applications/2/7/cv.pdf',
				status: 'IN_PROGRESS',
				dateApplied: new Date(),
				user: { userId: 7, email: 'alice@example.com' },
			},
		];

		const prisma = {
			application: {
				findMany: vi.fn().mockResolvedValue(applications),
			},
		};

		const dao = new PrismaJobRoleDao(prisma as never);
		const result = await dao.findApplicationsByJobRoleId(2);

		expect(prisma.application.findMany).toHaveBeenCalledWith({
			where: { jobRoleId: 2 },
			include: { user: true },
			orderBy: { dateApplied: 'asc' },
		});
		expect(result).toBe(applications);
	});

	it('returns null when application not found by id', async () => {
		const prisma = {
			application: {
				findUnique: vi.fn().mockResolvedValue(null),
			},
		};

		const dao = new PrismaJobRoleDao(prisma as never);
		const result = await dao.findApplicationById(99);

		expect(prisma.application.findUnique).toHaveBeenCalledWith({
			where: { applicationId: 99 },
		});
		expect(result).toBeNull();
	});

	it('updates the application status', async () => {
		const prisma = {
			application: {
				update: vi.fn().mockResolvedValue({}),
			},
		};

		const dao = new PrismaJobRoleDao(prisma as never);
		await dao.updateApplicationStatus(1, 'HIRED' as never);

		expect(prisma.application.update).toHaveBeenCalledWith({
			where: { applicationId: 1 },
			data: { status: 'HIRED' },
		});
	});

	it('decrements open positions for a job role', async () => {
		const prisma = {
			jobRole: {
				update: vi.fn().mockResolvedValue({}),
			},
		};

		const dao = new PrismaJobRoleDao(prisma as never);
		await dao.decrementOpenPositions(2);

		expect(prisma.jobRole.update).toHaveBeenCalledWith({
			where: { jobRoleId: 2 },
			data: { numberOfOpenPositions: { decrement: 1 } },
		});
	});
});
