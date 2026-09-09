# Week 4 validation and submission evidence

Run the commands below from `flutter/` after final merges. Generated artifacts are intentionally excluded from version control.

## Code quality, tests, and security

```sh
dart format --output=none --set-exit-if-changed lib test
flutter analyze
flutter test
flutter test --coverage
lcov --summary coverage/lcov.info
genhtml coverage/lcov.info -o coverage/html
open coverage/html/index.html
osv-scanner --lockfile=pubspec.lock
```

Retain a screenshot of the coverage summary and generated HTML report outside the repository.

## Platform builds

```sh
flutter build apk
flutter build ios --simulator
```

The Android APK is generated at:

```text
build/app/outputs/flutter-apk/app-release.apk
```

Run `flutter build ios` only when local signing is configured.

## Manual validation checklist

- Sign In opens Dashboard.
- Dashboard navigation reaches Appointments, Messages, Medical Notes, and Accessibility Settings.
- Each list opens detail content for the selected synthetic item and Back returns appropriately.
- Verify normal, High Contrast, and Reduced Clutter Dashboard states.
- Verify Standard, Large, and Extra Large text settings.
- Check phone portrait, tablet portrait, and tablet landscape where practical.
- Check Android phone/tablet and iPhone/iPad simulators or emulators.
- Capture evidence of major workflows, responsive layouts, High Contrast, and Reduced Clutter for the video/submission.

## CI evidence

The Flutter CI workflow validates dependency installation, formatting, analysis, and tests with coverage. Download its `flutter-coverage` artifact to retain the raw `lcov.info` report from a successful workflow run.
