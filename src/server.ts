import express, { Request, Response } from 'express';

export const getPortFromEnv = (portValue: string | undefined = process.env.PORT): number => {
  const rawPort = portValue ?? '3000';

  if (!/^\d+$/.test(rawPort)) {
    throw new Error(`Invalid PORT value "${portValue}". PORT must be an integer between 1 and 65535.`);
  }

  const port = Number(rawPort);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT value "${portValue}". PORT must be an integer between 1 and 65535.`);
  }

  return port;
};

export const createApp = () => {
  const app = express();

  app.use(express.json());

  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'UP',
      time: new Date().toISOString(),
    });
  });

  return app;
};