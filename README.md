# Orbit CRM

A full-stack Customer Relationship Management (CRM) app built with the MERN stack:
**React + Bootstrap** (frontend), **Node.js + Express** (API), **MongoDB** (database).

## Features
- JWT authentication (register/login) with hashed passwords
- Contact management: create, edit, delete, search, filter by status, pagination
- Deal pipeline: kanban board with drag-and-drop stage updates, deal value tracking
- Task management: due dates, priority, completion tracking
- Dashboard: contact/customer counts, open deals, revenue won, pipeline breakdown, pending tasks
- Role field on users (admin / manager / sales) for future permission expansion

## Project structure
```
crm-app/
  server/     Express API + MongoDB models
  client/     React (Create React App) + Bootstrap frontend
```

## Prerequisites
- Node.js 18+
- A MongoDB database (local install or a free MongoDB Atlas cluster)

## 1. Backend setup
```bash
cd server
cp .env.example .env
# edit .env: set MONGO_URI and a strong JWT_SECRET
npm install
npm run dev      # starts on http://localhost:5000
```

## 2. Frontend setup
```bash
cd client
cp .env.example .env
# edit .env if your API runs on a different URL
npm install
npm start         # starts on http://localhost:3000
```

## 3. Use the app
1. Open http://localhost:3000
2. Register a new account
3. Add contacts, create deals, drag them across pipeline stages, add tasks
4. Check the Dashboard for a live overview

## API overview
| Method | Route                 | Description               |
|--------|------------------------|----------------------------|
| POST   | /api/auth/register      | Create account             |
| POST   | /api/auth/login         | Sign in, returns JWT       |
| GET    | /api/auth/me            | Current user (auth)        |
| GET    | /api/contacts           | List contacts (search/filter/pagination) |
| POST   | /api/contacts           | Create contact             |
| PUT    | /api/contacts/:id       | Update contact             |
| DELETE | /api/contacts/:id       | Delete contact             |
| GET    | /api/deals              | List deals                 |
| POST   | /api/deals              | Create deal                |
| PUT    | /api/deals/:id          | Update deal (e.g. stage)   |
| DELETE | /api/deals/:id          | Delete deal                |
| GET    | /api/tasks              | List tasks                 |
| POST   | /api/tasks              | Create task                |
| PUT    | /api/tasks/:id          | Update task                |
| DELETE | /api/tasks/:id          | Delete task                |
| GET    | /api/dashboard/stats    | Aggregated dashboard stats |

All routes except register/login require an `Authorization: Bearer <token>` header, which the frontend adds automatically after login.

## Extending it
- Add role-based restrictions using the `authorize()` middleware already included in `server/middleware/auth.js`
- Add email/notification integrations for tasks
- Add file/attachment uploads to contacts and deals
- Add reporting/exports (CSV, PDF) from the dashboard
