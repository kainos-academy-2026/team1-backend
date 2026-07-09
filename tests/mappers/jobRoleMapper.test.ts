import { describe, expect, it } from 'vitest';
import JobRoleMapper from '../../src/mappers/jobRoleMapper';
import { type JobRole, JobRoleStatus } from '../../src/models/jobRole';

describe('JobRoleMapper', () => {
	it('maps a prisma job role into a response DTO', () => {
		const mapper = new JobRoleMapper();
		const closingDate = new Date('2026-07-01T00:00:00.000Z');
		const jobRole: JobRole = {
			jobRoleId: 1,
			roleName: 'Engineer',
			location: 'Belfast',
			capabilityId: 2,
			bandId: 3,
			closingDate,
			status: JobRoleStatus.OPEN,
		};

		expect(mapper.toJobRoleResponse(jobRole)).toEqual({
			id: 1,
			roleName: 'Engineer',
			location: 'Belfast',
			capabilityId: 2,
			bandId: 3,
			closingDate: '2026-07-01 00:00:00',
			status: 'open',
		});
	});
});
