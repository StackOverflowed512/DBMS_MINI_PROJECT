# Project Structure

```
DBMS_MINI_PROJECT/
├── backend/                        # Node.js/Express API
│   ├── config/
│   │   └── db.js                   # MySQL2 pool (legacy, unused — active DB is Mongoose in server.js)
│   ├── controllers/                # SQL-based controller functions (legacy pattern)
│   │   ├── personController.js     # Raw mysql2 queries
│   │   ├── vaccineController.js
│   │   ├── locationController.js
│   │   └── sessionController.js
│   ├── middleware/
│   │   ├── auth.js                 # JWT protect middleware → attaches req.user
│   │   └── errorHandler.js        # Global Express error handler
│   ├── models/                     # Mongoose schemas (active)
│   │   ├── User.js
│   │   ├── Person.js
│   │   ├── Vaccine.js
│   │   ├── Location.js
│   │   └── VaccineSession.js
│   ├── routes/                     # Express routers (use Mongoose models directly)
│   │   ├── auth.js
│   │   ├── persons.js
│   │   ├── vaccines.js
│   │   ├── locations.js
│   │   └── sessions.js
│   ├── scripts/
│   │   └── seedData.js             # DB seed script
│   ├── .env                        # Environment variables (not committed)
│   ├── package.json
│   └── server.js                   # App entry point — mounts middleware and routes
│
└── frontend/                       # React + Vite SPA
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── Auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── Register.jsx
    │   │   ├── Layout/
    │   │   │   ├── Layout.jsx      # Shared nav/sidebar wrapper
    │   │   │   └── Dashboard.jsx
    │   │   ├── Persons/
    │   │   │   └── Persons.jsx
    │   │   ├── Vaccines/
    │   │   │   └── Vaccines.jsx
    │   │   ├── Locations/
    │   │   │   └── Locations.jsx
    │   │   └── Sessions/
    │   │       └── Sessions.jsx
    │   ├── contexts/
    │   │   └── AuthContext.jsx     # Auth state, login/logout/register, axios token setup
    │   ├── App.jsx                 # Router setup, ProtectedRoute / PublicRoute wrappers
    │   ├── main.jsx                # React DOM entry point
    │   ├── App.css
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Architecture Patterns

### Backend
- Routes handle validation inline via `express-validator` chains, then call Mongoose directly — there is no separate service layer
- All routes except `/api/auth` are protected by the `protect` middleware
- Responses always use the shape `{ success: true/false, data, message, pagination? }`
- Pagination is query-param driven: `?page=1&limit=10&search=`
- The `controllers/` directory uses raw mysql2 queries and is **not wired up** to the active routes — ignore or remove when refactoring
- Error handling flows to the global `errorHandler` middleware; throw or pass errors with `next(error)`

### Frontend
- All pages are colocated in `components/<Entity>/` as a single `.jsx` file (list + modal form in one component)
- `Layout.jsx` wraps every authenticated page — always compose new pages inside `<Layout>`
- Auth state lives in `AuthContext`; access via `useAuth()` hook
- Axios JWT token is set globally on login and cleared on logout — no per-request token handling needed
- Use React Bootstrap components (`Container`, `Row`, `Col`, `Card`, `Modal`, `Table`, `Form`, etc.) for all UI
- Use Bootstrap Icons via className: `<i className="bi bi-icon-name">`
- Dates are formatted with `date-fns/format` using the pattern `"MMM dd, yyyy"`
- Form state is managed with `useState` + spread updates (`setFormData({ ...formData, field: value })`)

## Naming Conventions
- Backend Mongoose models: PascalCase filenames, camelCase field names
- Backend routes: kebab-case URL segments (`/api/vaccine-sessions`)
- Frontend components: PascalCase filenames and function names
- Frontend component folders: PascalCase matching the entity name
