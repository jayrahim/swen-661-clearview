# ClearView

**SWEN 661 — User Interface Implementation**<br>
**Team 6 — ClearView**

ClearView is a cross-platform UI prototype based on the CareConnect Care Recipient experience for people with low vision or partial sight impairment. Flutter and Expo/React Native implementations are available for framework comparison. The Electron prototype now demonstrates the beginning of the desktop experience; React/Vite remains a starter project for future course work.

## Team members

| Team member | GitHub username |
| --- | --- |
| Jay Scruggs | [@jayrahim](https://github.com/jayrahim) |
| Nazia Mst | [@nazmst2](https://github.com/nazmst2) |
| Abel Tabor | [@abelktabor](https://github.com/abelktabor) |

## Project documents

The Team Charter and Project Proposal are maintained by the team outside this public repository.

The [docs/](docs/README.md) directory holds repository-safe design references. Team documents are maintained outside this public repository.

## Repository structure

```text
.
├── .github/        # Issue, pull request, and workflow configuration
├── docs/           # Repository-safe design references
├── electron/       # ClearView Electron desktop prototype
├── flutter/        # ClearView Flutter prototype
├── react-native/   # ClearView Expo / React Native prototype
└── react-web/      # Vite / React web starter
```

## ClearView implementations

The Flutter and React Native prototypes implement these meaningful UI states and workflows:

- Sign In and Dashboard
- Appointments and selected Appointment Detail
- Messages and selected Message Detail
- Medical Notes and selected Medical Note Detail
- Accessibility Settings
- Reduced Clutter Dashboard, rendered from the shared Reduced Clutter preference

The app uses synthetic data only. It does not include real authentication, PHI, networking, database persistence, or backend integration.

### React Native implementation

The Expo / React Native implementation mirrors the completed Flutter workflows: Sign In, Dashboard, Accessibility Settings, Appointments and Appointment Detail, Messages and Message Detail, and Medical Notes and Medical Note Detail. Its shared root-route model provides Dashboard, Appointments, Messages, Records, and Settings destinations; selected-item details are child routes that return to their parent list.

The prototype uses repository-backed synthetic data, React Context with `useReducer` for session accessibility preferences, shared design tokens and themed primitives, and responsive phone/tablet layouts. It supports the same Text Size, High Contrast, and Reduced Clutter preferences as the Flutter prototype. Controls that are visible in the approved design but outside the prototype scope provide lightweight, in-context feedback rather than fake destination screens.

### Architecture

The Flutter code is organized to keep UI, state, data, and visual design concerns separate:

- `lib/screens/` — screen-level layouts and workflows.
- `lib/widgets/` — shared cards, controls, responsive shell, and navigation.
- `lib/models/` — immutable appointment, message, medical-note, and quick-access models.
- `lib/repositories/` — repository-backed synthetic prototype data.
- `lib/state/` — Riverpod accessibility-preference state.
- `lib/theme/` — shared colors, themes, and ClearView design tokens.
- `lib/utils/` — reusable presentation helpers such as date formatting.

Shared application state uses Riverpod. Widgets use `ref.watch(...)` when rendered UI depends on provider data and `ref.read(...notifier)` for one-time preference actions. Accessibility preferences persist for the current app session.

### Navigation

Sign In opens the Dashboard. Shared root navigation provides Home, Visits, Messages, Records, and Settings destinations; the tablet layout adapts this into a side navigation rail. Appointments, Messages, and Medical Notes display repository-backed lists. Selecting an item opens the detail screen for that selected item, and pushed detail screens retain custom back navigation without phone bottom navigation.

Controls represented in the approved prototype design whose full workflow is outside the current scope remain visible and provide lightweight prototype feedback where applicable.

### Accessibility features

ClearView is designed for low-vision and partially sighted Care Recipients. The current prototype includes:

- Meaningful semantics and appropriately identified interactive controls.
- Approximately 48 logical-pixel minimum interactive targets where applicable.
- Text Size preferences: Standard, Large, and Extra Large.
- A High Contrast mode with stronger boundaries, high-contrast text, and retained semantic status cues.
- Reduced Clutter mode, which simplifies the Dashboard while retaining critical actions and appointment information.
- Responsive phone and tablet layouts with text-scaling coverage.

## Setup and run

Complete the course-required development environment setup before running any project. The active Flutter prototype was validated with Flutter 3.47.0 and Dart 3.13.0.

### Flutter

```sh
cd flutter
flutter pub get
flutter run
```

To choose a specific connected simulator or emulator:

```sh
flutter devices
flutter run -d <device-id>
```

### React Native (Expo)

```sh
cd react-native
npm install
npm start
```

Choose a target in Expo, or run `npm run ios` or `npm run android` when the corresponding simulator or device environment is available.

### Maestro E2E

Install the Maestro CLI and verify it with `maestro --version`. Start the target
simulator or emulator and install/run the relevant ClearView application before
executing its flows. Maestro uses the rendered UI and accessibility tree, so no
test-only application dependency or committed binary is required.

Flutter uses its installed application bundle. Set `APP_ID` for the selected
platform, then run all flows:

```sh
# iOS Simulator
maestro --device <device-id> test -e APP_ID=com.example.clearviewFlutter e2e/maestro/flutter

# Android emulator
maestro --device <device-id> test -e APP_ID=com.example.clearview_flutter e2e/maestro/flutter
```

React Native runs in Expo Go. Start Expo with `npm run ios` or `npm run android`,
copy the `exp://...` URL printed by Expo, then run:

```sh
# iOS Simulator
maestro --device <device-id> test -e APP_ID=host.exp.Exponent -e EXPO_URL=<exp-url> e2e/maestro/react-native

# Android emulator
maestro --device <device-id> test -e APP_ID=host.exp.exponent -e EXPO_URL=<exp-url> e2e/maestro/react-native
```

The suites cover sign-in, appointment, message, and medical-note detail
workflows; an accessibility-preference change reflected on the dashboard; and
the shared prototype-feedback pattern. Run them on each locally available
supported simulator or emulator and retain the Maestro output as submission
evidence.

### Electron

```sh
cd electron
npm install
npm start
```

The Electron prototype is optimized for large displays and includes persistent navigation, menu and toolbar patterns, master/detail workflows, keyboard shortcuts, and desktop accessibility preferences.

Run its automated Electron UI tests from `electron/` with:

```sh
npm test
```

### React web (Vite)

```sh
cd react-web
npm install
npm run dev
```

For a production build:

```sh
npm run build
```

## Flutter validation and builds

Run these commands from `flutter/`.

```sh
dart format --output=none --set-exit-if-changed lib test
flutter analyze
flutter test
flutter test --coverage
```

The coverage report is written to `flutter/coverage/lcov.info`. To generate a browser-viewable HTML report:

```sh
genhtml coverage/lcov.info -o coverage/html
open coverage/html/index.html
```

Build an Android APK:

```sh
flutter build apk
```

The release APK is written to:

```text
build/app/outputs/flutter-apk/app-release.apk
```

Build for an iOS simulator on macOS:

```sh
flutter build ios --simulator
```

Run `flutter build ios` only when local iOS signing is configured.

Generated APKs and coverage reports are intentionally not committed to the repository. GitHub Actions retains `coverage/lcov.info` from successful Flutter CI runs as the `flutter-coverage` artifact.

## React Native validation

Run these commands from `react-native/` after installing dependencies with `npm ci` (or `npm install` for local development).

```sh
npm run lint
npm run format:check
npm test -- --runInBand
npm run test:coverage -- --runInBand
```

Jest runs unit and React Native Testing Library tests. The coverage report is written to `react-native/coverage/lcov-report/index.html`; it is intentionally not committed. The GitHub Actions Platform validation workflow runs the applicable Flutter, React Native, and security checks for pull requests and retains the React Native coverage artifact from successful validation.

## Known limitations and future enhancements

- All content is synthetic prototype data; there is no backend, persistence, networking, or real authentication.
- Accessibility preferences last for the current app session only.
- Some approved-design controls intentionally provide prototype feedback rather than a complete workflow.
- Electron and React web remain starter projects for future course work.
- Future work may add additional workflows, persistence, real service integration, and broader platform implementations.

## AI-assisted development

AI tools were used to assist with coding, code review, debugging, test-case generation, documentation, and implementation guidance. All AI-assisted output was reviewed, tested, and validated by the team before inclusion in the project.

## Development workflow

1. Start from an up-to-date `main` branch and create a focused branch for one task or issue.
2. Use the repository issue templates to describe bugs and proposed work before implementation when practical.
3. Keep changes within the relevant platform directory, run the applicable checks, and update documentation when behavior or setup changes.
4. Open a pull request using the provided template so teammates can review the purpose, testing, and scope of the change.
5. Merge only after team review and resolution of discussion items.
