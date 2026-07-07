export const getPortFromEnv = (portValue: string | undefined = process.env.PORT): number => {
  const port = Number(portValue ?? '3000');

  return port;
};