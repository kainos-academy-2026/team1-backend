import express from 'express';
import AuthRouter from './routes/authRouter';
import JobRoleRouter from './routes/jobRoleRouter';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
	res.json({ status: 'OK', time: new Date().toISOString() });
});

app.use('/auth', AuthRouter);
app.use('/job-roles', JobRoleRouter);

export { app };
