import { describe, expect, it } from 'vitest';
import { type JobRole, JobRoleStatus } from '../../src/models/jobRole';

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
		const [
			jobRoleId,
			roleName,
			location,
			capabilityId,
			bandId,
			closingDate,
			status,
		] = validArgs;

		const jobRole: JobRole = {
			jobRoleId,
			roleName,
			location,
			capabilityId,
			bandId,
			closingDate,
			status,
		};

		expect(jobRole.jobRoleId).toBe(jobRoleId);
		expect(jobRole.roleName).toBe(roleName);
		expect(jobRole.status).toBe(status);
	});
});
