import express, { Request, Response } from 'express';

export const getPortFromEnv = (portValue: string | undefined = process.env.PORT): number => {
  const port = Number(portValue ?? '3000');

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT value "${portValue}". PORT must be an integer between 1 and 65535.`);
  }

  return port;
};

export const app = express();

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'UP',
    time: new Date().toISOString(),
  });
});