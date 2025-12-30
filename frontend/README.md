# Simple MIDI Editor

A modern, web-based MIDI editor built with high-performance technologies and a clean architecture.

## 🚀 Highlights

- **Next.js 15 (App Router)**: Leveraging the latest Next.js features for performance and scalability.
- **Internationalization (i18n)**: Full multi-language support (English and Vietnamese) powered by `next-intl`.
- **Tailwind CSS v4**: Beautiful, responsive design with customized theme tokens and dark mode support.
- **Domain-Driven Design (DDD)**: Clean architecture separating domain logic, application use cases, and presentation layers.
- **Interactive Editor**: Drag-and-drop support for tracks and notes using `@dnd-kit`.

## 🛠 Tech Stack

- **Core**: [Next.js 15](https://nextjs.org/), [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: React Context & Hooks
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **i18n**: [next-intl](https://next-intl-docs.vercel.app/)
- **Icons**: Material Symbols Outlined
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)

## 📁 Project Structure

The project follows a clean architecture approach:

```text
src/
├── app/             # Next.js App Router (Routing, Layouts, Providers)
├── domain/          # Core Business Logic (Entities, Value Objects, Repositories)
├── application/     # Use Cases & Services
├── infrastructure/  # API Clients, Persistent Repositories, Redux/Context Stores
└── presentation/    # UI Components, Hooks, Contexts, and Utilities
```

## 🏁 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

```bash
git clone <repository-url>
cd simple-midi-editor/frontend
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Available Scripts

- `npm run dev`: Runs the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Checks the code for linting errors.
- `npm run format`: Formats the code using Prettier.

## 🌍 Multi-language Support

Languages are managed in the `messages/` directory.
- `en.json`: English translations.
- `vi.json`: Vietnamese translations.

To add or modify translations, update the respective JSON files and use the `useTranslations` hook in your components.

---

Built with ❤️ by the Simple MIDI Editor Team.
