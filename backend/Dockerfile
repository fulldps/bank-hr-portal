# ---- Этап 1: сборка ----
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
# Устанавливаем ВСЕ зависимости, включая dev (typescript, etc.)
RUN npm ci

COPY . .
RUN npm run build

# ---- Этап 2: финальный образ ----
FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./
# Только prod-зависимости — образ будет меньше
RUN npm ci --omit=dev

# Копируем только собранный dist из этапа сборки
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/server.js"]
