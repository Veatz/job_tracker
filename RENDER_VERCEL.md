# Job Tracker – Render (Backend) + Vercel (Frontend) Deployment

This repo is a Laravel (backend) + React (frontend) monorepo:

- `backend/` Laravel API
- `frontend/` React SPA

## 1) Deploy Backend to Render

### Create Render Web Service
1. Render → **New Service** → **Web Service**
2. Select **Blueprint** / “From Git” and set **Root Directory** to `backend`
3. Add a PostgreSQL database (Render Postgres) and connect it

### Environment variables (Render)
Set these in the Render service:

| Name | Example value |
|------|-----------------|
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_KEY` | paste the output from `php artisan key:generate --show` |
| `APP_URL` | `https://<your-render-backend-domain>` |
| `FRONTEND_URL` | `https://job-tracker-vibed.vercel.app` (your Vercel URL) |
| `DB_CONNECTION` | `pgsql` |
| `DB_HOST` | Render database host (or use `DATABASE_URL` if your Render setup provides it) |
| `DB_PORT` | `5432` |
| `DB_DATABASE` | your DB name |
| `DB_USERNAME` | DB user |
| `DB_PASSWORD` | DB password |

Notes:
- `FRONTEND_URL` is used by `backend/config/cors.php` to allow CORS from your Vercel frontend.
- Do not commit `.env`.

### Build command (Render)
```bash
composer install --no-dev --optimize-autoloader
```

### Start command (Render)
Use `$PORT` from Render:
```bash
php artisan migrate --force \
  && php artisan config:cache \
  && php artisan route:cache \
  && php artisan serve --host=0.0.0.0 --port=$PORT
```

## 2) Deploy Frontend to Vercel

### Create Vercel Project
1. Vercel → **Add New** → **Project**
2. **Framework Preset**: (leave default) or “Other”
3. Set **Root Directory** to `frontend`

### Build settings (Vercel)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm ci` (recommended)

### Environment variables (Vercel)
Add:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://<your-render-backend-domain>/api/v1` |

Important:
- Vite reads `VITE_*` env vars at build time, so after changing `VITE_API_URL` you must redeploy.

## 3) Quick post-deploy test

Backend:
- Open: `https://<your-render-backend-domain>/api/v1/jobs`

Frontend:
- Open: `https://<your-vercel-domain>/`

You should be able to:
- List jobs
- Create jobs
- Update status via the dropdown
- Delete jobs (modal confirmation)

