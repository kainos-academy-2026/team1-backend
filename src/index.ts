import dotenv from 'dotenv';
import { createApp, getPortFromEnv } from './server';

dotenv.config();

const app = createApp();
const PORT = getPortFromEnv();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;