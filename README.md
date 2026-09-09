# ClearView

**SWEN 661 — User Interface Implementation**<br>
**Team 6 — ClearView**

ClearView is a cross-platform UI prototype based on the CareConnect Care Recipient experience for people with low vision or partial sight impairment. The active implementation is the Flutter prototype; the Electron, Expo/React Native, and React/Vite directories remain starter projects for future course work.

## Team members

| Team member | GitHub username |
| --- | --- |
| Jay Scruggs | [@jayrahim](https://github.com/jayrahim) |
| Nazia Mst | [@nazmst2](https://github.com/nazmst2) |
| Antonio Wilson | [@awilso112](https://github.com/awilso112) |

## Project documents

The Team Charter and Project Proposal are maintained by the team outside this public repository.

The [docs/](docs/README.md) directory holds repository-safe documentation and design references. It does not duplicate or publicly link team documents stored in OneDrive.

## Repository structure

```text
.
├── .github/        # Issue, pull request, and workflow configuration
├── docs/           # Repository-safe documentation and design references
├── electron/       # Electron desktop starter
├── flutter/        # Active ClearView Flutter prototype
├── react-native/   # Expo / React Native starter
└── react-web/      # Vite / React web starter
```

## ClearView Flutter prototype

The Flutter prototype implements these meaningful UI states and workflows:

- Sign In and Dashboard
- Appointments and selected Appointment Detail
- Messages and selected Message Detail
- Medical Notes and selected Medical Note Detail
- Accessibility Settings
- Reduced Clutter Dashboard, rendered from the shared Reduced Clutter preference

The app uses synthetic data only. It does not include real authentication, PHI, networking, database persistence, or backend integration.

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

### Electron

```sh
cd electron
npm install
npm start
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

## Known limitations and future enhancements

- All content is synthetic prototype data; there is no backend, persistence, networking, or real authentication.
- Accessibility preferences last for the current app session only.
- Some approved-design controls intentionally provide prototype feedback rather than a complete workflow.
- Electron, React Native, and React web remain starter projects while the Flutter prototype is the active course implementation.
- Future work may add additional workflows, persistence, real service integration, and broader platform implementations.

## Week 4 contributions

| Team member | Contributions |
| --- | --- |
| Jay Scruggs | Riverpod foundation; repository and data models; Appointments and Appointment Detail; High Contrast; responsive phone/tablet layout; Flutter CI and formatting validation; integration and documentation. |
| Nazia Mst | Medical Notes and Medical Note Detail workflow; High Contrast pull-request merge and review coordination. |
| Antonio Wilson | Messages and Message Detail workflow; prototype-control feedback; Reduced Clutter Dashboard and accessibility-focused tests. |

## AI-assisted development

AI tools were used to assist with coding, code review, debugging, test-case generation, documentation, and implementation guidance. All AI-assisted output was reviewed, tested, and validated by the team before inclusion in the project.

## Development workflow

1. Start from an up-to-date `main` branch and create a focused branch for one task or issue.
2. Use the repository issue templates to describe bugs and proposed work before implementation when practical.
3. Keep changes within the relevant platform directory, run the applicable checks, and update documentation when behavior or setup changes.
4. Open a pull request using the provided template so teammates can review the purpose, testing, and scope of the change.
5. Merge only after team review and resolution of discussion items.
