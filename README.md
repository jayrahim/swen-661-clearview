# ClearView

**SWEN 661 — User Interface Implementation**<br>
**Team 6 — ClearView**

ClearView is a cross-platform UI prototype based on the CareConnect Care Recipient experience for people with low vision or partial sight impairment. The repository contains minimal starter applications for each platform while the team plans and implements the course project.

## Team members

| Team member | GitHub username |
| --- | --- |
| Jay Scruggs | [@jayrahim](https://github.com/jayrahim) |
| Nazia Mst | [@nazmst2](https://github.com/nazmst2) |
| Antonio Wilson | [@awilso112](https://github.com/awilso112) |

## Project documents

- [Team Charter — link to be added](#)
- [Project Proposal — link to be added](#)

Documentation can be stored in or referenced from [docs/](docs/README.md) as it becomes available.

## Repository structure

```text
.
├── .github/        # Issue and pull request templates
├── docs/           # Project documentation and references
├── electron/       # Electron desktop starter
├── flutter/        # Flutter starter
├── react-native/   # Expo / React Native starter
└── react-web/      # Vite / React web starter
```

## Setup and run

Install a current Flutter SDK, Node.js, and npm. From a fresh clone, use the commands below for the starter application you want to run.

### Flutter

```sh
cd flutter
flutter pub get
flutter run
```

For a non-interactive web build:

```sh
flutter build web
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

## Development workflow

1. Start from an up-to-date `main` branch and create a focused branch for one task or issue.
2. Use the repository issue templates to describe bugs and proposed work before implementation when practical.
3. Keep changes within the relevant platform directory, run the applicable checks, and update documentation when behavior or setup changes.
4. Open a pull request using the provided template so teammates can review the purpose, testing, and scope of the change.
5. Merge only after team review and resolution of discussion items.

Setup instructions and project documentation will evolve during development.
