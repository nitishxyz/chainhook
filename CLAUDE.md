# Chainhook Development Guidelines

## Commands
- **Database**: `npm run db` (generate), `npm run dev:db` (push), `npm run dev:studio` (UI)
- **Frontend**: `cd frontend && npm run dev` (develop), `npm run build` (build)
- **Platform**: `cd platform && npm run dev` (develop), `npm run build` (build), `npm run lint` (lint)
- **SST**: `npx sst dev` (local development), `npx sst deploy` (deploy to AWS)

## Code Style
- **TypeScript**: Use strict mode with explicit types; avoid `any`
- **Components**: Use functional components with explicit prop interfaces
- **State**: Use React hooks; avoid class components
- **Imports**: Group imports by external/internal/relative paths with a blank line between groups
- **Errors**: Use typed error handling; catch specific errors when possible
- **Naming**: PascalCase for components/types, camelCase for variables/functions
- **API**: Use TanStack Query for data fetching in frontend; typed endpoints in platform
- **Formatting**: 2-space indentation; trailing semicolons; single quotes for strings
- **Database**: Use Drizzle ORM with typed schemas; typed queries via schema imports
- **Authentication**: Auth is configured via SST Auth; respect auth subjects in API handlers