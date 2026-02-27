# 1. Stage: Deps (Установка зависимостей)
FROM node:22-slim AS deps
WORKDIR /app

# Устанавливаем OpenSSL (нужен для Prisma)
RUN apt-get update -y && apt-get install -y openssl

# Включаем pnpm
RUN corepack enable

COPY package.json pnpm-lock.yaml ./

# Устанавливаем зависимости
RUN pnpm install --no-frozen-lockfile

# 2. Stage: Builder (Сборка приложения)
FROM node:22-slim AS builder
WORKDIR /app
RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Генерируем клиент Prisma
RUN pnpm exec prisma generate

# Собираем Next.js
RUN pnpm build

# 3. Stage: Runner (Запуск)
FROM node:22-slim AS runner
WORKDIR /app

# Устанавливаем OpenSSL для финального образа
RUN apt-get update -y && apt-get install -y openssl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем публичные файлы и standalone-сборку
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]