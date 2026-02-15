# Job Tracker Frontend

React frontend for the Job Tracker application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update the API URL in `.env` if your backend is running on a different port.

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build

To build for production:
```bash
npm run build
```

## Features

- View all job applications
- Filter by status (applied, interview, offer, rejected, accepted)
- Add new job applications
- Edit existing job applications
- Delete job applications
- Responsive design
