import { z } from 'zod';

export enum JobRoleStatus {
	OPEN = 'OPEN',
	CLOSED = 'CLOSED',
}

export const JobRoleSchema = z.object({
	jobRoleId: z.number().int().positive(),
	roleName: z.string().min(1, 'Role name is required'),
	location: z.string().min(1, 'Location is required'),
	capabilityId: z.number().int().positive(),
	bandId: z.number().int().positive(),
	closingDate: z.date(),
	status: z.nativeEnum(JobRoleStatus),
});

export type JobRoleType = z.infer<typeof JobRoleSchema>;
