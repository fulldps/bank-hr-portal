.PHONY: setup start stop restart logs seed

# Первый запуск на новом компьютере
setup:
	chmod +x setup.sh && ./setup.sh

# Запустить только БД
db:
	docker compose up -d postgres

# Остановить всё
stop:
	docker compose down

# Остановить и удалить данные БД (полный сброс)
reset:
	docker compose down -v

# Логи PostgreSQL
logs:
	docker compose logs -f postgres

# Пересоздать данные
seed:
	cd backend && npm run seed

# Статус контейнеров
status:
	docker compose ps
