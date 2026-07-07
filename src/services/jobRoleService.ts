import type { JobRole } from '../models/jobRole';
import type { JobRoleDao } from '../daos/jobRoleDao';

export class JobRoleService {
    constructor(private readonly jobRoleDao: JobRoleDao) {}

    async findAll(): Promise<JobRole[]> {
        return this.jobRoleDao.findAll();
    }
}