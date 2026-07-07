import type { JobRoleResponse } from '../dtos/jobRoleResponse';
import { JobRole } from '../models/jobRole';

type JobRoleRow = {
    jobRoleId: number;
    roleName: string;
    location: string;
    capabilityId: number;
    bandId: number;
    closingDate: string;
    status: string;
};

export function toJobRoleResponse(jobRole: JobRole): JobRoleResponse {
    return {
        id: jobRole.jobRoleId,
        roleName: jobRole.roleName,
        location: jobRole.location,
        capabilityId: jobRole.capabilityId,
        bandId: jobRole.bandId,
        closingDate: jobRole.closingDate,
        status: jobRole.status,
    };
}

export function toJobRole(row: JobRoleRow): JobRole {
    return new JobRole(
        row.jobRoleId,
        row.roleName,
        row.location,
        row.capabilityId,
        row.bandId,
        row.closingDate,
        row.status,
    );
}