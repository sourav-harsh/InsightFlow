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

## Environment

Copy `.env.example` to `.env`:

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Backend base URL (default `http://localhost:8080`) |
| `VITE_API_TOKEN` | Hard-coded JWT bearer token sent on every request |
| `VITE_USE_MOCK` | `true` serves the bundled sample responses, `false` calls the live API |

## Project structure

```
public/images/            static images (logo, avatar)
src/
  api/                    API client + mock responses
  pages/
    Dashboard/            page + components/
    Upload/               page + components/
    Datasets/             page + components/
    DatasetDetail/        page + components/
    ColumnDetail/         page + components/
    Settings/  NotFound/
  utils/                  shared components & helpers (layout, cards, charts, formatters)
  styles/index.css        Tailwind entry + design tokens
```

## API endpoints consumed

| Method | Endpoint |
| --- | --- |
| POST | `/api/v1/datasets` (multipart CSV) |
| GET | `/api/v1/datasets/jobs/:jobId` |
| GET | `/api/v1/analytics/datasets/:datasetId` |
| GET | `/api/v1/analytics/datasets/:datasetId/summary` |
| GET | `/api/v1/analytics/datasets/:datasetId/columns/:columnName` |

All requests send `Authorization: Bearer <token>`.
