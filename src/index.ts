import dotenv from 'dotenv';
import { app } from './app';
import { getPortFromEnv } from './port';

dotenv.config();

const PORT = getPortFromEnv();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;