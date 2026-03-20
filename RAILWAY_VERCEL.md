# Railway (Backend) + Vercel (Frontend) Deployment

## 1. Deploy Backend to Railway

### Setup
1. Create a new project on [Railway](https://railway.app)
2. Add a service: **New** → **GitHub Repo** (or deploy from CLI)
3. Set **Root Directory** to `backend` (if using monorepo)
4. Add **PostgreSQL** from Railway's database templates (or use external)
5. Connect PostgreSQL to your service (Railway will set `DATABASE_URL`)

### Environment Variables (Railway)
Set these in your Railway service settings:

| Variable | Value |
|----------|-------|
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_KEY` | Run `php artisan key:generate` locally and paste |
| `APP_URL` | `https://your-app.up.railway.app` (use your actual Railway URL) |
| `FRONTEND_URL` | `https://https://job-tracker-vibed.vercel.app/` (your Vercel URL – for CORS) |
| `DB_CONNECTION` | `pgsql` (if using Railway Postgres) |
| `DB_HOST` | From Railway Postgres (or `DATABASE_URL` – Laravel can parse it) |

**Railway Postgres:** If you add Postgres in Railway, it often provides `DATABASE_URL`. Laravel can use it – set `DB_CONNECTION=pgsql` and Laravel may auto-parse `DATABASE_URL`, or set `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` from it.

### Port
- Railway sets `PORT`; the Procfile uses it
- **Public Networking** → Generate domain, set port to `8000` (or leave default if Railway auto-detects)

### Build & Deploy
Railway will run:
- `composer install` (if `composer.json` present)
- `php artisan migrate --force` (add as build command if needed)
- Start: `php artisan serve --host=0.0.0.0 --port=$PORT`

Add **Build Command** (if not automatic):
```bash
composer install --no-dev --optimize-autoloader
```

Add **Deploy/Start** (Procfile handles this; ensure Procfile is in root of backend):
```
web: php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
```

---

## 2. Deploy Frontend to Vercel

### Setup
1. Import your repo at [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`

### Environment Variables (Vercel)
Add **Environment Variable**:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://your-app.up.railway.app/api/v1` |

Use your **actual Railway backend URL** (e.g. `https://jobtracker-backend.up.railway.app/api/v1`).

### Build
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm ci` (or `npm install`)

Vercel will build and deploy. The `vercel.json` handles SPA routing.

---

## 3. Post-Deploy Checklist

- [ ] Railway backend responds at `https://your-app.up.railway.app/api/v1/jobs`
- [ ] CORS allows your Vercel URL (`FRONTEND_URL` set)
- [ ] Vercel frontend loads and can reach the API
- [ ] Migrations have run on Railway (add `php artisan migrate --force` to build if needed)

---

## 4. Custom Domains (Optional)

**Railway:** Add custom domain in Railway project settings  
**Vercel:** Add custom domain in Vercel project settings  

Then update:
- `APP_URL` (Railway) → your API domain
- `FRONTEND_URL` (Railway) → your frontend domain  
- `VITE_API_URL` (Vercel) → `https://api.yourdomain.com/api/v1`
