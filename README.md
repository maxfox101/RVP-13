# RVP-13 — Docker (БазМет)

## Что это
Развёртывание одной командой: PostgreSQL + Express + React/Nginx. Папка `database/` уже внутри репозитория.

## Как запустить
Нужен Docker Desktop (или Colima).
```bash
docker compose up --build -d
```
Сайт: http://127.0.0.1:8080  
Остановка: `docker compose down`
