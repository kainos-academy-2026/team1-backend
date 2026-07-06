import { createApp, getPortFromEnv } from './server';

const app = createApp();
const PORT = getPortFromEnv();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;