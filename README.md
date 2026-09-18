# QuickCart (No-Database Version)

QuickCart is a simple full-stack e-commerce demo for a college assignment. This version uses plain HTML/CSS/JavaScript on the frontend and Node.js + Express on the backend. **It does not use PostgreSQL or any database.**

Products are loaded from a local JSON file. Orders and contact messages are accepted by the API and stored in memory for the running process only (they reset when the server restarts). The shopping cart still uses browser `localStorage`.

## Technologies

- **Frontend:** HTML, CSS, JavaScript (no React, no Bootstrap)
- **Backend:** Node.js + Express
- **Data:** Local JSON file (`data/products.json`) — no database
- **Containers:** Docker + Docker Compose (app only)
- **Cart:** Browser `localStorage`

## Folder structure

```text
quickcart/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── data/
│   └── products.json
├── server.js
├── package.json
├── package-lock.json
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env.example
├── .gitignore
└── README.md
```

## How to run locally

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

Optional: copy `.env.example` to `.env` if you want to set `PORT`.

## How to run with Docker

```bash
docker compose build
docker compose up -d
docker compose ps
```

Open [http://localhost:3000](http://localhost:3000).

Stop:

```bash
docker compose down
```

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/products` | List products from `data/products.json` |
| `POST` | `/api/orders` | Accept an order (stored in memory, no DB) |
| `POST` | `/api/contact` | Accept a contact message (stored in memory, no DB) |

### Example order body

```json
{
  "customer_name": "Alex Student",
  "email": "alex@example.com",
  "address": "123 Campus Road",
  "total": 104.98
}
```

### Example contact body

```json
{
  "name": "Alex Student",
  "email": "alex@example.com",
  "message": "Do you ship internationally?"
}
```

## Cloud deployment notes

- Listen address is `0.0.0.0` so cloud platforms can reach the app.
- Port comes from `process.env.PORT` (falls back to `3000`).
- No `DATABASE_URL` or database credentials are required.

## How another teammate can clone and run it

```bash
git clone <your-repo-url>
cd quickcart
npm install
npm start
```

Or with Docker:

```bash
git clone <your-repo-url>
cd quickcart
docker compose up -d --build
```

Features to verify:

1. Homepage loads and featured products appear from the API
2. Products page lists all 6 products from JSON
3. Cart add / quantity / remove / total works (localStorage)
4. Checkout form succeeds via `POST /api/orders` (no database)
5. Contact form succeeds via `POST /api/contact` (no database)
