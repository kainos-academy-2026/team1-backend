import { describe, expect, it } from 'vitest';
import { JobRoleSchema, JobRoleStatus } from '../../src/models/jobRole';

describe('JobRole', () => {
	const validInput = {
		jobRoleId: 1,
		roleName: 'Engineer',
		location: 'Belfast',
		capabilityId: 2,
		bandId: 3,
		closingDate: new Date('2026-07-01T00:00:00.000Z'),
		status: JobRoleStatus.OPEN,
	} as const;

	it('parses a job role when all fields are valid', () => {
		const result = JobRoleSchema.safeParse(validInput);

		expect(result.success).toBe(true);
		if (!result.success) {
			throw new Error('Expected schema parse to succeed');
		}

		expect(result.data.jobRoleId).toBe(1);
		expect(result.data.roleName).toBe('Engineer');
		expect(result.data.status).toBe(JobRoleStatus.OPEN);
	});

	it('fails when id is not greater than 0', () => {
		const result = JobRoleSchema.safeParse({ ...validInput, jobRoleId: 0 });

		expect(result.success).toBe(false);
		if (result.success) {
			throw new Error('Expected schema parse to fail');
		}

		expect(result.error.issues[0]?.path).toEqual(['jobRoleId']);
	});

	it('fails when role name is missing', () => {
		const result = JobRoleSchema.safeParse({ ...validInput, roleName: '' });

		expect(result.success).toBe(false);
		if (result.success) {
			throw new Error('Expected schema parse to fail');
		}

		expect(result.error.issues[0]?.path).toEqual(['roleName']);
		expect(result.error.issues[0]?.message).toBe('Role name is required');
	});

	it('fails when location is missing', () => {
		const result = JobRoleSchema.safeParse({ ...validInput, location: '' });

		expect(result.success).toBe(false);
		if (result.success) {
			throw new Error('Expected schema parse to fail');
		}

		expect(result.error.issues[0]?.path).toEqual(['location']);
		expect(result.error.issues[0]?.message).toBe('Location is required');
	});

	it('fails when capability id is missing', () => {
		const result = JobRoleSchema.safeParse({ ...validInput, capabilityId: 0 });

		expect(result.success).toBe(false);
		if (result.success) {
			throw new Error('Expected schema parse to fail');
		}

		expect(result.error.issues[0]?.path).toEqual(['capabilityId']);
	});

	it('fails when band id is missing', () => {
		const result = JobRoleSchema.safeParse({ ...validInput, bandId: 0 });

		expect(result.success).toBe(false);
		if (result.success) {
			throw new Error('Expected schema parse to fail');
		}

		expect(result.error.issues[0]?.path).toEqual(['bandId']);
	});

	it('fails when closing date is missing', () => {
		const result = JobRoleSchema.safeParse({
			...validInput,
			closingDate: null as never,
		});

		expect(result.success).toBe(false);
		if (result.success) {
			throw new Error('Expected schema parse to fail');
		}

		expect(result.error.issues[0]?.path).toEqual(['closingDate']);
	});

	it('fails when status is missing', () => {
		const result = JobRoleSchema.safeParse({
			...validInput,
			status: undefined as never,
		});

		expect(result.success).toBe(false);
		if (result.success) {
			throw new Error('Expected schema parse to fail');
		}

		expect(result.error.issues[0]?.path).toEqual(['status']);
	});
});
