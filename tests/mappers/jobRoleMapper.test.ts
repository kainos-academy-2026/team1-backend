import { describe, expect, it } from 'vitest';
import JobRoleMapper from '../../src/mappers/jobRoleMapper';
import type { JobRole } from '../../src/generated/prisma/client';

describe('JobRoleMapper', () => {
	it('maps a prisma job role into a response DTO', () => {
		const mapper = new JobRoleMapper();
		const closingDate = '2026-07-01T00:00:00.000Z';
		const jobRole = {
			jobRoleId: 1,
			roleName: 'Engineer',
			location: 'Belfast',
			capabilityId: 2,
			bandId: 3,
			closingDate,
			status: 'open',
		} as JobRole;

		expect(mapper.toJobRoleResponse(jobRole)).toEqual({
			id: 1,
			roleName: 'Engineer',
			location: 'Belfast',
			capabilityId: 2,
			bandId: 3,
			closingDate: new Date(closingDate),
			status: 'open',
		});
	});
});