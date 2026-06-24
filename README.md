# Et_vacancy

Et_vacancy is a TypeScript-based Next.js job marketplace for Ethiopian job seekers and employers. The app features authentication, role-aware dashboards, job search and filtering, application tracking, and a modern UI built with reusable components.

## Features

- Next.js 16 + React 19 App Router project
- TypeScript support with ESLint validation
- Credentials authentication with NextAuth
- Employer and job seeker role-based pages
- Job search, filtering, and saved jobs
- Apply to jobs with CV upload simulation
- Employer dashboard with applicant status tracking
- Mock data-powered app flow for rapid local development
- Prisma schema configured for SQLite

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Build for production

```bash
npm run build
```

### Start production server

```bash
npm run start
```

### Lint the project

```bash
npm run lint
```

## Project Structure

- `app/` - page routes, auth, dashboards, and layout
- `components/` - UI components and reusable elements
- `lib/` - utilities and mock data
- `prisma/` - Prisma schema for SQLite
- `public/` - static assets and images

## Key Pages

- `/` - home landing page
- `/jobs` - searchable job listings
- `/jobs/[id]` - job detail and apply flow
- `/companies` - company browse page
- `/auth/login` - login page
- `/auth/register` - registration page
- `/auth/forgot-password` - password reset page
- `/dashboard` - user dashboard
- `/employer/dashboard` - employer dashboard
- `/employer/jobs/create` - job posting form

## Notes

- Currently the app relies on mock data from `lib/mock-data.ts`.
- Prisma is configured for SQLite in `prisma/schema.prisma`.
- The form flows and UI are ready for integration with a real backend.

## Recommended Commands

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`

## Troubleshooting

- If the development server does not start, check `npm install` output for dependency issues.
- If build fails, run `npm run lint` to identify code issues.
- Use `npm install` again after updating packages.
