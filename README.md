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

The Dockerfile expects an optional `corporate-ca.crt` file in the project root. This file is **not tracked in git** for security reasons (to prevent accidental commits of real certificates).

**For local development:**

1. Create your corporate CA certificate file:

```bash
security find-certificate -c "KAINOS-ZSCALER G2" -p > corporate-ca.crt
security find-certificate -c "KAINOS-INSPECTION G2" -p >> corporate-ca.crt
security find-certificate -c "KAINOS-ROOT-CA G2" -p >> corporate-ca.crt
```

2. Validate the certificate:

```bash
openssl x509 -in corporate-ca.crt -noout -subject -issuer
```

**For CI/CD environments:**

If your CI/CD pipeline doesn't have a corporate certificate file, the `COPY corporate-ca.cr[t]` instruction uses bracket expansion syntax which gracefully handles missing files. The build will continue, and `NODE_EXTRA_CA_CERTS` is set in case a certificate is present at runtime.

Alternatively, provide the certificate as a CI/CD secret and add it to the build context before building the Docker image.

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

- `unable to get local issuer certificate` during `prisma generate` or Docker build: create the `corporate-ca.crt` file with your corporate certificate chain as described in the Certificate Handling section.
- `Missing authentication token` from `/job-roles`: call `/auth/login` first, then send `Authorization: Bearer <token>`.
- Login/API 500 errors in Docker: verify `DATABASE_URL` points to a reachable host from inside the container (for local Postgres on macOS use `host.docker.internal`).

## Git Hook Setup

This repository includes a pre-commit hook at `.githooks/pre-commit` that runs `npm run lint:fix` before each commit.

Run this once after cloning:

```bash
npm run setup:hooks
```

Manual equivalent:

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