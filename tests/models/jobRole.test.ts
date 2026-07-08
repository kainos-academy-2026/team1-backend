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
		const jobRole = new JobRole(...validArgs);

		expect(jobRole.jobRoleId).toBe(1);
		expect(jobRole.roleName).toBe('Engineer');
		expect(jobRole.status).toBe(JobRoleStatus.OPEN);
	});

	it('throws when id is not greater than 0', () => {
		expect(
			() =>
				new JobRole(
					0,
					validArgs[1],
					validArgs[2],
					validArgs[3],
					validArgs[4],
					validArgs[5],
					validArgs[6],
				),
		).toThrow('ID must be greater than 0');
	});

	it('throws when role name is missing', () => {
		expect(
			() =>
				new JobRole(
					validArgs[0],
					'',
					validArgs[2],
					validArgs[3],
					validArgs[4],
					validArgs[5],
					validArgs[6],
				),
		).toThrow('Role name is required');
	});

	it('throws when location is missing', () => {
		expect(
			() =>
				new JobRole(
					validArgs[0],
					validArgs[1],
					'',
					validArgs[3],
					validArgs[4],
					validArgs[5],
					validArgs[6],
				),
		).toThrow('Location is required');
	});

	it('throws when capability id is missing', () => {
		expect(
			() =>
				new JobRole(
					validArgs[0],
					validArgs[1],
					validArgs[2],
					0,
					validArgs[4],
					validArgs[5],
					validArgs[6],
				),
		).toThrow('Capability ID is required');
	});

	it('throws when band id is missing', () => {
		expect(
			() =>
				new JobRole(
					validArgs[0],
					validArgs[1],
					validArgs[2],
					validArgs[3],
					0,
					validArgs[5],
					validArgs[6],
				),
		).toThrow('Band ID is required');
	});

	it('throws when closing date is missing', () => {
		expect(
			() =>
				new JobRole(
					validArgs[0],
					validArgs[1],
					validArgs[2],
					validArgs[3],
					validArgs[4],
					null as never,
					validArgs[6],
				),
		).toThrow('Closing date is required');
	});

	it('throws when status is missing', () => {
		expect(
			() =>
				new JobRole(
					validArgs[0],
					validArgs[1],
					validArgs[2],
					validArgs[3],
					validArgs[4],
					validArgs[5],
					undefined as never,
				),
		).toThrow('Status is required');
	});
});
