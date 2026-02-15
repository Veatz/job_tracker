# Job Tracker

A full-stack application to track your job applications, built with Laravel (backend) and React (frontend).

## Project Structure

```
JobTracker/
├── backend/          # Laravel API backend
└── frontend/         # React frontend application
```

## Backend Setup (Laravel)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install PHP dependencies:
```bash
composer install
```

3. Copy the environment file:
```bash
cp .env.example .env
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Configure your database in `.env` file

6. Run migrations:
```bash
php artisan migrate
```

7. Start the Laravel development server:
```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

## Frontend Setup (React)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Update the API URL in `.env` if needed (default: `http://localhost:8000/api/v1`)

5. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

All API endpoints are prefixed with `/api/v1`:

- `GET /api/v1/jobs` - Get all job applications
- `GET /api/v1/jobs/{id}` - Get a specific job application
- `POST /api/v1/jobs` - Create a new job application
- `PUT /api/v1/jobs/{id}` - Update a job application
- `DELETE /api/v1/jobs/{id}` - Delete a job application

## Features

- ✅ Track job applications with company name, position, status, dates
- ✅ Filter applications by status
- ✅ Add, edit, and delete job applications
- ✅ Store additional information like location, salary, contacts, notes
- ✅ Modern, responsive UI

## Technologies

- **Backend**: Laravel 12, PHP 8.2+
- **Frontend**: React 18, React Router, Axios, Vite
- **Database**: MySQL/PostgreSQL/SQLite (configurable)
