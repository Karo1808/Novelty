2025-04-10 15:22:42 - Memory Bank Update (UMB) in progress. Updating systemPatterns.md.
# System Patterns

This file documents the architectural patterns used in the system.
YYYY-MM-DD HH:MM:SS - Log of updates made.

-

## Patterns

The project uses a monorepo architecture with Turborepo. It includes the following apps and packages:

- `api`: A Next.js app that serves as the API.
- `email-sender`: A worker that sends emails.
- `@novelty/db`: A package for database access.
- `@novelty/email`: A package for sending emails.
- `@novelty/lib`: A package for utility functions.
- `@novelty/message-queue`: A package for message queueing.
- `@novelty/redis`: A package for Redis access.
- `@novelty/services`: A package for business logic services.

The `api` app uses the following dependencies:
- `@asteasolutions/zod-to-openapi`: For generating OpenAPI specifications from Zod schemas.
- `@hono/node-server`: For running the Hono app on Node.js.
- `@hono/prometheus`: For exposing Prometheus metrics.
- `@hono/sentry`: For integrating with Sentry.
- `@hono/zod-openapi`: For integrating Zod schemas with OpenAPI.
- `@novelty/db`: For database access.
- `@novelty/email`: For sending emails.
- `@novelty/lib`: For utility functions.
- `@novelty/message-queue`: For message queueing.
- `@novelty/redis`: For Redis access.
- `@novelty/services`: For business logic services.
- `@scalar/hono-api-reference`: For generating API reference documentation.
- `@sentry/cli`: For Sentry CLI.
- `@sentry/node`: For Sentry Node.js integration.
- `@sentry/profiling-node`: For Sentry profiling.
- `dayjs`: For date manipulation.
- `dotenv`: For loading environment variables.
- `dotenv-expand`: For expanding environment variables.
- `hono`: For building web applications.
- `hono-pino`: For integrating Hono with Pino logger.
- `hono-rate-limiter`: For rate limiting.
- `js-yaml`: For parsing YAML files.
- `node-cron`: For scheduling cron jobs.
- `pino`: For logging.


The project uses the following packages:
- `@novelty/db`: For database access. It uses Drizzle ORM and PostgreSQL.
- `@novelty/email`: For sending emails. It uses React Email.
- `@novelty/lib`: For utility functions. It includes modules for authentication, date manipulation, and validations.
- `@novelty/message-queue`: For message queueing. It uses BullMQ.
- `@novelty/monitoring`: For monitoring. It uses Loki, Prometheus, and Promtail.
- `@novelty/redis`: For Redis access.
- `@novelty/services`: For business logic services.

[2025-04-10 15:10:09] - Added system patterns from file structure
- `pino-loki`: For sending logs to Loki.
- `pino-pretty`: For pretty-printing logs.
- `prom-client`: For Prometheus client.
- `rate-limit-redis`: For rate limiting with Redis.
- `zod`: For schema validation.

The `email-sender` app uses the following dependencies:
- `@novelty/email`: For sending emails.
- `@novelty/lib`: For utility functions.
- `@novelty/message-queue`: For message queueing.
- `bullmq`: For message queueing with BullMQ.
- `dotenv`: For loading environment variables.
- `dotenv-expand`: For expanding environment variables.
- `prom-client`: For Prometheus client.
- `react`: For building UI components.
- `react-dom`: For rendering UI components.
- `zod`: For schema validation.
