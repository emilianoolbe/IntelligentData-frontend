# IntelligentData - Frontend

<div align="center">

![IntelligentData Logo](./public/intelligentData_logo_complete_removebg.png)

**Modern Data Intelligence Platform**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-9-764ABC?style=flat&logo=redux)](https://redux-toolkit.js.org/)
[![React Query](https://img.shields.io/badge/React_Query-5-FF4154?style=flat&logo=react-query)](https://tanstack.com/query/latest)

</div>

---

## 📋 Overview

IntelligentData Frontend is a modern, production-ready web application built with cutting-edge technologies for data intelligence and web scraping operations. The application features a robust architecture following Clean/Hexagonal principles, with a focus on maintainability, testability, and developer experience.

### Key Features

- 🔐 **JWT Authentication** - Secure token-based authentication with refresh token support
- 🌐 **Multi-language Support** - Internationalization with i18next (Spanish default, English available)
- 📊 **Data Scraping** - Manual and scheduled scraping operations
- 🎨 **Modern UI** - Responsive design with Tailwind CSS v4
- 🧪 **Well Tested** - 212 tests with Vitest and Testing Library
- 📱 **Accessible** - WCAG 2.2 compliant components

---

## 🏗️ Architecture

### Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19 |
| **Build Tool** | Vite 8 |
| **Language** | TypeScript 6 |
| **Styling** | Tailwind CSS 4 |
| **State Management** | Redux Toolkit 9 |
| **Server State** | React Query 5 |
| **Routing** | React Router 7 |
| **Internationalization** | i18next |
| **Testing** | Vitest + Testing Library |
| **Notifications** | Sonner |

### Project Structure

```
src/
├── app/                    # Application core
│   ├── providers/          # Context providers
│   ├── router/             # Route configuration
│   └── store/               # Redux store
├── components/             # Shared UI components
│   ├── layout/             # Layout components
│   └── ui/                  # Reusable UI primitives
├── features/               # Feature modules
│   ├── auth/               # Authentication feature
│   ├── scraping/           # Scraping feature
│   └── ...                  # Other features
├── hooks/                  # Global custom hooks
├── i18n/                   # Internationalization
│   └── locales/             # Translation files
├── lib/                    # Utility libraries
├── providers/              # Theme and other providers
├── routes/                 # Route definitions
├── shared/                 # Shared modules
│   └── api/                 # API client configuration
├── types/                  # Global TypeScript types
└── utils/                  # Utility functions
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd IntelligentData-frontend

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file with the following variables:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=IntelligentData
```

### Development

```bash
# Start development server
pnpm dev

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Build for production
pnpm build

# Preview production build
pnpm preview
```

---

## 🧪 Testing

The project maintains comprehensive test coverage:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Run specific test file
pnpm test src/features/auth/__tests__
```

### Test Structure

- **Unit Tests**: Hook and utility function tests
- **Component Tests**: UI component behavior tests
- **Integration Tests**: Feature workflow tests

---

## 📦 Features

### Authentication (`src/features/auth/`)

- JWT-based authentication with refresh tokens
- Protected route guards
- Login/Register forms with validation
- Session persistence

### Scraping (`src/features/scraping/`)

#### Manual Scraping
- Product selection (MercadoLibre, Amazon, Fravega)
- Date range specification
- Custom URL support
- Real-time results display

#### Scheduled Scraping
- Cron-based scheduling
- Pause/Resume/Delete operations
- Execution history tracking
- Status notifications

---

## 🔧 Configuration

### Tailwind CSS

The project uses Tailwind CSS v4 with CSS variables for theme customization:

```css
@theme inline {
  --color-background: var(--bg-primary);
  --color-primary: var(--text-primary);
  /* ... other theme variables */
}
```

### i18n

Translation files are located in `src/i18n/locales/`:
- `es/` - Spanish (default)
- `en/` - English

Add new translations by creating JSON files in the locales folder.

---

## 📝 Development Guidelines

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add scheduled scraping feature
fix: correct authentication token refresh
docs: update API documentation
test: add tests for scraping workspace
refactor: improve query hook patterns
```

### Code Style

- **TypeScript**: Strict mode enabled
- **Imports**: Use `@/` alias for absolute imports
- **Components**: Functional components with hooks
- **Styles**: Tailwind utility classes, minimal custom CSS

### Testing Guidelines

- Test user behavior, not implementation details
- Use Testing Library queries (getBy, findBy, queryBy)
- Mock external dependencies (API, i18n)
- Maintain >80% coverage on critical paths

---

## 🔐 Security

- JWT tokens stored in httpOnly cookies (handled by backend)
- XSS protection via React's automatic escaping
- CSRF protection via same-origin policies
- Input validation on all forms
- API error handling with user-friendly messages

---

## 📈 Performance

- Route-based code splitting
- React Query caching and stale-while-revalidate
- Tailwind CSS purging for minimal bundle size
- Lazy loading for non-critical components

---

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes following the guidelines
3. Add/update tests as necessary
4. Submit a pull request

---

## 📄 License

This project is proprietary and confidential.

---

## 👥 Team

- **Development Team**: IntelligentData Engineering

---

<div align="center">

**Built with ❤️by the IntelligentData Team**

</div>