import { describe, expect, it } from 'vitest';
import type { JobRole } from '../../src/generated/prisma/client.js';
import JobRoleMapper from '../../src/mappers/jobRoleMapper.js';
import type { JobRole } from '../../src/generated/prisma/client.js';
import JobRoleMapper from '../../src/mappers/jobRoleMapper.js';

describe('JobRoleMapper', () => {
	it('maps a prisma job role into a response DTO', () => {
		const mapper = new JobRoleMapper();
		const closingDate = new Date('2026-07-01T00:00:00.000Z');
		const jobRole = {
			jobRoleId: 1,
			roleName: 'Engineer',
			location: 'Belfast',
			capabilityId: 2,
			bandId: 3,
			closingDate,
			status: 'OPEN',
		} as JobRole;

		expect(mapper.toJobRoleResponse(jobRole)).toEqual({
			id: 1,
			roleName: 'Engineer',
			location: 'Belfast',
			capabilityId: 2,
			bandId: 3,
			closingDate: new Date(closingDate),
			status: 'OPEN',
		});
	});

	it('maps a detailed prisma job role into a detailed response DTO', () => {
		const mapper = new JobRoleMapper();
		const closingDate = new Date('2026-07-01T00:00:00.000Z');
		const jobRole = {
			jobRoleId: 1,
			roleName: 'Engineer',
			location: 'Belfast',
			capabilityId: 2,
			bandId: 3,
			closingDate,
			status: 'open',
			specification: 'https://example.com/specification.pdf',
			description: 'Build and maintain backend services.',
			responsibilities: 'Design, implement, test, and support APIs.',
			numberOfOpenPositions: 2,
			capability: {
				capabilityId: 2,
				capabilityName: 'Engineering',
			},
			band: {
				bandId: 3,
				bandName: 'Associate',
			},
		};

		expect(mapper.toDetailedJobRoleResponse(jobRole as never)).toEqual({
			id: 1,
			roleName: 'Engineer',
			location: 'Belfast',
			capabilityId: 2,
			capabilityName: 'Engineering',
			bandId: 3,
			bandName: 'Associate',
			closingDate: new Date(closingDate),
			status: 'OPEN',
		});
	});

	it('maps a detailed prisma job role into a detailed response DTO', () => {
		const mapper = new JobRoleMapper();
		const closingDate = new Date('2026-07-01T00:00:00.000Z');
		const jobRole = {
			jobRoleId: 1,
			roleName: 'Engineer',
			location: 'Belfast',
			capabilityId: 2,
			bandId: 3,
			closingDate,
			status: 'open',
			specification: 'https://example.com/specification.pdf',
			description: 'Build and maintain backend services.',
			responsibilities: 'Design, implement, test, and support APIs.',
			numberOfOpenPositions: 2,
			capability: {
				capabilityId: 2,
				capabilityName: 'Engineering',
			},
			band: {
				bandId: 3,
				bandName: 'Associate',
			},
		};

		expect(mapper.toDetailedJobRoleResponse(jobRole as never)).toEqual({
			id: 1,
			roleName: 'Engineer',
			location: 'Belfast',
			capabilityId: 2,
			capabilityName: 'Engineering',
			bandId: 3,
			bandName: 'Associate',
			closingDate: new Date(closingDate),
			status: 'OPEN',
		});
	});

	it('maps a detailed prisma job role into a detailed response DTO', () => {
		const mapper = new JobRoleMapper();
		const closingDate = new Date('2026-07-01T00:00:00.000Z');
		const jobRole = {
			jobRoleId: 1,
			roleName: 'Engineer',
			location: 'Belfast',
			capabilityId: 2,
			bandId: 3,
			closingDate,
			status: 'open',
			specification: 'https://example.com/specification.pdf',
			description: 'Build and maintain backend services.',
			responsibilities: 'Design, implement, test, and support APIs.',
			numberOfOpenPositions: 2,
			capability: {
				capabilityId: 2,
				capabilityName: 'Engineering',
			},
			band: {
				bandId: 3,
				bandName: 'Associate',
			},
		};

		expect(mapper.toDetailedJobRoleResponse(jobRole as never)).toEqual({
			id: 1,
			roleName: 'Engineer',
			location: 'Belfast',
			capabilityId: 2,
			capabilityName: 'Engineering',
			bandId: 3,
			bandName: 'Associate',
			closingDate: new Date(closingDate),
			specification: 'https://example.com/specification.pdf',
			description: 'Build and maintain backend services.',
			responsibilities: 'Design, implement, test, and support APIs.',
			numberOfOpenPositions: 2,
			status: 'OPEN',
		});
	});
});
