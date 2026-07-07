import express, { Request, Response } from 'express';

export const app = express();

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'UP',
    time: new Date().toISOString(),
  });
});
