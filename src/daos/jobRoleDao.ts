import type { JobRole } from '../models/jobRole';

export interface CreateJobRoleInput {
    roleName: string;
    location: string;
    capabilityId: number;
    bandId: number;
    closingDate: string;
    status: string;
}

export interface UpdateJobRoleInput {
    roleName?: string;
    location?: string;
    capabilityId?: number;
    bandId?: number;
    closingDate?: string;
    status?: string;
}

export interface JobRoleDao {
    findAll(): Promise<JobRole[]>;
    findById(jobRoleId: number): Promise<JobRole | null>;
    create(input: CreateJobRoleInput): Promise<JobRole>;
    update(jobRoleId: number, input: UpdateJobRoleInput): Promise<JobRole | null>;
    delete(jobRoleId: number): Promise<boolean>;
}

