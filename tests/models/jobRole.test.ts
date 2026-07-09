import { describe, expect, it } from 'vitest';
import { JobRole, JobRoleStatus } from '../../src/models/jobRole';

describe('JobRole', () => {
	const validArgs = [
		1,
		'Engineer',
		'Belfast',
		2,
		3,
		new Date('2026-07-01T00:00:00.000Z'),
		JobRoleStatus.OPEN,
	] as const;

	it('creates a job role when all fields are valid', () => {
		const jobRole: JobRole = {
			jobRoleId: 1,
			roleName: 'Engineer',
			location: 'Belfast',
			capabilityId: 2,
			bandId: 3,
			closingDate: new Date('2026-07-01T00:00:00.000Z'),
			status: JobRoleStatus.OPEN,
		};

		expect(jobRole.jobRoleId).toBe(1);
		expect(jobRole.roleName).toBe('Engineer');
		expect(jobRole.status).toBe(JobRoleStatus.OPEN);
	});

});
