#!/bin/bash

echo "=== BNB HR Portal — Setup ==="

# Проверяем Docker
if ! command -v docker &>/dev/null; then
  echo "❌ Docker не установлен. Установи Docker Desktop: https://docker.com"
  exit 1
fi

# Проверяем Node.js
if ! command -v node &>/dev/null; then
  echo "❌ Node.js не установлен. Установи Node.js 18+: https://nodejs.org"
  exit 1
fi

echo "✅ Docker и Node.js найдены"

# Устанавливаем зависимости бэкенда
echo "📦 Устанавливаем зависимости backend..."
cd backend && npm install
cd ..

# Устанавливаем зависимости фронтенда
echo "📦 Устанавливаем зависимости frontend..."
cd frontend && npm install
cd ..

# Копируем .env если не существует
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "✅ Создан backend/.env из .env.example"
fi

if [ ! -f frontend/.env ]; then
  cp frontend/.env.example frontend/.env
  echo "✅ Создан frontend/.env из .env.example"
fi

# Запускаем PostgreSQL через Docker
echo "🐳 Запускаем PostgreSQL..."
docker compose up -d postgres

# Ждём пока база поднимется
echo "⏳ Ждём запуска базы данных..."
until docker compose exec postgres pg_isready -U bnb_user -d bnb_hr_portal &>/dev/null; do
  sleep 1
done

echo "✅ База данных готова"

# Запускаем seed
echo "🌱 Заполняем базу тестовыми данными..."
cd backend && npm run seed
cd ..

echo ""
echo "=== ✅ Проект готов к разработке ==="
echo ""
echo "Запусти бэкенд:  cd backend && npm run dev"
echo "Запусти фронт:   cd frontend && npm run dev"
echo ""
