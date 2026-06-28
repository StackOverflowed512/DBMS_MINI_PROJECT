# Tech Stack

## Backend
- **Runtime:** Node.js with CommonJS (`require`/`module.exports`)
- **Framework:** Express.js 4.x
- **Database:** MongoDB via Mongoose 7.x (ODM for models/schemas)
  - Note: `backend/config/db.js` also contains a MySQL2 pool setup — this appears to be legacy/unused; the active stack uses Mongoose
- **Auth:** JWT (`jsonwebtoken`) + `bcryptjs` for password hashing
- **Validation:** `express-validator` (used in route handlers)
- **Security:** `helmet`, `express-rate-limit`
- **Environment:** `dotenv` — config loaded from `backend/.env`

## Frontend
- **Framework:** React 18 with JSX (ES modules, `"type": "module"`)
- **Build Tool:** Vite 4.x
- **Routing:** React Router DOM v6
- **UI Library:** React Bootstrap 2.x + Bootstrap 5.x
- **HTTP Client:** Axios (JWT token set globally via `axios.defaults.headers.common`)
- **Forms:** React Hook Form 7.x
- **Date Formatting:** date-fns 2.x
- **Icons:** Bootstrap Icons (CDN, used as `<i className="bi bi-...">`)
- **Linting:** ESLint

## Common Commands

### Backend
```bash
cd backend
npm start          # production (node server.js)
npm run dev        # development with auto-reload (nodemon)
```

### Frontend
```bash
cd frontend
npm run dev        # Vite dev server at http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview production build
npm run lint       # ESLint check
```

## Environment Variables (backend/.env)
| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string (default: `mongodb://localhost:27017/vaccine_tracker`) |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `PORT` | Server port (default: `5000`) |

## API Base
Backend runs on port `5000`. Frontend dev server proxies or calls `http://localhost:5000` directly. CORS is configured to allow `http://localhost:5173` only.
