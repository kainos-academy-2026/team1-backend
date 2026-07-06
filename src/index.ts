import dotenv from 'dotenv';
import { app, getPortFromEnv } from './server';

dotenv.config();

const PORT = getPortFromEnv();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;