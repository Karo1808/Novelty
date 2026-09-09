# Novelty

Novelty is a work-in-progress portfolio project exploring a social platform for readers. It was built to experiment with a TypeScript monorepo, session-based authentication, background jobs, external APIs, and a modern React frontend.

Development is currently paused, but the repository is kept as a portfolio snapshot of the architecture and features implemented so far.

## Implemented Features

- Email and password authentication
- Google and Amazon OAuth providers
- Email verification and password recovery
- Redis-backed sessions and onboarding drafts
- User profiles, avatars, and reading preferences
- Google Books search and book details
- Background email processing with BullMQ
- API documentation and observability integrations

## Tech Stack

- **Frontend:** React, TanStack Start, TanStack Router, TanStack Query, Tailwind CSS
- **API:** Hono, Zod OpenAPI
- **Data:** PostgreSQL, Drizzle ORM, Redis
- **Jobs and email:** BullMQ, React Email, Resend
- **Storage:** S3-compatible object storage
- **Tooling:** TypeScript, pnpm, Turborepo, Vitest, Docker

## Repository Structure

```text
apps/
  api/            Hono API
  web/            TanStack Start frontend
  email-sender/   Background email worker
packages/
  db/             Database schema and queries
  email/          Email client and templates
  lib/            Shared utilities and validation
  message-queue/  BullMQ configuration
  monitoring/     Monitoring experiments
  react-query/    Typed API client and query definitions
  redis/          Redis client and queries
  services/       Application services
  ui/             Shared React components
```

## Local Development

### Requirements

- Node.js 20 or newer
- pnpm 8
- Docker for PostgreSQL, Redis, and integration tests

Install dependencies and start the development tasks:

```sh
pnpm install
pnpm compose:dev:up
pnpm dev
```

Copy the relevant `.env.example` files to `.env.local` before starting each application.

Common workspace commands:

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## License

Licensed under the [MIT License](LICENSE). Third-party acknowledgements are listed in [NOTICE](NOTICE).
