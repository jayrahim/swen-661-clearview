# ClearView React web

This directory contains the early React/Vite foundation for the ClearView web
prototype. It includes client-side routes, semantic landmarks, keyboard-visible
focus styles, a skip link, responsive navigation, and an installable PWA.
The implementation follows the approved mobile, tablet, and desktop designs
for the Dashboard, Appointments, Messages, Medical Notes, and Accessibility
Settings workflows.

## Run

```sh
npm install
npm run dev
```

Build or lint the starter with:

```sh
npm run build
npm run lint
```

## Testing and coverage

Run the Jest unit and React Testing Library component suite with:

```sh
npm test
npm run test:coverage
```

The coverage command enforces a minimum of 75% for statements, branches,
functions, and lines. It writes a browser-viewable report to
`coverage/lcov-report/index.html`.

Coverage is collected from the application source under `src/`, including the
pure preference helper unit tests and the routed user-facing components.
`src/main.jsx` is intentionally excluded: it is a Vite/browser bootstrap
module whose service-worker registration is covered by production-build and
browser E2E checks rather than a JSDOM unit test.

## End-to-end testing

Install the Chromium browser once on a new development machine, then run the
Playwright suite against a locally built preview:

```sh
npx playwright install chromium
npm run test:e2e
```

The suite covers sign-in, navigation, visits, messages, medical notes,
accessibility preferences, unavailable-prototype feedback, and representative
desktop (1440px), tablet (768px), and mobile (375px) workflows. It writes an
HTML report to `playwright-report/index.html`; open it with
`npm run test:e2e:report`. GitHub Actions runs the same Chromium suite without
external services and retains the report and failure diagnostics as artifacts.

## PWA and offline behavior

The production build generates a Workbox service worker and precaches the app
shell. After an initial online visit, the ClearView routes and prototype data
remain available offline because they are bundled with the client application.
The app shows an in-context status message while offline. It does not cache or
sync live clinical data; this educational prototype has no live backend.

Use a production build to validate PWA behavior locally:

```sh
npm run build
npm run preview
```

On browsers that support the `beforeinstallprompt` event, an **Install app**
control appears in the primary navigation once the browser determines the app
is installable. Safari and some managed browsers do not expose that prompt;
use the browser's install/share menu and its developer tools' Manifest or
Application panel to verify the manifest and registered service worker.

The mobile menu can be opened with its button and closed with `Escape`. The
app provides a skip link, visible focus indicators for controls, native buttons
and links, semantic landmarks, and route-level heading focus for screen-reader
context.

The current foundation exposes these routes for early responsive and
accessibility validation: `/sign-in`, `/dashboard`, `/visits`, `/messages`,
`/records`, and `/settings`.
