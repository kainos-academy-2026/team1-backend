# team1-backend

Kainos Job Roles API: a Node.js/Express backend using Prisma with PostgreSQL.

## Prerequisites

- Node.js >= 20
- PostgreSQL database

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file from the example:

   ```bash
   cp .env.example .env
   ```

   Update `DATABASE_URL` with your database credentials.

3. Generate the Prisma client:

   ```bash
   npm run prisma:generate
   ```

4. Run database migrations:

   ```bash
   npx prisma migrate deploy
   ```

5. Seed the database:

   ```bash
   npm run seed
   ```

## Scripts

| Command                | Description                          |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Start dev server with auto-reload    |
| `npm run build`        | Generate Prisma client and compile   |
| `npm start`            | Run the compiled app                 |
| `npm test`             | Run tests                            |
| `npm run test:watch`   | Run tests in watch mode              |
| `npm run test:ui`      | Open Vitest UI                       |
| `npm run test:coverage`| Run tests with coverage              |
| `npm run lint`         | Check linting with Biome             |
| `npm run lint:fix`     | Auto-fix lint issues                 |
| `npm run seed`         | Seed the database                    |

## Environment Variables

| Variable       | Description                  | Default |
| -------------- | ---------------------------- | ------- |
| `DATABASE_URL` | PostgreSQL connection string | —       |
| `PORT`         | Server port                  | `3001`  |