import { z } from 'zod';

export const ApplyJobRoleRequestSchema = z
	.object({
		fileName: z.string().min(1, 'File name is required'),
		contentType: z.literal(
			'application/pdf',
			'CV must be a PDF (application/pdf)',
		),
	})
	.strict();

export type ApplyJobRoleRequest = z.infer<typeof ApplyJobRoleRequestSchema>;

export default ApplyJobRoleRequestSchema;
