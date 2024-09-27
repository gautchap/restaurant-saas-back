FROM node:20.17.0-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN pnpm add pm2 -g

# All deps stage
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
ADD package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile


# Production only deps stage
FROM base AS production-deps
WORKDIR /app
ADD package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile --prod
RUN wget https://gobinaries.com/tj/node-prune --output-document - | /bin/sh && node-prune

# Build stage
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN node ace build

# Production stage
FROM base
ENV NODE_ENV=production
WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
COPY ecosystem.config.cjs ./
EXPOSE 3333
CMD ["pm2-runtime", "ecosystem.config.cjs"] 
