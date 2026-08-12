# InsightFlow — Data Quality Dashboard

Production-ready React + Vite + Tailwind CSS dashboard for CSV dataset ingestion and
data-quality analytics. Charts use Apache ECharts, icons use react-icons.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview
```

The app opens on the **Login** page. With mock mode enabled (default), any email and a
6+ character password signs you in — or click **fill demo credentials**. After sign-in
you land on the dashboard; signing out returns you to the login page.

## Authentication flow

1. `POST /api/v1/auth/login` (or `/register`) returns an access token + user profile.
2. The session (`{ token, user }`) is persisted in `localStorage` under `insightflow.auth`.
3. Every protected API call automatically sends `Authorization: Bearer <token>`.
4. Routes are guarded: signed-out visitors are redirected to `/login`, signed-in users
   are redirected away from `/login` and `/register`.
5. A `401` from any protected endpoint clears the session and bounces to `/login`.

## Environment

Copy `.env.example` to `.env`:

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Backend base URL (default `http://localhost:8080`) |
| `VITE_USE_MOCK` | `true` serves the bundled sample responses, `false` calls the live API |

## Project structure

```
public/images/            static images (logo, avatar)
src/
  api/                    API client (token handling) + mock responses
  pages/
    Login/                page + components/
    Register/             page + components/
    Dashboard/            page + components/
    Upload/               page + components/
    Datasets/             page + components/
    DatasetDetail/        page + components/
    ColumnDetail/         page + components/
    Settings/  NotFound/
  utils/                  shared components & helpers (AuthContext, route guards,
                          layout, cards, charts, formatters)
  styles/index.css        Tailwind entry + design tokens
```

## API endpoints consumed

| Method | Endpoint | Access |
| --- | --- | --- |
| POST | `/api/v1/auth/register` | Public |
| POST | `/api/v1/auth/login` | Public |
| POST | `/api/v1/datasets` (multipart CSV) | JWT |
| GET | `/api/v1/datasets/jobs/:jobId` | JWT |
| GET | `/api/v1/analytics/datasets/:datasetId` | JWT |
| GET | `/api/v1/analytics/datasets/:datasetId/summary` | JWT |
| GET | `/api/v1/analytics/datasets/:datasetId/columns/:columnName` | JWT |

All protected requests send `Authorization: Bearer <token>` with the token issued at login.
