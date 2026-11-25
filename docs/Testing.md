# CampusSync - Test Commands and Evidence

## Component and API tests

```bat
npm run test:unit
npm run test:api
```

Current verified results: 4 component tests passed and 2 API integration groups passed, with no failures.

## Cypress E2E

```bat
npm run build
npm run test:e2e
```

Current verified result: 1 comprehensive workflow passed, 0 failed, 6 screenshots, and video recorded.

The workflow covers public events, registration, navigation, event create/read/update/delete, profile update, sign out, login, search, and ownership restrictions. The E2E server uses a disposable MongoDB database and fictional accounts.

## Production quality

```bat
npm run check
npm run build
npm run build:server
```

The final local production Lighthouse run scored 99 performance, 100 accessibility, 100 best practices, and 100 SEO. This is local production-build evidence, not deployed-site evidence. Repeat Lighthouse against the real HTTPS deployment after it is available.

## Submission evidence

The clean Part 2 evidence folder contains the actual result logs, unit-test snapshot, Cypress code, Cypress recording, six screenshots, and Lighthouse HTML/JSON reports. Generated evidence is excluded from Git and from the clean source ZIP to keep the repository reproducible and compact.
