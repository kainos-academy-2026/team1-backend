import { JobRole } from "../models/jobRole";
import { JobRoleResponse } from "../models/jobRoleResponse";

export function toJobRoleResponse(jobRole: JobRole): JobRoleResponse {
    return {
        id: jobRole.id,
        name: jobRole.name,
        location: jobRole.location,
        capability: jobRole.capability,
        band: jobRole.band,
        closingDate: jobRole.closingDate,
        status: jobRole.status,
    };
}