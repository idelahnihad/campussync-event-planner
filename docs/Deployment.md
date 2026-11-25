# CampusSync - Atlas and Render Deployment Guide

This guide uses the team's own MongoDB Atlas, GitHub, and Render accounts. Do not share account passwords, access tokens, or two-factor authentication codes. Do not paste the real connection string into source files, screenshots, chat, or Git.

## Current status

The repository includes `render.yaml`, a production build, production startup checks, and `/api/health`. These prepare the application for deployment. A cloud database and public deployed URL exist only after the team completes the account steps below and verifies them.

## Part 1 - Create MongoDB Atlas storage

1. Sign in to MongoDB Atlas with the team's own account.
2. Create a free M0 cluster in a region close to the hosting service.
3. In Database Access, create a database user with a strong unique password. Save the credentials privately.
4. In Network Access, allow the hosting service to connect. If the course deployment requires `0.0.0.0/0` because the host has dynamic outbound addresses, use it only with the strong database user and remove it after the course if no longer needed.
5. Choose Connect, then Drivers, then Node.js.
6. Copy the connection string privately.
7. Insert the database username and password in the connection string and ensure the database name is `campussync`.
8. Do not create or seed fictional demonstration records in the shared cloud database unless the team intentionally wants them for the deployed demonstration.

The connection string becomes the private `MONGODB_URI` value in Render. It must not appear in `.env.example`, `render.yaml`, GitHub, the EDD, or submission screenshots.

## Part 2 - Deploy the web service on Render

1. Push the final Part 2 source to the team's GitHub repository first.
2. Sign in to Render using the team's own account.
3. Choose New, then Blueprint, and select `idelahnihad/campussync-event-planner`.
4. Render reads `render.yaml` and proposes the `campussync-event-planner` Node web service.
5. Review the settings:
   - Build command: `npm ci && npm run build && npm run build:server`
   - Start command: `npm start`
   - Health check path: `/api/health`
   - Automatic deployment: enabled
6. When prompted for `MONGODB_URI`, paste the private Atlas connection string. Keep `JWT_SECRET` set to Render's generated value.
7. Create the service and wait for the build and deployment logs to finish.
8. Open the Render-provided HTTPS URL.
9. Open `/api/health` on that same URL and confirm that the API and database report a healthy state.
10. Test registration, login, public events, event create/read/update/delete, My Profile, and Sign Out on the deployed site.
11. Save the real site URL for Luminate and capture genuine deployed-site screenshots.

If the service starts sleeping on a free plan, the first request can take longer. Mention this only if it occurs during the actual deployment.

## Part 3 - Verify the production release

Use this checklist on the public URL, not localhost:

- [ ] Home shows the CampusSync identity and public event list.
- [ ] Sign Up and Sign In work.
- [ ] Active navigation and current user information are visible after login.
- [ ] A registered user can create an event and see it after refresh.
- [ ] The owner can edit and delete that event.
- [ ] A second account cannot edit or delete another owner's event.
- [ ] My Profile reads and updates the current account.
- [ ] Sign Out returns to public Home without redirecting to login.
- [ ] Direct nested-route refresh works.
- [ ] Browser console has no application errors.
- [ ] Desktop and mobile layouts have no horizontal overflow.
- [ ] `/api/health` confirms the cloud database connection.

## Part 4 - Save deployment evidence

Capture only real deployed evidence:

1. Render service page showing the repository, successful deploy, and automatic deployment setting.
2. Atlas cluster overview without revealing the connection string or database password.
3. Deployed Home and event workflow.
4. Deployed `/api/health` response.
5. Final Lighthouse report against the deployed HTTPS URL.
6. The exact public HTTPS link for the submission links file.

Localhost screenshots must remain labelled development-verification screenshots and must not be presented as deployed-site proof.

## Troubleshooting

- Build fails: open the Render build log and compare it with a local `npm ci`, `npm run build`, and `npm run build:server` run.
- Startup says `JWT_SECRET must be set`: confirm the generated Render environment variable still exists.
- Health route reports a database problem: check Atlas Database Access, Network Access, and the private `MONGODB_URI` value.
- Events disappear after local testing: Cypress uses a disposable database, so investigate the actual configured database rather than treating the E2E reset as production data loss.
- Site loads but direct event URLs fail: confirm the latest `server/app.js` SPA fallback is deployed.
