# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base
WORKDIR /app

RUN apt-get update \
	&& apt-get install -y --no-install-recommends ca-certificates openssl \
	&& rm -rf /var/lib/apt/lists/*

# Optional: Install corporate CA certificate if present in build context
# To use: place corporate-ca.crt in the project root and build normally
COPY corporate-ca.cr[t] /usr/local/share/ca-certificates/corporate-ca.crt
RUN update-ca-certificates

# Tell Node.js where to find additional CA certificates
ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/corporate-ca.crt

FROM base AS deps

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM deps AS build

COPY prisma ./prisma
RUN npm run prisma:generate

COPY tsconfig.json ./
COPY src ./src

RUN npx tsc

FROM base AS prod-deps

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

FROM base AS runner

ENV NODE_ENV=production

RUN useradd --create-home --shell /usr/sbin/nologin appuser

COPY --from=build --chown=appuser:appuser /app/dist ./dist
COPY --from=prod-deps --chown=appuser:appuser /app/node_modules ./node_modules

USER appuser
EXPOSE 3001

CMD ["node", "dist/index.js"]