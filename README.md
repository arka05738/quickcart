# QuickCart

QuickCart is a simple full-stack e-commerce demo built for a college assignment. It uses plain HTML/CSS/JavaScript on the frontend, Node.js with Express on the backend, and PostgreSQL for data storage. Docker Compose runs the app and database together.

## Technologies

- **Frontend:** HTML, CSS, JavaScript (no React, no Bootstrap)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Containers:** Docker + Docker Compose
- **Cart:** Browser `localStorage`

## Folder structure

```text
quickcart/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── db/
│   └── init.sql
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

## How to run with Docker (recommended)

```bash
docker compose build
docker compose up -d
docker compose ps
```

Open [http://localhost:3000](http://localhost:3000).

Stop everything:

```bash
docker compose down
```

## How to run locally

1. Copy environment variables:
```bash
cp .env.example .env
```

2. Start PostgreSQL (Docker is easiest):
```bash
docker compose up -d db
```

3. Install dependencies and start the server:
```bash
npm install
npm start
```

On Windows PowerShell you can set the env var for one session if needed:
```powershell
Copy-Item .env.example .env
$env:DATABASE_URL = "postgresql://postgres:postgres123@localhost:5432/quickcart"
npm install
npm start
```

> Tip: `server.js` reads `DATABASE_URL` from the environment. With Docker Compose the variable is injected automatically. For local Node, either export it or use a small loader; the simplest path for this assignment is Docker Compose for the full stack.

To load `.env` without extra packages when running locally, start Postgres with Compose and run Node with the URL set as shown above.

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/products` | List products from PostgreSQL |
| `POST` | `/api/orders` | Save a checkout order |
| `POST` | `/api/contact` | Save a contact message |

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

## Database

`db/init.sql` creates:

- `products`
- `orders`
- `contact_messages`

It also inserts **6 sample products**.

Default credentials (demo only):

- Database: `quickcart`
- User: `postgres`
- Password: `postgres123`

## How another teammate can clone and run it

```bash
git clone <your-repo-url>
cd quickcart
cp .env.example .env
docker compose up -d --build
```

Then open [http://localhost:3000](http://localhost:3000).

Features to verify:

1. Homepage loads and featured products appear from the API
2. Products page lists all 6 database products
3. Cart add / quantity / remove / total works (localStorage)
4. Checkout form creates a row in `orders`
5. Contact form creates a row in `contact_messages`
