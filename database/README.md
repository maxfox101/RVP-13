# БазМет — база данных (работа № 8)

Серверная часть на **Node.js + Express** с хранением в **PostgreSQL**.  
API совместим с работой № 7, клиент React подключается так же через `/api`.

Используются **две базы** в одном кластере (порт **5433**):

| БД | Назначение |
|---|---|
| `bazmet` | каталог, услуги, фильтры, картинки (`BYTEA`) |
| `bazmet_orders` | пользователи (`customers`) и заявки (`orders`) |

## Почему PostgreSQL

| Критерий | Выбор |
|---|---|
| Тип данных | Каталог с фильтрами, заявки — таблицы + массивы/`JSONB` |
| Надёжность | ACID, PRIMARY KEY / NOT NULL / FOREIGN KEY |
| Запросы | SQL-фильтры, `JOIN` заявок с пользователями |
| Картинки | Можно хранить файлы в `BYTEA` (таблица `images`) |
| MongoDB | Удобна для «как есть» JSON, но связи и отчёты проще в PostgreSQL |

## Схема

### БД `bazmet`

| Таблица | Что хранит |
|---|---|
| `categories` | Гайки, болты, винты… |
| `services` | Услуги завода |
| `products` | 15 изделий (`materials[]`, `coatings[]`, `fields` JSONB) |
| `filters` | Варианты селектов (JSONB) |
| `images` | JPG в `BYTEA` (путь `/images/...`) |

### БД `bazmet_orders`

| Таблица | Что хранит |
|---|---|
| `customers` | Пользователи (name, phone, email UNIQUE) |
| `orders` | Заявки (`customer_id` → `customers.id`) |

Локальный кластер: каталог `.pg-bazmet`, пользователь `bazmet` (trust на localhost).

## Запуск

```bash
cd /Users/maksim/Documents/database
npm run db:start
npm run seed          # создаёт bazmet_orders при необходимости
npm run dev           # http://127.0.0.1:3001

# клиент
cd /Users/maksim/Documents/react
npm run dev           # http://127.0.0.1:5173
```

Остановить БД: `npm run db:stop`

## Проверка

```bash
export PATH="/Library/PostgreSQL/18/bin:$PATH"

# каталог
psql -h 127.0.0.1 -p 5433 -U bazmet -d bazmet -c 'SELECT count(*) FROM products;'
psql -h 127.0.0.1 -p 5433 -U bazmet -d bazmet -c 'SELECT count(*), pg_size_pretty(sum(length(data))) FROM images;'

# заявки
psql -h 127.0.0.1 -p 5433 -U bazmet -d bazmet_orders -c '
SELECT c.name, c.email, o.id, o.service
FROM customers c JOIN orders o ON o.customer_id = c.id;'

curl http://127.0.0.1:3001/api/health
# → "databases":{"catalog":"bazmet","orders":"bazmet_orders"}

curl -X POST http://127.0.0.1:3001/api/orders \
  -H 'Content-Type: application/json' \
  -d '{"name":"Тест","phone":"+7 (900) 000 - 00 - 00","email":"t@test.ru","service":"Винты","description":"demo"}'
```

## Пункты задания № 8

1. Продумано хранение: две БД, таблицы выше (`src/schema.sql`, `src/schema-orders.sql`).
2. Заполнение: `npm run seed` (каталог + картинки + демо-пользователи/заявки).
3. Сервер на БД: два пула `pg` (`src/db.js`), заявки через `ordersService.js`.

## Docker (работа № 13)

Стек поднимается из соседней папки `react` (CMS не входит):

```bash
cd ../react
docker compose up --build -d
# сайт http://127.0.0.1:8080
```

Образ API собирается из этого репозитория (`Dockerfile`, `scripts/docker-entrypoint.sh`, `docker/init`).
