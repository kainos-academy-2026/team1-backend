# team1-backend

Kainos Job Roles API: a Node.js/Express backend using Prisma with PostgreSQL.

## Prerequisites

- Node.js >= 22
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

## Docker

This project includes a multi-stage Docker build in `Dockerfile`.

### Prerequisites

- Docker Desktop (or Docker Engine)
- A local corporate CA chain file named `corporate-ca.crt` in the project root

The Docker build copies `corporate-ca.crt` into both build and runtime images so Prisma and Node HTTPS requests trust your corporate TLS inspection chain.

### Create `corporate-ca.crt`

Export the required certificates from macOS Keychain and concatenate them into one PEM file:

```bash
security find-certificate -c "KAINOS-ZSCALER G2" -p > corporate-ca.crt
security find-certificate -c "KAINOS-INSPECTION G2" -p >> corporate-ca.crt
security find-certificate -c "KAINOS-ROOT-CA G2" -p >> corporate-ca.crt
```

Validate the file:

```bash
openssl x509 -in corporate-ca.crt -noout -subject -issuer
```

### Build the image

```bash
docker build --progress=plain -t team1-backend:secure .
```

### Run with Postgres from `compose.yml`

Start Postgres:

```bash
docker compose up -d postgres
```

Run the API container:

```bash
docker run --rm -d \
   --name team1-backend-local \
   -p 3001:3001 \
   --env-file .env \
   -e DATABASE_URL='postgresql://academy_user:academy_password@host.docker.internal:5432/academy_db' \
   team1-backend:secure
```

Check health:

```bash
curl -i http://localhost:3001/health
```

### Troubleshooting

- `COPY corporate-ca.crt ... not found`: ensure `corporate-ca.crt` exists in the project root.
- `unable to get local issuer certificate` during `prisma generate`: update `corporate-ca.crt` with the full corporate chain.
- `Missing authentication token` from `/job-roles`: call `/auth/login` first, then send `Authorization: Bearer <token>`.
- Login/API 500 errors in Docker: verify `DATABASE_URL` points to a reachable host from inside the container (for local Postgres on macOS use `host.docker.internal`).

## Git Hook Setup

This repository includes a pre-commit hook at `.githooks/pre-commit` that runs `npm run lint:fix` before each commit.

Run these commands once after cloning:

```bash
chmod +x .githooks/pre-commit
git config core.hooksPath .githooks
```

You can verify your Git hooks path with:

```bash
git config --get core.hooksPath
```

Expected output:

```text
.githooks
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
| `JWT_SECRET_KEY` | Secret key used to sign JWTs | —       |