# AAIM Portal

A secure team collaboration platform for managing patient case workflows and interdepartmental notifications. Built as a replacement for a Power BI / Power App setup.

Teams — **Home Office**, **NCM**, **SP**, and **ISS** — can view a shared patient dashboard, send notifications to each other, reply, and acknowledge.

## Stack

- **Backend:** FastAPI + PostgreSQL (SQLAlchemy)
- **Frontend:** React + Vite
- **Deployment:** Railway (single Docker service)

## Local Development

### Prerequisites
- Python 3.12+
- Node 20+
- PostgreSQL running locally

### Backend

```bash
cd backend
pip install -r requirements.txt
DATABASE_URL=postgresql://localhost/aaim uvicorn app.main:app --reload
```

The server auto-creates tables and seeds demo data on first start.

### Frontend

```bash
cd frontend
npm install
npm run dev   # runs at http://localhost:5173, proxies /api → :8000
```

## Deploy to Railway

1. Create a new project at [railway.app](https://railway.app)
2. Connect this GitHub repo
3. Add a **PostgreSQL** plugin — Railway injects `DATABASE_URL` automatically
4. Deploy — the Dockerfile handles the build, tables are created and seeded on first boot

## Demo Credentials

All passwords: `pass123`

| Username | Team |
|---|---|
| `sarah.johnson` | Home Office |
| `mike.chen` | Home Office |
| `lisa.torres` | NCM |
| `james.wright` | NCM |
| `amy.patel` | SP |
| `robert.kim` | SP |
| `diana.reyes` | ISS |
| `carlos.vega` | ISS |

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/users/login` | Login |
| `GET` | `/api/patients/` | List patients (supports `search`, `region`, `channel` query params) |
| `GET` | `/api/notifications/` | List all notifications |
| `POST` | `/api/notifications/` | Create a notification |
| `PATCH` | `/api/notifications/{id}` | Update status (acknowledge) |
| `POST` | `/api/notifications/{id}/replies` | Add a reply |
