# ClearView

**Course:** SWEN 661 - User Interface Implementation  
**Team:** Team 6 - ClearView

ClearView is a cross-platform UI prototype based on the CareConnect Care Recipient experience for users with low vision or partial sight impairment.

## Team members

- Jay Scruggs — jayrahim
- Nazia Mst — nazmst2
- Antonio Wilson — awilso112

## Team Charter

Team Charter link: _To be added._

## Repository structure

```text
.
├── docs/          # Project documentation and references
├── electron/      # Electron desktop starter
├── flutter/       # Flutter starter
├── react-native/  # Expo / React Native starter
└── react-web/     # Vite / React starter
```

## Setup and run

Use a current Flutter SDK, Node.js, and npm. Run these commands from the repository root after cloning.

### Flutter

```sh
cd flutter
flutter pub get
flutter run
```

To verify a web build without launching a device:

```sh
cd flutter
flutter build web
```

### React Native (Expo)

```sh
cd react-native
npm install
npm start
```

From Expo's interactive prompt, choose an available target, or use `npm run ios` or `npm run android`.

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

To create a production build:

```sh
cd react-web
npm run build
```

These setup instructions will evolve during development.
