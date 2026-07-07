import { JobRole } from "../generated/prisma/client";

export interface JobRoleDao {
	findAll(): Promise<JobRole[]>;
}
