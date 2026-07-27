# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
WORKDIR /app

RUN apk add --no-cache ca-certificates openssl

COPY corporate-ca.crt /usr/local/share/ca-certificates/corporate-ca.crt
RUN update-ca-certificates
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

# Create a dedicated non-root user for runtime.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=build /app/package*.json ./
COPY --from=build --chown=appuser:appgroup /app/dist ./dist
COPY --from=prod-deps --chown=appuser:appgroup /app/node_modules ./node_modules

USER appuser
EXPOSE 3001

CMD ["node", "dist/index.js"]