# Job Tracker – Deployment Guide

## Pre-deployment checklist

### Backend (Laravel)
- [ ] Copy `.env.example` to `.env` and set all values
- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Set `APP_URL` to your production URL (e.g. `https://api.yourdomain.com`)
- [ ] Run `php artisan key:generate` if `APP_KEY` is empty
- [ ] Configure database credentials for production
- [ ] Run `php artisan migrate --force`
- [ ] Run `php artisan config:cache` and `php artisan route:cache`
- [ ] Ensure `storage/` and `bootstrap/cache/` are writable

### Frontend (React)
- [ ] Set `VITE_API_URL` to your production API URL before building (see below)
- [ ] Run `npm run build`
- [ ] Serve the `dist/` folder (or copy into your web server)

### Security
- [ ] Remove any real credentials from `.env.example` (use placeholders only)
- [ ] Ensure `.env` is in `.gitignore` and never committed
- [ ] Restrict CORS `allowed_origins` in production (see below)

---

## Deployment options

### Option A: Separate hosting (recommended)

**Backend** (e.g. Laravel Forge, Railway, shared hosting):
- Deploy Laravel as usual; document root = `public/`
- API available at `https://your-api.com/api/v1`

**Frontend** (e.g. Vercel, Netlify):
1. Create `frontend/.env.production` (or set in build settings):
   ```
   VITE_API_URL=https://your-api.com/api/v1
   ```
2. Build: `npm run build`
3. Deploy the `dist/` folder
4. Configure SPA fallback so all routes serve `index.html`

### Option B: Same server (nginx)

Serve React at `/` and send `/api` to Laravel (PHP-FPM):

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/job-tracker/frontend/dist;

    # React app – SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API – pass to Laravel
    location /api {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME /var/www/job-tracker/backend/public/index.php;
        fastcgi_param DOCUMENT_ROOT /var/www/job-tracker/backend/public;
        include fastcgi_params;
    }
}
```

Set `root` and paths to match your server. Change `php8.2-fpm` if needed.

When using this setup, the frontend uses relative URLs (`/api/v1`) automatically – no `VITE_API_URL` needed.

### Option C: Laravel serves static frontend

1. Build frontend: `cd frontend && npm run build`
2. Copy `frontend/dist/*` to `backend/public/`
3. Add a catch-all route in Laravel to serve `index.html` for non-API routes
4. Ensure Laravel routes don’t conflict with static assets

---

## Environment variables

### Backend `.env` (production)
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=pgsql
DB_HOST=...
DB_DATABASE=job_tracker
DB_USERNAME=...
DB_PASSWORD=...
```

### Frontend build-time
| Variable         | When to set                     | Example                          |
|-----------------|----------------------------------|----------------------------------|
| `VITE_API_URL` | API on different domain          | `https://api.yourdomain.com/api/v1` |
| (none)          | Same origin (API at `/api`)      | Relative `/api/v1` used by default |

---

## CORS (when frontend and API are on different domains)

Publish and edit CORS config:
```bash
php artisan config:publish cors
```

Then in `config/cors.php`:
```php
'allowed_origins' => [env('FRONTEND_URL', 'https://your-frontend.com')],
```

Set `FRONTEND_URL` in `.env` to your frontend URL.

---

## Build commands

```bash
# Backend
cd backend
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan config:cache
php artisan route:cache

# Frontend (set VITE_API_URL first if needed)
cd frontend
npm ci
npm run build
```

---

## Is it ready to deploy?

**Yes**, with these steps:

1. Fix `.env` – production values and no committed secrets  
2. Build frontend with correct `VITE_API_URL` (or use same-origin)  
3. Run migrations on production DB  
4. Serve backend and frontend according to one of the options above  
5. Tighten CORS if using separate domains  
