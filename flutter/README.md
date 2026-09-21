# ClearView Flutter

This directory contains ClearView's Flutter prototype. It implements the
course workflows and accessibility preferences described in the
[repository README](../README.md).

## Run

```sh
flutter pub get
flutter run
```

Run validation from this directory:

```sh
dart format --output=none --set-exit-if-changed lib test
flutter analyze
flutter test --coverage
```

See the repository README for platform setup, Maestro E2E commands, and
coverage evidence guidance.
