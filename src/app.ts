import express from 'express';
import JobRoleRouter from './routes/jobRoleRouter.js';
import AuthRouter from './routes/loginRouter.js';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
	res.json({ status: 'OK', time: new Date().toISOString() });
});

app.use('/auth', AuthRouter);
app.use('/job-roles', JobRoleRouter);

export { app };
