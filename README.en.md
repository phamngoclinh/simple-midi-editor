# Simple MIDI Editor

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](RELEASE_NOTES.md)

[🇻🇳 Tiếng Việt](README.md) | [🇺🇸 English](README.en.md)

A concise guide to installing and running the frontend (Create React App) and backend (NestJS) concurrently on macOS / Linux.

## Table of Contents

- [Introduction](#introduction)
- [Requirements](#requirements)
- [Project Structure](#project-structure)
- [General Setup](#general-setup)
- [Frontend (CRA)](#frontend-create-react-app)
- [Backend (NestJS)](#backend-nestjs)
- [Concurrent Execution (Local)](#concurrent-execution-local)
- [Environment Variables Sample](#environment-variables-sample)
- [Useful Commands](#useful-commands-summary)
- [Troubleshooting](#troubleshooting-common-issues)

## Introduction

The project consists of two parts:

- Frontend: `frontend` directory — Create React App application.
- Backend: `backend` directory — NestJS application.

Example local paths:
`/Users/linhpham/WorkingPlace/Coding/simple-midi-editor/frontend`
`/Users/linhpham/WorkingPlace/Coding/simple-midi-editor/backend`

Live demo: https://mini-editor.linhpham.site/

## Features (v0.1.0)

- **Visual Editor**: Intuitive piano roll interface for viewing and editing MIDI notes.
- **Drag & Drop**: Support for dragging notes to change timing and pitch.
- **Multi-track Support**: Visualize and manage multiple MIDI tracks.
- **Playback**: Play back MIDI directly in the browser.
- **Modern Tech**: Next.js 15, React 19, Tailwind CSS v4, NestJS, SQLite.
- **Multi-language**: Supports English and Vietnamese.

## Requirements

- Node.js v16+ (use nvm to manage)
- npm / yarn / pnpm
- Git
- Docker & Docker Compose (if running via containers)
- Database: SQLite

## General Setup

1. Clone repo:

```bash
git clone <repo-url>
cd <repo-root>
```

2. Switch Node version if needed:

```bash
# if using nvm
nvm install --lts
nvm use --lts
```

## Frontend (Create React App)

1. Enter frontend directory:

```bash
cd frontend
```

2. Create .env file (see sample below).
3. Install dependencies:

```bash
npm install
# or
yarn
```

4. Run dev:

```bash
npm start
# or
yarn start
```

- Default CRA runs on `http://localhost:3000`.
- If backend API is on a different port, adjust `REACT_APP_API_URL`.

### Build production

```bash
npm run build
# or
yarn build
```

## Backend (NestJS)

1. Enter backend directory:

```bash
cd backend
```

2. Create .env file (see sample below).
3. Install dependencies:

```bash
npm install
# or
yarn
```

4. Run dev (hot-reload):

```bash
npm run start:dev
# or
yarn start:dev
```

- Default backend runs on `http://localhost:4000` (per `PORT` in .env).

### Build & Run production

```bash
npm run build
node dist/main.js
# or
npm run start:prod
```

## Concurrent Execution (Local)

Open 2 terminals:

- Terminal A (backend):

```bash
cd backend
npm run start:dev
```

- Terminal B (frontend):

```bash
cd frontend
npm start
```

Open frontend: `http://localhost:3000` — frontend calls API `REACT_APP_API_URL` (e.g. `http://localhost:4000`).

## Environment Variables Sample

Frontend (`frontend/.env.example`):

```env
REACT_APP_API_URL=http://localhost:4000
# add other variables starting with REACT_APP_
```

Backend (`backend/.env.example`):

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=db/midi-editor.sqlite
# other project specific variables
```

> With CRA: environment variables must start with `REACT_APP_` to be accessible in code.

## Useful Commands Summary

Frontend:

```bash
# install
npm install
# dev
npm start
# build
npm run build
# test
npm test
```

Backend:

```bash
# install
npm install
# dev
npm run start:dev
# build
npm run build
# prod
npm run start:prod
```

## Troubleshooting Common Issues

- **CORS**: Enable CORS in backend or use proxy in `frontend/package.json`:

```json
"proxy": "http://localhost:4000"
```

- **Env not loading**: Restart dev server after changing `.env`.
- **DB connection**: Check `DATABASE_URL`, ensure DB is running/file exists.
- **Node version mismatch**: Use `nvm use`.

## Running with Docker (docker-compose)

Project includes `docker-compose.yml` at root.

### Requirements
- Docker (Engine) and Docker Compose.

### Description of docker-compose.yml
- `backend` service: builds from `docker/backend.Dockerfile`, port 4000, volume `backend_data`.
- `frontend` service: builds from `docker/frontend.Dockerfile`, port 3000, depends on backend.

### IMPORTANT — Port availability
- Ensure ports 3000 and 4000 are available on host.

### Run stack (development)
At repo root:

```bash
# build and run in background
docker compose up --build -d
# view logs
docker compose logs -f
```

### Stop and Remove
```bash
# stop and remove containers
docker compose down

# stop and remove containers & volumes (data lost)
docker compose down -v
```

### Access Services
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Release Notes

See details in [RELEASE_NOTES.md](RELEASE_NOTES.md).

## Contributing

Contributions are welcome!

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
