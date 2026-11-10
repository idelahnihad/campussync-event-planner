# CampusSync API Testing Guide

Use this sequence after `npm run dev:full`. The Postman collection stores tokens and the event ID automatically.

## Expected results

| Step | Request | Expected result |
|---|---|---|
| 1 | Health Check | `200 OK`; status is `ok` and database is `campussync` |
| 2 | Register Owner | `201 Created`; token and public user returned |
| 3 | Register Duplicate | `409 Conflict` |
| 4 | Login Owner | `200 OK`; token saved as `ownerToken` |
| 5 | Login Wrong Password | `401 Unauthorized` |
| 6 | Register and Login Other User | Token saved as `otherToken` |
| 7 | Get Profile | `200 OK`; no `passwordHash` field |
| 8 | Update Profile | `200 OK`; changed full name returned |
| 9 | Get Events Without Token | `401 Unauthorized` |
| 10 | Create Event | `201 Created`; event ID saved as `eventId` |
| 11 | Create Invalid Event | `400 Bad Request` |
| 12 | Get All Events | `200 OK`; created event appears |
| 13 | Get One Event | `200 OK`; correct event returned |
| 14 | Update as Other User | `403 Forbidden` |
| 15 | Update as Owner | `200 OK`; new location and time returned |
| 16 | Delete as Other User | `403 Forbidden` |
| 17 | Delete as Owner | `200 OK`; deleted ID returned |
| 18 | Get Deleted Event | `404 Not Found` |
| 19 | Register and Delete Temporary User | `200 OK`; temporary account removed |

## Authorization explanation

Authentication answers “who is making this request?” The `requireAuth` middleware checks the Bearer token and loads the user.

Authorization answers “what may this user do?” The event controller compares the event’s organizer ID with the logged-in user’s ID. Update and delete continue only when the IDs match.

## Screenshot checklist for your own run

Capture your own Postman results for the EDD and video:

1. `201 Created` after registration.
2. `200 OK` after login with the token visible.
3. `401 Unauthorized` for a protected request without a token.
4. `201 Created` after event creation.
5. `200 OK` for event list and detail.
6. `200 OK` after the owner updates an event.
7. `403 Forbidden` when the other user tries to update or delete.
8. `200 OK` after the owner deletes the event.

Use your actual screenshots in the submitted EDD rather than screenshots from another environment.
