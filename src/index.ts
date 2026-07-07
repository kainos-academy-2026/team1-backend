import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';

dotenv.config();

const app = express();
const PORT = Number.parseInt(process.env.PORT ?? '3000', 10);

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
	throw new Error(
		`Invalid PORT value "${process.env.PORT}". PORT must be an integer between 1 and 65535.`,
	);
}

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
	res.json({
		status: 'UP',
		time: new Date().toISOString(),
	});
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

export default app;
