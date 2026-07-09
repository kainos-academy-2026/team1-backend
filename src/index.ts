import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('DATABASE_URL is not set');
}

const PORT = Number(process.env.PORT) || 3001;

async function start() {
	const { app } = await import('./app.js');

	app.listen(PORT, () => {
		console.log(`Server running on http://localhost:${PORT}`);
		console.log(`Try: http://localhost:${PORT}/health`);
	});
}

void start();
