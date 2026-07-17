import { z } from 'zod';

export enum JobRoleStatus {
	OPEN = 'open',
	CLOSED = 'closed',
}

export const JobRoleSchema = z.object({
	jobRoleId: z.number().int().positive(),
	roleName: z.string().min(1, 'Role name is required'),
	location: z.string().min(1, 'Location is required'),
	capabilityId: z.number().int().positive(),
	bandId: z.number().int().positive(),
	closingDate: z.date(),
	status: z.enum(JobRoleStatus),
	specification: z.url('Specification must be a valid URL'),
	description: z.string().min(1, 'Description is required'),
	responsibilities: z.string().min(1, 'Responsibilities are required'),
	numberOfOpenPositions: z.number().int().nonnegative(),
});

export type JobRoleType = z.infer<typeof JobRoleSchema>;
