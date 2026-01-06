# Release Notes

## v0.1.0 (Initial Release)

Welcome to the first open source release of **Simple MIDI Editor**!
This project provides a modern web-based interface for editing MIDI files, featuring a React frontend (Next.js) and a NestJS backend.

### Key Features

#### 🎼 MIDI Editing Core
- **Visual Editor**: Intuitive piano roll interface for viewing and editing MIDI notes.
- **Drag & Drop**: Support for dragging notes to change timing and pitch.
- **Multi-track Support**: Visualize and manage multiple MIDI tracks.
- **Playback**: In-browser MIDI playback capabilities.

#### 💻 Frontend (Next.js)
- **Modern Stack**: Built with Next.js 15 (App Router), React 19, and Tailwind CSS v4.
- **i18n Support**: Full internationalization support (English/Vietnamese) using `next-intl`.
- **Responsive Design**: Mobile-friendly interface optimized for various screen sizes.
- **Drag & Drop Library**: Utilizes `@dnd-kit` for accessible and robust drag-and-drop interactions.

#### 🚀 Backend (NestJS)
- **Robust API**: RESTful API structure built on NestJS framework.
- **Database**: SQLite integration with TypeORM for lightweight and portable data storage.
- **Docker Ready**: Full Docker and Docker Compose setup for easy deployment.

### Development & Deployment
- **Docker Compose**: One-command setup to run both frontend and backend services.
- **Local Development**: clear instructions for running locally with hot-reloading.

### Contributors
- Initial work by [Linh Pham]

---
*For more details on installation and usage, please refer to the [README](README.md).*
