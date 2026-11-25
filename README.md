# CampusSync - Campus Event Planner

COMP229 Web Application Development - Group 7 - Project Part 2

CampusSync is a full-stack campus event planner. Visitors can view upcoming events on the landing page. Registered users can sign in, manage their profiles, and create, read, update, or delete their own events. The backend uses Node.js, Express, MongoDB, Mongoose, and an MVC-style folder structure. The frontend uses React, TypeScript, Vite, and React Router.

## Team

All members are Full-Stack Developers and rotate coordination, frontend, backend/database, authentication, testing, and quality responsibilities.

- Nihad Idelah - 301542697
- Emad Al Nounou - 301558877
- Mohamad Alkurdi - 301556412

GitHub repository: https://github.com/idelahnihad/campussync-event-planner

## Part 2 features

- Landing page with the CampusSync name, team identity, and real public event list.
- Registration and login with bcrypt password hashing.
- Two-hour JWT Bearer sessions.
- Responsive authenticated navigation with active-location styling, current user name, My Profile, and Sign Out.
- Protected user profile read, update, password change, and account deletion.
- Public event list and event-detail API reads.
- Authenticated event creation and owner-only event update and deletion.
- React event dashboard with search and category filtering.
- Account deletion also removes events owned by that user.
- Input validation, safe user serialization, Helmet, rate limits, and clear API errors.
- Component unit tests, API integration tests, and a recorded Cypress E2E workflow.
- Production compression, static-asset caching, bundle splitting, PWA precaching, and search metadata.
- Render deployment blueprint and GitHub Actions CI workflow.

## Requirements

1. Node.js 20 or newer.
2. MongoDB 7 or newer running locally, or a MongoDB Atlas connection string.
3. Git for team commits.
4. Anaconda Prompt for the Windows commands below and Spyder for viewing JavaScript source files.

## Local setup on Nihad's computer

The project folder is `C:\CampusSync\CampusSync`.

### 1. Open the project

Open Anaconda Prompt and run:

```bat
cd /d C:\CampusSync\CampusSync
```

### 2. Install packages after extracting or cloning

```bat
npm install
```

This is not required every time. Repeat it when dependencies change or when `node_modules` is missing.

### 3. Create the local environment file once

```bat
copy .env.example .env
```

If Windows asks whether to overwrite an existing `.env`, answer `N` unless you intentionally want to reset the local configuration.

The local example values are:

```text
MONGODB_URI=mongodb://127.0.0.1:27017/campussync
JWT_SECRET=campussync-local-development-only-2026
PORT=5000
```

Never commit `.env` or real deployment secrets. Production startup requires a private `JWT_SECRET` and does not use the development fallback.

### 4. Start MongoDB

Start the local MongoDB service, or use a valid Atlas connection string in `.env`. The application checks the database connection before startup.

### 5. Load fictional demonstration records only when needed

```bat
npm run seed
```

This resets the local `campussync` database. It is not part of normal daily startup.

| Email | Password |
|---|---|
| demo@campussync.local | Campus123! |
| other@campussync.local | Campus123! |

These are fictional local test accounts, not member accounts.

### 6. Start the client and API

```bat
npm run dev:full
```

Open `http://localhost:3000`. Vite serves React on port 3000 and proxies `/api` requests to Express on port 5000.

To stop the servers, press Ctrl+C in Anaconda Prompt and answer `Y` if asked to terminate the batch job.

To start only one side:

```bat
npm run dev
npm run dev:server
```

## Production build

```bat
npm run build
npm run build:server
npm start
```

Express serves `dist/public` and the API from the same process. The backend bundle is `dist/boot.js`. Set `MONGODB_URI` and `JWT_SECRET` in the environment before starting. The default production port is 3000 unless the hosting provider supplies `PORT`.

## Automated checks

```bat
npm run check
npm test
npm run build
npm run build:server
```

`npm test` runs both component and API tests. The test databases are temporary and do not modify the normal local `campussync` database.

