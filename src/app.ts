import cors from 'cors';
import express from 'express';
import JobRoleRouter from './routes/jobRoleRouter.js';
import AuthRouter from './routes/loginRouter.js';

const app = express();

const corsOrigins = process.env.CORS_ORIGIN?.split(',')
	.map((origin) => origin.trim())
	.filter((origin) => origin.length > 0);

app.use(
	cors({
		origin: corsOrigins && corsOrigins.length > 0 ? corsOrigins : true,
		credentials: true,
	}),
);

app.use(express.json());

app.get('/health', (_req, res) => {
	res.json({ status: 'OK', time: new Date().toISOString() });
});

app.use('/auth', AuthRouter);
app.use('/job-roles', JobRoleRouter);

export { app };
