# Install dependencies
FROM node:22-alpine AS deps
# Read https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
# to understand why need libc6-compat
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Use package management tool that you prefer
COPY package.json package-lock.json ./
RUN npm ci 

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js Telemetry
# Read more: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

#
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Only the standalone output + static assets — that's the whole point of
# `output: "standalone"` in next.config.js: a minimal runtime with no
# node_modules or source tree copied in.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]