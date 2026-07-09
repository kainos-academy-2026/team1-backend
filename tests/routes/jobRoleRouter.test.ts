import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
 
vi.hoisted(() => {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost/test';
});
 
vi.mock('@prisma/adapter-pg', () => ({
  PrismaPg: class PrismaPg {}
}));

vi.mock('../../src/generated/prisma/client', () => ({
  PrismaClient: class PrismaClient {
    jobRole = {
      findMany: vi.fn().mockResolvedValue([]),
    };
  },
}));
 
import JobRoleRouter from '../../src/routes/jobRoleRouter';
 
describe('JobRoleRouter', () => {
    it('wires GET /job-roles to controller.getAll', async () => {
        const app = express();
        app.use('/job-roles', JobRoleRouter);
 
        const response = await request(app).get('/job-roles');
 
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
});