### Component unit tests

```bat
npm run test:unit
```

The four EventForm tests cover required fields, validation, trimmed valid submission, cancel behavior, and busy-state actions.

### API integration tests

```bat
npm run test:api
```

The tests cover authentication, user CRUD, public event reads, protected writes, complete event CRUD, validation, ownership authorization, and deleted-event behavior.

### Cypress E2E test with recording

Build the frontend first, then run:

```bat
npm run build
npm run test:e2e
```

The command starts a disposable test server on port 4173, waits for `/api/health`, runs the comprehensive Cypress spec, records video, and writes six screenshots. Use the plain command above without extra browser arguments.

Evidence is written to:

```text
cypress/videos/
cypress/screenshots/
```

These generated evidence folders are excluded from Git. The clean submission evidence package contains only successful outputs.

## Postman

Import `postman/CampusSync-API-Tests.postman_collection.json` into Postman.

1. Start the application with `npm run dev:full`.
2. Confirm `baseUrl` is `http://localhost:5000/api`.
3. Run requests in folder order or use Collection Runner.
4. Login requests save tokens automatically.
5. Create Event saves `eventId` automatically.
6. Assertions check the expected status codes and response bodies.

See `docs/API-Testing.md` for the manual sequence. Capture the team's own Postman run if API-testing screenshots are requested.

## API summary

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create user and return token |
| POST | `/api/auth/login` | Public | Authenticate and return token |
| GET | `/api/users/me` | Logged in | Read current profile |
| PUT | `/api/users/me` | Logged in | Update current profile or password |
| DELETE | `/api/users/me` | Logged in | Delete account and owned events |
| GET | `/api/events` | Public | List events with safe organizer details |
| POST | `/api/events` | Logged in | Create an owned event |
| GET | `/api/events/:id` | Public | Read one event |
| PUT | `/api/events/:id` | Owner only | Update an owned event |
| DELETE | `/api/events/:id` | Owner only | Delete an owned event |
| GET | `/api/health` | Public | API and database status |

Authentication establishes identity. Authorization separately enforces event ownership on the server.

## MVC organization

```text
server/
├── config/db.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   └── eventController.js
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── models/
│   ├── User.js
│   └── Event.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   └── eventRoutes.js
├── tests/api.test.js
├── app.js
├── server.js
├── e2e-server.js
└── seed.js

src/
├── components/
│   ├── EventForm.tsx
│   ├── EventForm.test.tsx
│   └── other shared interface components
├── context/AuthContext.tsx
├── lib/
├── pages/
├── test/setup.ts
├── App.tsx
└── sw.js

cypress/
├── e2e/campussync.cy.ts
└── support/e2e.ts
```

## Deployment and CI/CD

- `render.yaml` defines the Render Node web service, build command, start command, health check, automatic deployment, and generated JWT secret configuration.
- `MONGODB_URI` must be added privately in Render after creating the Atlas database.
- `.github/workflows/ci.yml` checks source, builds both bundles, runs component and API tests, and runs Cypress on pull requests and main-branch pushes.
- See `docs/Deployment.md` for Atlas and Render steps.
- See `docs/CICD-Evidence.md` for the genuine branch, visible update, merge, deployment, and before/after screenshot sequence.

No public deployed URL is asserted in this source copy. Use the real URL issued by the hosting provider after deployment.

## GitHub workflow for all three members

Each member must work from their own GitHub account on a feature branch and make meaningful commits.

```bat
git checkout main
git pull origin main
git checkout -b feature/short-task-name
git add .
git commit -m "Describe the completed task"
git push origin feature/short-task-name
```

Open a pull request, have another member review it, and merge after checks pass. Keep `.env`, `node_modules`, `dist`, `.git`, logs, and generated Cypress evidence out of the source archive.

## Scope notes

RSVPs, ticket sales, payments, comments, image uploads, maps, and email notifications remain outside this release. They are not required for Project Part 2 and are not claimed as implemented features.
