# CampusSync — Campus Event Planner

COMP229 Web Application Development · Group 7 · Project Part 1
## Project repository

https://github.com/idelahnihad/campussync-event-planner

CampusSync is a small full-stack event planner. Registered users can view campus events and create, edit, or delete their own events. The backend uses Node.js, Express, MongoDB, Mongoose, and an MVC-style folder structure. The frontend uses React, TypeScript, and Vite.

## Team

All members are Full-Stack Developers and rotate coordination, frontend, backend/database, authentication, and testing responsibilities.

- Nihad Idelah — 301542697
- Emad Al Nounou — 301558877
- Mohamad Alkurdi — 301556412

## Features

- Registration and login with bcrypt password hashing.
- Two-hour JWT sessions.
- Protected user profile read, update, and delete routes.
- Full event CRUD through REST APIs and React pages.
- Owner-only event update and deletion enforced by the backend.
- Input validation and clear API error messages.
- Search and category filtering on the dashboard.
- Responsive layout, keyboard-focus states, and installable PWA support.
- Automated API tests and a Postman collection.

## Requirements

Install these before running the project locally:

1. Node.js 20 or newer.
2. MongoDB 7 or newer running locally, or a MongoDB Atlas connection string.
3. Git for team commits.

## Local setup

### 1. Install packages

```bash
npm install
```

### 2. Create the environment file

Windows Command Prompt:

```bash
copy .env.example .env
```

macOS, Linux, or Git Bash:

```bash
cp .env.example .env
```

The local defaults are:

```text
MONGODB_URI=mongodb://127.0.0.1:27017/campussync
JWT_SECRET=campussync-local-development-only-2026
PORT=5000
```

For a shared or deployed version, generate a private JWT secret with `openssl rand -hex 32` and use a protected MongoDB connection. Never commit the `.env` file.

### 3. Start MongoDB

For a local installation, start the MongoDB service using the instructions for your operating system. The application checks the connection before it starts.

### 4. Load demonstration records

```bash
npm run seed
```

This resets the `campussync` database and creates two sample accounts:

| Email | Password |
|---|---|
| demo@campussync.local | Campus123! |
| other@campussync.local | Campus123! |

These are fictional local test accounts, not member accounts.

### 5. Start the client and API

```bash
npm run dev:full
```

Open `http://localhost:3000`. Vite serves the React client on port 3000 and proxies `/api` requests to Express on port 5000.

To start only one side during development:

```bash
npm run dev          # React client, port 3000
npm run dev:server   # Express API, port 5000
```

## Production build

```bash
npm run build
npm run build:server
npm start
```

Open `http://localhost:3000`. Express serves the built React application and the API from the same process. Set `MONGODB_URI` and `JWT_SECRET` in the environment before starting.

## API tests

```bash
npm test
```

The tests use a temporary MongoDB instance and do not modify your local `campussync` database. The first run may download the temporary database binary.

Covered behavior:

- Successful registration and duplicate-email rejection.
- Successful login and incorrect-password rejection.
- Profile read, update, and account deletion.
- Missing-token rejection.
- Event creation, list, detail, update, and deletion.
- Validation errors for incomplete event data.
- `403 Forbidden` when a non-owner tries to update or delete an event.
- `404 Not Found` after an event is deleted.

## Postman

Import `postman/CampusSync-API-Tests.postman_collection.json` into Postman.

1. Start the application with `npm run dev:full`.
2. Open the collection and confirm `baseUrl` is `http://localhost:5000/api`.
3. Run the requests in folder order, or use Collection Runner.
4. Login requests save tokens in collection variables automatically.
5. Create Event saves `eventId` automatically.
6. Expected status codes are included as Postman test assertions.

See `docs/API-Testing.md` for the manual demonstration sequence.

## API summary

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create user and return token |
| POST | `/api/auth/login` | Public | Authenticate and return token |
| GET | `/api/users/me` | Logged in | Read current profile |
| PUT | `/api/users/me` | Logged in | Update current profile |
| DELETE | `/api/users/me` | Logged in | Delete current account and owned events |
| POST | `/api/events` | Logged in | Create event |
| GET | `/api/events` | Logged in | List events |
| GET | `/api/events/:id` | Logged in | Read one event |
| PUT | `/api/events/:id` | Owner only | Update event |
| DELETE | `/api/events/:id` | Owner only | Delete event |
| GET | `/api/health` | Public | API and database status |

## MVC organization

```text
server/
├── config/db.js                  # MongoDB connection
├── controllers/                  # Request and response logic
│   ├── authController.js
│   ├── userController.js
│   └── eventController.js
├── middleware/
│   ├── authMiddleware.js         # JWT verification
│   └── errorMiddleware.js        # JSON errors and validation
├── models/
│   ├── User.js                   # Mongoose User schema
│   └── Event.js                  # Mongoose Event schema
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   └── eventRoutes.js
├── tests/api.test.js
├── app.js                        # Express application
├── server.js                     # Database and server startup
└── seed.js                       # Repeatable demo records

src/
├── components/                   # Forms, layout, dialogs, event rows
├── context/AuthContext.tsx       # Client session state
├── lib/                          # API and date helpers
├── pages/                        # Home, auth, events, and profile
├── App.tsx                       # Client routes
└── sw.js                         # PWA service worker
```

## GitHub workflow for all three members

Each member must work on a branch and make meaningful commits. Do not use one shared GitHub account.

```bash
git checkout -b feature/short-task-name
git add .
git commit -m "Describe the completed task"
git push origin feature/short-task-name
```

Open a pull request, have another member review it, then merge. Rotate module responsibilities for the next release so every member gains frontend, backend, database, and testing experience.

## Optional container setup

The included `Dockerfile` starts MongoDB and the built application in one container for a self-contained demonstration. Local Node.js installation remains the recommended course-development workflow.

## Scope notes

Part 1 intentionally excludes RSVPs, ticket sales, payments, comments, image uploads, maps, and email notifications. These can be discussed as future enhancements, but they are not required for this release.
