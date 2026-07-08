import { z } from 'zod';
import { JobRoleStatus } from '../models/jobRole';

export const JobRoleResponseSchema = z.object({
	id: z.number().int().positive(),
	roleName: z.string().min(1, 'Role name is required'),
	location: z.string().min(1, 'Location is required'),
	capabilityId: z.number().int().positive(),
	bandId: z.number().int().positive(),
	closingDate: z.date(),
	status: z.nativeEnum(JobRoleStatus),
});

export type JobRoleResponse = z.infer<typeof JobRoleResponseSchema>;
