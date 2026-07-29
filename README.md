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

This project includes two multi-stage Docker builds: `Dockerfile` for the standard Node runtime and `Dockerfile.distroless` for the distroless runtime.

### Prerequisites

- Docker Desktop (or Docker Engine)

### Certificate Handling

A placeholder `corporate-ca.crt` file is tracked in the repository. This ensures Docker builds work in any environment (local, CI/CD, cloned machines) without certificate configuration friction.

**For local development with corporate certificates:**

1. Replace the placeholder with your actual certificate chain:

```bash
security find-certificate -c "KAINOS-ZSCALER G2" -p > corporate-ca.crt
security find-certificate -c "KAINOS-INSPECTION G2" -p >> corporate-ca.crt
security find-certificate -c "KAINOS-ROOT-CA G2" -p >> corporate-ca.crt
```

2. Validate the certificate:

```bash
openssl x509 -in corporate-ca.crt -noout -subject -issuer
```

Your certificate will be used during build; the repo's `.gitignore` prevents it from being committed.

**For CI/CD and other environments:**

The placeholder file ensures `COPY corporate-ca.cr[t]` succeeds without errors, and `NODE_EXTRA_CA_CERTS` environment variable is set in the base stage to point Node.js to the certificate location.

### Build the image

```bash
docker build --progress=plain -t team1-backend:local .
docker build --progress=plain -f Dockerfile.distroless -t team1-backend:distroless .
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
   team1-backend:local
```

Check health:

```bash
curl -i http://localhost:3001/health
```

### Troubleshooting

- `unable to get local issuer certificate` during `prisma generate`: replace the placeholder `corporate-ca.crt` with your actual corporate certificate chain.
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